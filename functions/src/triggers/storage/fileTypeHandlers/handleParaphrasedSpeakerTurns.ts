import { logger } from "firebase-functions/v2";
import { StorageEvent } from "firebase-functions/v2/storage";

export const handleParaphrasedSpeakerTurns = async (event: StorageEvent, filePath: string) => {
  logger.info("handling paraphrased speaker turns", { filePath });
};
