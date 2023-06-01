import { ffmpeg } from "./ffmpeg";

export async function audioDurationMs(inputPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg(inputPath).ffprobe((err, metadata) => {
      if (err || !metadata.format.duration) {
        reject(err);
        return;
      }

      resolve(metadata.format.duration * 1000);
    });
  });
}
