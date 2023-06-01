import { StorageEvent } from "firebase-functions/v2/storage";
import { logger } from "firebase-functions/v2";
import { getFileType } from "./fileTypes/getFileType";
import { FileType } from "./fileTypes/FileType";
import { handleUploadedRecording as handleUploadedRecording } from "./fileTypeHandlers/handleUploadedRecording";
import { handleSpeakerSegmentsOrUndiarisedTranscript } from "./fileTypeHandlers/handleSpeakerSegmentsOrUndiarisedTranscript";
import { wrapFunctionHandler } from "../wrapFunctionHandler";
// import { handleDiarizedTranscriptSegments } from "./fileTypeHandlers/handleDiarizedTranscriptSegments"
// import { handleParaphrasedSpeakerTurns } from "./fileTypeHandlers/handleParaphrasedSpeakerTurns"

const handlers = {
  [FileType.UPLOADED_RECORDING]: handleUploadedRecording,
  [FileType.SPEAKER_SEGMENTS]: handleSpeakerSegmentsOrUndiarisedTranscript,
  [FileType.UNDIARIZED_TRANSCRIPT]: handleSpeakerSegmentsOrUndiarisedTranscript,
  // [FileType.DIARIZED_TRANSCRIPT_SEGMENTS]: handleDiarizedTranscriptSegments,
  // [FileType.PARAPHRASED_SPEAKER_TURNS]: handleParaphrasedSpeakerTurns,


  [FileType.PROCESSED_RECORDING]: (event: StorageEvent) => {
    console.log(event);
  },
  [FileType.DIARIZED_TRANSCRIPT_SEGMENTS]: (event: StorageEvent) => {
    console.log(event);
  },
  [FileType.PARAPHRASED_SPEAKER_TURNS]: (event: StorageEvent) => {
    console.log(event);
  },
};

export const handleObjectFinalized = wrapFunctionHandler(async (event: StorageEvent) => {
  logger.info("new object finalised in storage", event);

  const { name: filePath, contentType } = event.data;
  const fileType = getFileType(filePath, contentType);

  logger.info("determined file type", { fileType });

  await handlers[fileType](event, filePath);
});
