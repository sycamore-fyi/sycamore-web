import { chatSimple } from "../../actions/chat";
import { speakerLabelIndexMapPrompt } from "../../prompts/speakerLabelIndexMapPrompt";
import { DiarizedTranscriptSegment } from "../../transcription/interfaces/DiarizedTranscriptSegment";
import { SpeakerLabelIndexMap } from "../interfaces/SpeakerLabelIndexMap";
import { speakerLinesFromSpeakerTurns } from "./speakerLinesFromSpeakerTurns";
import { speakerTurnsFromDiarizedSegments } from "./speakerTurnsFromDiarizedSegments";
import { z } from "zod";

const arrayOfIndexes = z.array(z.number().int().positive());

const schema = z.object({
  Q: arrayOfIndexes,
  A: arrayOfIndexes,
});

export async function speakerLabelIndexMapFromDiarizedSegments(
  diarizedSegments: DiarizedTranscriptSegment[]
): Promise<SpeakerLabelIndexMap> {
  const speakerTurns = speakerTurnsFromDiarizedSegments(diarizedSegments);
  const speakerLines = speakerLinesFromSpeakerTurns(speakerTurns, true);
  const transcriptExcerpt = speakerLines.slice(0, 50).join("\n");
  const prompt = speakerLabelIndexMapPrompt(transcriptExcerpt);
  const content = await chatSimple(prompt, schema);

  return {
    ...content,
    UNKNOWN: [],
  };
}
