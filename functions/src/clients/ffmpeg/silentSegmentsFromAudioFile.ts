import * as path from "path";
import * as fs from "fs";
import { ffmpeg } from "./ffmpeg";
import { v4 as uuid } from "uuid";

interface TimeSegment {
  startMs: number,
  endMs: number,
}

export async function silentSegmentsFromAudioFile(
  inputPath: string,
  maxDecibels = -30,
  minDurationMs = 500
): Promise<TimeSegment[]> {
  const timeSegments: TimeSegment[] = [];
  let prevSilenceStart = 0;

  const parsedInputPath = path.parse(inputPath);
  const outputPath = path.join(
    parsedInputPath.dir,
    `${parsedInputPath.name}-${uuid()}.mp3`
  );

  const silenceStartRegex = /silence_start: (\d+\.\d+)/;
  const silenceEndRegex = /silence_end: (\d+\.\d+)/;

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .audioFilters(`silencedetect=n=${maxDecibels}dB:d=${minDurationMs / 1000}`)
      .output(outputPath)
      .on("end", async () => {
        await fs.promises.unlink(outputPath);
        resolve(timeSegments);
      })
      .on("stderr", (logString: string) => {
        if (!logString.includes("silencedetect")) return;

        const silenceStartMatch = logString.match(silenceStartRegex);
        const silenceEndMatch = logString.match(silenceEndRegex);
        const silenceStart = silenceStartMatch ? parseFloat(silenceStartMatch[1]) : null;
        const silenceEnd = silenceEndMatch ? parseFloat(silenceEndMatch[1]) : null;

        if (silenceStart) {
          prevSilenceStart = silenceStart;
        }

        if (silenceEnd) {
          const timeSegment: TimeSegment = {
            startMs: prevSilenceStart * 1000,
            endMs: silenceEnd * 1000,
          };

          timeSegments.push(timeSegment);
        }
      })
      .on("error", reject)
      .run();
  });
}
