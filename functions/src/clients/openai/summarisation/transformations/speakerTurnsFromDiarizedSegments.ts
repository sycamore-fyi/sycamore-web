import { DiarizedTranscriptSegment } from "../../transcription/interfaces/DiarizedTranscriptSegment";
import { SpeakerLabelledTranscriptSegment } from "../interfaces/SpeakerLabelledTranscriptSegment";
import { last } from "../../../../utils/last";
import { SpeakerTurn } from "../interfaces/SpeakerTurn";

export function speakerTurnsFromDiarizedSegments(
  segments: (DiarizedTranscriptSegment | SpeakerLabelledTranscriptSegment)[]
): SpeakerTurn[] {
  return segments.reduce<SpeakerTurn[]>((turns, segment) => {
    const { speakerIndex, text, endMs } = segment;
    const lastTurn = last(turns);
    if (lastTurn?.speakerIndex === speakerIndex) {
      return [
        ...turns.slice(0, -1),
        {
          ...lastTurn,
          text: `${lastTurn.text} ${text}`,
          endMs,
          segments: [
            ...lastTurn.segments,
            segment,
          ],
        },
      ];
    } else {
      return [
        ...turns,
        {
          ...segment,
          segments: [segment],
        },
      ];
    }
  }, []);
}
