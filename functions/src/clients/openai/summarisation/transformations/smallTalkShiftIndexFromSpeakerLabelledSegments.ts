import { chatSimple } from "../../actions/chat";
import { shiftOutOfSmallTalkPrompt } from "../../prompts/shiftOutOfSmallTalkPrompt";
import { SpeakerLabelledTranscriptSegment } from "../interfaces/SpeakerLabelledTranscriptSegment";
import { speakerLinesFromSpeakerTurns } from "./speakerLinesFromSpeakerTurns";
import { speakerTurnsFromDiarizedSegments } from "./speakerTurnsFromDiarizedSegments";
import { z } from "zod";

export async function smallTalkShiftIndexFromSpeakerLabelledSegments(
  speakerLabelledSegments: SpeakerLabelledTranscriptSegment[]
): Promise<number> {
  const speakerTurns = speakerTurnsFromDiarizedSegments(speakerLabelledSegments);
  const speakerLines = speakerLinesFromSpeakerTurns(speakerTurns, true);
  const transcriptExcerpt = speakerLines.slice(0, 50).join("\n");
  const prompt = shiftOutOfSmallTalkPrompt(transcriptExcerpt);
  const index = await chatSimple({ prompt, schema: z.number().int().positive() });

  return index;
}
