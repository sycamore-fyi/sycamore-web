import { TranscriptSegment } from "../../transcription/interfaces/TranscriptSegment";
import { SpeakerLabel as SpeakerLabel } from "./SpeakerLabel";

export interface ParsedSpeakerTurn {
  speakerLabel?: SpeakerLabel,
  speakerIndex?: number,
  turnIndex?: number,
  text?: string
}

export interface SpeakerTurn {
  speakerIndex: number;
  speakerLabel?: SpeakerLabel;
  startMs: number;
  endMs: number;
  text: string;
  segments: TranscriptSegment[];
}
