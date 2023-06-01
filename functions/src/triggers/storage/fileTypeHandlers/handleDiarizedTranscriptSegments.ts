import { StorageEvent } from "firebase-functions/v2/storage";
import { downloadJson } from "../../../clients/firebase/storage/downloadToMemory";
import { speakerLabelIndexMapFromDiarizedSegments } from "../../../clients/openai/summarisation/transformations/speakerLabelIndexMapFromDiarizedSegments";
import { speakerLabelledSegmentsFromDiarizedSegments } from "../../../clients/openai/summarisation/transformations/speakerLabelledSegmentsFromDiarizedSegments";
import { smallTalkShiftIndexFromSpeakerLabelledSegments } from "../../../clients/openai/summarisation/transformations/smallTalkShiftIndexFromSpeakerLabelledSegments";
import { paraphrasedSpeakerTurnsFromDiarizedSegments } from "../../../clients/openai/summarisation/transformations/paraphrasedTranscriptSegmentsFromDiarizedSegments";
import { z } from "zod";
import { DiarizedTranscriptSegment, diarizedTranscriptSegmentSchema } from "../../../clients/openai/transcription/interfaces/DiarizedTranscriptSegment";
import { logger } from "firebase-functions/v2";
import { FileType } from "../fileTypes/FileType";
import { saveObjectToStorage } from "../fileTypes/saveFileType";

export const handleDiarizedTranscriptSegments = async (event: StorageEvent, filePath: string) => {
  logger.info("handling diarized transcript segments", { filePath });

  const diarizedSegments: DiarizedTranscriptSegment[] = await downloadJson({ filePath }, z.array(diarizedTranscriptSegmentSchema));
  const speakerLabelIndexMap = await speakerLabelIndexMapFromDiarizedSegments(diarizedSegments);
  const speakerLabelledSegments = speakerLabelledSegmentsFromDiarizedSegments(diarizedSegments, speakerLabelIndexMap);
  const smallTalkShiftIndex = await smallTalkShiftIndexFromSpeakerLabelledSegments(speakerLabelledSegments);
  const smallTalkLabelledSegments = speakerLabelledSegments.map((segment) => ({
    ...segment,
    isSmallTalk: segment.speakerIndex < smallTalkShiftIndex,
  }));

  const paraphrasedSpeakerTurns = await paraphrasedSpeakerTurnsFromDiarizedSegments(smallTalkLabelledSegments);

  await saveObjectToStorage(
    filePath,
    paraphrasedSpeakerTurns,
    FileType.PARAPHRASED_SPEAKER_TURNS
  );
};
