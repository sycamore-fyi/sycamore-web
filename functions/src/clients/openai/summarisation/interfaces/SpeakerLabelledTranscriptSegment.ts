import { DiarizedTranscriptSegment } from "../../transcription/interfaces/DiarizedTranscriptSegment";
import { SpeakerLabel } from "./SpeakerLabel";

export interface SpeakerLabelledTranscriptSegment extends DiarizedTranscriptSegment {
  speakerLabel: SpeakerLabel;
}
