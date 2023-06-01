import { chatSimple } from "../../actions/chat";
import { paraphrasePrompt } from "../../prompts/paraphrasePrompt";
import { SpeakerLabelledTranscriptSegment } from "../interfaces/SpeakerLabelledTranscriptSegment";
import { ParsedSpeakerTurn } from "../interfaces/SpeakerTurn";
import { parsedSpeakersTurnsFromSpeakerLines } from "./parsedSpeakersTurnsFromSpeakerLines";
import { speakerLinesFromSpeakerTurns } from "./speakerLinesFromSpeakerTurns";
import { speakerTurnsFromDiarizedSegments } from "./speakerTurnsFromDiarizedSegments";
import { z } from "zod";
import { splitSpeakerTurnsByTokenLength } from "./splitSpeakerTurnsByTokenLength";

export async function paraphrasedSpeakerTurnsFromDiarizedSegments(
  speakerLabelledSegments: SpeakerLabelledTranscriptSegment[]
): Promise<ParsedSpeakerTurn[]> {
  const speakerTurns = speakerTurnsFromDiarizedSegments(speakerLabelledSegments);
  const speakerTurnChunks = splitSpeakerTurnsByTokenLength(speakerTurns, 1200);

  const paraphrasedSpeakerTurnChunks = await Promise.all(speakerTurnChunks.map(async (speakerTurnChunk) => {
    const speakerLines = speakerLinesFromSpeakerTurns(speakerTurnChunk, true);
    const transcriptExcerpt = speakerLines.join("\n");
    const prompt = paraphrasePrompt(transcriptExcerpt);
    const content = await chatSimple(prompt, z.string());
    const paraphrasedSpeakerTurns = parsedSpeakersTurnsFromSpeakerLines(content.split("\n"));
    return paraphrasedSpeakerTurns;
  }));

  const duplicatedParaphrasedSpeakerTurns = paraphrasedSpeakerTurnChunks.flat();
  const paraphrasedSpeakerTurns = duplicatedParaphrasedSpeakerTurns.reduce<ParsedSpeakerTurn[]>((turns, turn) => {
    const indexes = turns.map((t) => t.speakerIndex);
    if (!turn.speakerIndex || indexes.includes(turn.speakerIndex)) return turns;

    return [
      ...turns,
      turn,
    ];
  }, []);

  return paraphrasedSpeakerTurns;
}
