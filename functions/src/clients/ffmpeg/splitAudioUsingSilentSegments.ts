import * as fs from "fs";
import { cropAudioFile } from "./cropAudioFile";
import { audioDurationMs } from "./audioDurationMs";
import { TimeSegment } from "../openai/transcription/interfaces/TimeSegment";

export async function splitAudioUsingSilentSegments(
  audioPath: string,
  silentSegments: TimeSegment[],
  maxChunkSizeMb: number
): Promise<string[]> {
  const [
    durationMs, { size: sizeBytes },
  ] = await Promise.all([
    audioDurationMs(audioPath),
    fs.promises.stat(audioPath),
  ]);

  const sizeMb = sizeBytes / Math.pow(1024, 2);
  const targetChunkSizeMb = maxChunkSizeMb * 0.9;
  const targetChunkDurationMs = targetChunkSizeMb * (durationMs / sizeMb);

  let prevChunkStartMs = 0;

  const croppedPaths: string[] = [];

  const cropFileAndAddPathToArray = async (startMs: number, endMs: number) => {
    const croppedPath = await cropAudioFile(
      audioPath,
      startMs,
      endMs
    );

    croppedPaths.push(croppedPath);
  };

  for (let i = 0; i < silentSegments.length; i++) {
    const silentSegment = silentSegments[i];
    const isLastIteration = i + 1 === silentSegments.length;

    if (isLastIteration) {
      await cropFileAndAddPathToArray(prevChunkStartMs, durationMs);
      break;
    }

    const midpointMs = (silentSegment.endMs + silentSegment.startMs) / 2;
    const chunkDurationMs = midpointMs - prevChunkStartMs;

    const nextSegment = silentSegments[i + 1];
    const nextMidpointMs = (nextSegment.startMs + nextSegment.endMs) / 2;
    const nextChunkDurationMs = nextMidpointMs - prevChunkStartMs;

    if (chunkDurationMs < targetChunkDurationMs && nextChunkDurationMs >= targetChunkDurationMs) {
      await cropFileAndAddPathToArray(
        prevChunkStartMs,
        midpointMs
      );

      prevChunkStartMs = midpointMs;
    }
  }

  return croppedPaths;
}
