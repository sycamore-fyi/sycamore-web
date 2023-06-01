import { ffmpeg } from "./ffmpeg";
import * as path from "path";
import { v4 as uuid } from "uuid";

export async function cropAudioFile(
  inputPath: string,
  startMs: number,
  endMs: number,
): Promise<string> {
  if (startMs >= endMs) {
    throw new Error("startMs must be lower than endMs");
  }

  const durationMs = endMs - startMs;

  const parsedInputPath = path.parse(inputPath);
  const outputPath = path.join(
    parsedInputPath.dir,
    `${parsedInputPath.name}-cropped-${uuid()}.mp3`
  );

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions("-ss", (startMs / 1000).toFixed(3), "-t", (durationMs / 1000).toFixed(3))
      .output(outputPath)
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", reject)
      .run();
  });
}
