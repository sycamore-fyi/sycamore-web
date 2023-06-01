import * as path from "path";
import { ffmpeg } from "./ffmpeg";


export async function convertToMp3(inputPath: string): Promise<string> {
  const parsedInputPath = path.parse(inputPath);
  const outputPath = path.join(
    parsedInputPath.dir,
    `${parsedInputPath.name}.mp3`
  );

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .output(outputPath)
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", reject)
      .run();
  });
}
