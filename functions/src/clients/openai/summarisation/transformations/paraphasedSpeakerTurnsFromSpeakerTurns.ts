import { z } from "zod";
import { speakerLinesFromSpeakerTurns } from "./speakerLinesFromSpeakerTurns";
import { chunkSpeakerLines } from "./chunkSpeakerLines";
import { paraphrasePrompt } from "../../prompts/paraphrasePrompt";
import { chatSimple } from "../../actions/chat";
import { combineSpeakerLineChunks } from "./combineSpeakerLineChunks";
import { parsedSpeakersTurnsFromSpeakerLines } from "./parsedSpeakersTurnsFromSpeakerLines";
import { SpeakerTurn } from "../interfaces/SpeakerTurn";

export async function paraphasedSpeakerTurnsFromSpeakerTurns(speakerTurns: SpeakerTurn[]) {
  const speakerLines = speakerLinesFromSpeakerTurns(speakerTurns, true);
  const speakerLineChunks = chunkSpeakerLines(speakerLines, 3000);
  const prompts = speakerLineChunks.map((chunk) => paraphrasePrompt(chunk.split("\n")));

  const results: string[] = [];

  for (const prompt of prompts) {
    const result = await chatSimple({
      prompt,
      model: "gpt-3.5-turbo-16k",
      schema: z.string(),
    });

    results.push(result);
  }

  const paraphrasedSpeakerLines = combineSpeakerLineChunks(results);
  const paraphrasedSpeakerTurns = parsedSpeakersTurnsFromSpeakerLines(paraphrasedSpeakerLines);

  return paraphrasedSpeakerTurns;
}
