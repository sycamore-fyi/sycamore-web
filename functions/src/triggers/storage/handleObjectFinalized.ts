import { StorageEvent } from "firebase-functions/v2/storage";
import { logger } from "firebase-functions/v2";
import { getFileType } from "./fileTypes/getFileType";
import { FileType } from "./fileTypes/FileType";
import { handleUploadedCall } from "./fileTypeHandlers/handleUploadedCall";
import { handleSpeakerSegmentsOrUndiarisedTranscript } from "./fileTypeHandlers/handleSpeakerSegmentsOrUndiarisedTranscript";
import { wrapFunctionHandler } from "../wrapFunctionHandler";
import { handleDiarizedTranscriptSegments } from "./fileTypeHandlers/handleDiarizedTranscriptSegments";
import { handleParaphrasedSpeakerTurns } from "./fileTypeHandlers/handleParaphrasedSpeakerTurns";

const handlers = {
  [FileType.UPLOADED_CALL]: handleUploadedCall,
  [FileType.SPEAKER_SEGMENTS]: handleSpeakerSegmentsOrUndiarisedTranscript,
  [FileType.UNDIARIZED_TRANSCRIPT]: handleSpeakerSegmentsOrUndiarisedTranscript,
  [FileType.DIARIZED_TRANSCRIPT_SEGMENTS]: handleDiarizedTranscriptSegments,
  [FileType.PARAPHRASED_SPEAKER_TURNS]: handleParaphrasedSpeakerTurns,


  [FileType.PROCESSED_CALL]: (event: StorageEvent) => {
    logger.info(event);
  },
};

export const handleObjectFinalized = wrapFunctionHandler(async (event: StorageEvent) => {
  logger.info("new object finalised in storage", event);

  const { name: filePath, contentType } = event.data;
  const fileType = getFileType(filePath, contentType);

  logger.info("determined file type", { fileType });

  await handlers[fileType](event, filePath);
});
