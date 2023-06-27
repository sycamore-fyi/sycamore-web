import { last } from "../../../../utils/last";

function getTokenCount(text: string) {
  return text.length * 0.36;
}

export function chunkSpeakerLines(
  speakerLines: string[],
  maxTokenCount: number,
  lineOverlap = 2
) {
  const lineChunks = [""];
  let index = 0;
  let totalIterations = 0;

  while (index < speakerLines.length) {
    const line = speakerLines[index];
    totalIterations += 1;

    // return if stuck in infinite loop
    if (totalIterations > 2000) {
      return lineChunks;
    }

    if (last(lineChunks) === "") {
      lineChunks[lineChunks.length - 1] = line;
      index += 1;
      continue;
    }

    const proposedNextLine = `${lineChunks[lineChunks.length - 1]}\n${line}`;

    if (getTokenCount(proposedNextLine) < maxTokenCount) {
      lineChunks[lineChunks.length - 1] = proposedNextLine;
      index += 1;
    } else {
      lineChunks.push("");
      index -= lineOverlap;
    }
  }

  return lineChunks;
}
