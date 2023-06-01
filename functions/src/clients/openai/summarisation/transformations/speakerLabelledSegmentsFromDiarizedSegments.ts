import { DiarizedTranscriptSegment } from "../../transcription/interfaces/DiarizedTranscriptSegment";
import { SpeakerLabelledTranscriptSegment } from "../interfaces/SpeakerLabelledTranscriptSegment";
import { SpeakerLabel } from "../interfaces/SpeakerLabel";
import { SpeakerLabelIndexMap } from "../interfaces/SpeakerLabelIndexMap";

export function speakerLabelledSegmentsFromDiarizedSegments(
  diarizedSegments: DiarizedTranscriptSegment[],
  questionAnswerSpeakerIndexes: SpeakerLabelIndexMap
): SpeakerLabelledTranscriptSegment[] {
  const speakerIndexToLabelMap: Record<number, SpeakerLabel> = Object
    .entries(questionAnswerSpeakerIndexes)
    .reduce((map, [speakerLabel, speakerIndexes]) => ({
      ...map,
      ...speakerIndexes.reduce((newMap, speakerIndex) => ({
        [speakerIndex]: speakerLabel,
      }), {}),
    }), {});

  return diarizedSegments.map((diarizedSegment) => ({
    ...diarizedSegment,
    speakerLabel: speakerIndexToLabelMap[diarizedSegment.speakerIndex],
  }));
}
