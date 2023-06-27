export function combineSpeakerLineChunks(
  speakerLineChunks: string[],
  overlapLines = 2
) {
  let lines = "";

  for (let index = 0; index < speakerLineChunks.length; index++) {
    const lineChunk = speakerLineChunks[index];

    if (index === 0) {
      lines += lineChunk;
      continue;
    }

    const splitLines = lineChunk.split("\n");
    lines += "\n" + splitLines.slice(overlapLines + 1).join("\n");
  }

  return lines.split("\n");
}
