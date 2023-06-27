import { chatSimple } from "../../actions/chat";
import { speakerLabelIndexMapPrompt } from "../../prompts/speakerLabelIndexMapPrompt";
import { DiarizedTranscriptSegment } from "../../transcription/interfaces/DiarizedTranscriptSegment";
import { SpeakerLabelIndexMap } from "../interfaces/SpeakerLabelIndexMap";
import { speakerLinesFromSpeakerTurns } from "./speakerLinesFromSpeakerTurns";
import { speakerTurnsFromDiarizedSegments } from "./speakerTurnsFromDiarizedSegments";
import { z } from "zod";

const indexArraySchema = z.array(z.number().int().gte(0));

const responseSchema = z.object({
  step1: indexArraySchema,
  step2: z.object({
    interviewers: indexArraySchema,
    participants: indexArraySchema,
  }),
});

export async function speakerLabelIndexMapFromDiarizedSegments(
  diarizedSegments: DiarizedTranscriptSegment[]
): Promise<SpeakerLabelIndexMap> {
  const speakerTurns = speakerTurnsFromDiarizedSegments(diarizedSegments);
  const speakerLines = speakerLinesFromSpeakerTurns(speakerTurns, false, false);
  const transcriptExcerpt = speakerLines.slice(0, 50).join("\n");
  const prompt = speakerLabelIndexMapPrompt(transcriptExcerpt);
  const content = await chatSimple({ prompt, schema: responseSchema, model: "gpt-3.5-turbo-16k" });
  const { interviewers, participants } = content.step2;

  return {
    Q: interviewers,
    A: participants,
    UNKNOWN: [],
  };
}
