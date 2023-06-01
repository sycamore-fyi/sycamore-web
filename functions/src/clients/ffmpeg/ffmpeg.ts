// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegPath = require("ffmpeg-static");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ffmpegCommand = require("fluent-ffmpeg");
import { FfmpegCommand } from "fluent-ffmpeg";

export function ffmpeg(inputPath: string): FfmpegCommand {
  if (!ffmpegPath) throw new Error("static ffmpeg path is null");

  return ffmpegCommand({ source: inputPath })
    .setFfmpegPath(ffmpegPath as string);
}
