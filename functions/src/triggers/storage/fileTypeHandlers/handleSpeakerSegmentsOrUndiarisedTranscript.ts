import { StorageEvent } from "firebase-functions/v2/storage";
import * as path from "path";
import { bucket } from "../../../clients/firebase/admin";
import { logger } from "firebase-functions/v2";
import { downloadJson, downloadString } from "../../../clients/firebase/storage/downloadToMemory";
import { diarisedSegmentsFromSpeakerSegmentsAndTranscriptSegments } from "../../../clients/openai/transcription/transformations/diarisedSegmentsFromSpeakerSegmentsAndTranscriptSegments";
import { speakerSegmentsFromRttm } from "../../../clients/openai/transcription/transformations/speakerSegmentsFromRttm";
import { transcriptSegmentsFromOpenaiResponse } from "../../../clients/openai/transcription/transformations/transcriptSegmentsFromOpenaiResponse";
import { fileNameFromExpectedFileType } from "../fileTypes/expectedFileData";
import { FileType } from "../fileTypes/FileType";
import { saveObjectToStorage } from "../fileTypes/saveFileType";
import { z } from "zod";
import { CreateTranscriptionResponse } from "../../../clients/openai/actions/transcribe";
import { createBatchDatum, writeBatch } from "../../../clients/firebase/firestore/writeBatch";
import { Collection } from "../../../clients/firebase/firestore/collection";
import { parseFilePath } from "../parseFilePath";
import { sendEmail } from "../../../clients/sendgrid/sendEmail";
import { TemplateName } from "../../../clients/sendgrid/TemplateName";
import { config } from "../../../config";

export const handleSpeakerSegmentsOrUndiarisedTranscript = async (event: StorageEvent, filePath: string) => {
  logger.info("handling speaker segments or undiarized transcript", { filePath });

  const dirName = path.dirname(filePath) + "/";

  const [files] = await bucket.getFiles({ prefix: dirName });

  logger.info("retrieved files from Storage directory of submitted file", {
    dirName,
    filePaths: files.map((file) => file.name),
    fileNames: files
      .filter((file) => !file.name.endsWith("/"))
      .map((file) => path.basename(file.name)),
  });

  const { organisationId, callId } = parseFilePath(filePath);
  const callRef = Collection.Call.doc(callId);

  const [speakerSegmentsFile, undiarizedTranscriptFile] = [
    fileNameFromExpectedFileType(FileType.SPEAKER_SEGMENTS),
    fileNameFromExpectedFileType(FileType.UNDIARIZED_TRANSCRIPT),
  ].map((fileName: string) => files.find((file) => path.basename(file.name) === fileName));

  if (speakerSegmentsFile) await callRef.update({ isDiarized: true });
  if (undiarizedTranscriptFile) await callRef.update({ isTranscribed: true });

  const canConstructDiarizedTranscriptSegments = speakerSegmentsFile && undiarizedTranscriptFile;

  if (!canConstructDiarizedTranscriptSegments) {
    logger.info("speaker segments and undiarized transcript aren't both present, returning");
    return;
  }

  logger.info("both speaker segments and undiarized transcript file are present, can construct diarized transcript. Downloading files");

  const [
    speakerSegmentsRttmContent,
    undiarizedTranscript,
  ] = await Promise.all([
    downloadString({ file: speakerSegmentsFile }),
    downloadJson({ file: undiarizedTranscriptFile }, z.any()) as Promise<CreateTranscriptionResponse>,
  ]);

  logger.info("files downloaded successfully, constructing diarized segments");

  const diarizedSegments = diarisedSegmentsFromSpeakerSegmentsAndTranscriptSegments(
    speakerSegmentsFromRttm(speakerSegmentsRttmContent),
    transcriptSegmentsFromOpenaiResponse(undiarizedTranscript)
  );

  const call = await Collection.Call.doc(callId).get();
  const user = await Collection.User.doc(call.data()!.userId).get();
  const { email, name } = user.data()!;

  await Promise.all([
    saveObjectToStorage(
      filePath,
      diarizedSegments,
      FileType.DIARIZED_TRANSCRIPT_SEGMENTS
    ),
    writeBatch(diarizedSegments.map((diarizedSegment) => createBatchDatum(
      Collection.DiarizedTranscriptSegment.doc(),
      {
        ...diarizedSegment,
        organisationId,
        callId,
      }
    ))),
    callRef.update({ wereDiarizedSegmentsCreated: true }),
    sendEmail(TemplateName.CALL_PROCESSED)([{
      toEmail: email!,
      data: {
        addressee: name!,
        callLink: `${config().CLIENT_URL}/org/${organisationId}/calls/${callId}`,
      },
    }]),
  ]);
};
