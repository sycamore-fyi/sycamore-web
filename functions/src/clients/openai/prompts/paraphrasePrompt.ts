import { parsedSpeakersTurnsFromSpeakerLines } from "../summarisation/transformations/parsedSpeakersTurnsFromSpeakerLines";

export function paraphrasePrompt(speakerLines: string[]): string {
  const parsedSpeakerTurns = parsedSpeakersTurnsFromSpeakerLines(speakerLines);
  const resultPrompt = parsedSpeakerTurns
    .filter((turn) => turn.speakerLabel && turn.turnIndex)
    .map((turn) => `${turn.turnIndex as number} ${turn.speakerLabel as string} ${turn.speakerIndex}: <paraphrase>`)
    .join("\n");

  return `***Context***

An excerpt from a transcript of a user research session is delimited by triple speech marks below.

Each line is a separate person speaking, and uses the following format: <line index> <speaker label>: <words>

The speaker label is Q for the interviewer and A for the research subject.

***Instructions***

For each line, replace the text with a paraphrase of the words of the transcript line in the most concise way possible while retaining all of the meaning. Phrase this paraphrase from the point of view of the person speaking it.

Output your results in the following format:

${resultPrompt}

You shouldn't return any other text.
"""
${speakerLines.join("\n")}
"""`;
}
