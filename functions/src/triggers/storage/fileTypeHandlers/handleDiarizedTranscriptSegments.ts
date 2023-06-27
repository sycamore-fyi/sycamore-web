import { StorageEvent } from "firebase-functions/v2/storage";
import { downloadJson } from "../../../clients/firebase/storage/downloadToMemory";
import { speakerLabelIndexMapFromDiarizedSegments } from "../../../clients/openai/summarisation/transformations/speakerLabelIndexMapFromDiarizedSegments";
import { speakerLabelledSegmentsFromDiarizedSegments } from "../../../clients/openai/summarisation/transformations/speakerLabelledSegmentsFromDiarizedSegments";
import { z } from "zod";
import { diarizedTranscriptSegmentSchema } from "../../../clients/openai/transcription/interfaces/DiarizedTranscriptSegment";
import { logger } from "firebase-functions/v2";
import { speakerTurnsFromDiarizedSegments } from "../../../clients/openai/summarisation/transformations/speakerTurnsFromDiarizedSegments";
import { paraphasedSpeakerTurnsFromSpeakerTurns } from "../../../clients/openai/summarisation/transformations/paraphasedSpeakerTurnsFromSpeakerTurns";
import { createBatchDatum, writeBatch } from "../../../clients/firebase/firestore/writeBatch";
import { Collection } from "../../../clients/firebase/firestore/collection";
import { parseFilePath } from "../parseFilePath";
import { saveObjectToStorage } from "../fileTypes/saveFileType";
import { FileType } from "../fileTypes/FileType";
import { getEnvironment } from "../../../clients/firebase/Environment";
import { Environment } from "@sycamore-fyi/shared";
import { ParsedSpeakerTurn } from "../../../clients/openai/summarisation/interfaces/SpeakerTurn";
import * as edParaphrasedSpeakerTurns from "./paraphrased_speaker_turns.json";
import { sendEmail } from "../../../clients/sendgrid/sendEmail";
import { TemplateName } from "../../../clients/sendgrid/TemplateName";
import { fetchById } from "../../../clients/firebase/firestore/fetchById";
import { config } from "../../../config";

export const handleDiarizedTranscriptSegments = async (event: StorageEvent, filePath: string) => {
  logger.info("handling diarized transcript segments", { filePath });

  let paraphrasedSpeakerTurns: ParsedSpeakerTurn[];

  const { organisationId, callId } = parseFilePath(filePath);

  if (getEnvironment() === Environment.PROD) {
    logger.info("environment is prod, calling openai to paraphrase segments");
    const diarizedSegments = await downloadJson({ filePath }, z.array(diarizedTranscriptSegmentSchema));
    logger.info("download diarized segments", diarizedSegments.slice(0, 5));
    const speakerLabelIndexMap = await speakerLabelIndexMapFromDiarizedSegments(diarizedSegments);
    logger.info("got speaker labelled indexes", speakerLabelIndexMap);
    const speakerLabelledSegments = speakerLabelledSegmentsFromDiarizedSegments(diarizedSegments, speakerLabelIndexMap);
    logger.info("labelled diarized segments with speakers", speakerLabelledSegments.slice(0, 5));
    const speakerTurns = speakerTurnsFromDiarizedSegments(speakerLabelledSegments);
    logger.info("constructed speaker turns from labelled diarised segments", speakerTurns.slice(0, 5));
    paraphrasedSpeakerTurns = await paraphasedSpeakerTurnsFromSpeakerTurns(speakerTurns);
    logger.info("got paraphrased speaker turns", paraphrasedSpeakerTurns.slice(0, 5));
  } else {
    paraphrasedSpeakerTurns = edParaphrasedSpeakerTurns as ParsedSpeakerTurn[];
  }

  const [call] = await Promise.all([
    fetchById(Collection.Call, callId),
    writeBatch(paraphrasedSpeakerTurns.map((turn) => createBatchDatum(
      Collection.ParaphrasedSpeakerTurn.doc(),
      {
        turnIndex: turn.turnIndex ?? 0,
        text: turn.text ?? "",
        speakerLabel: turn.speakerLabel?.toString() ?? 0,
        speakerIndex: turn.speakerIndex ?? 0,
        organisationId,
        callId,
      }
    ))),
    saveObjectToStorage(
      filePath,
      paraphrasedSpeakerTurns,
      FileType.PARAPHRASED_SPEAKER_TURNS
    ),
  ]);

  const user = await fetchById(Collection.User, call.userId);
  const { email, name } = user;

  if (!email || !name) return;

  await sendEmail(TemplateName.CALL_PROCESSED)([{
    toEmail: email,
    data: {
      addressee: name.split(" ")[0],
      callLink: `${config().CLIENT_URL}/org/${organisationId}/calls/${callId}`,
    },
  }]);
};
