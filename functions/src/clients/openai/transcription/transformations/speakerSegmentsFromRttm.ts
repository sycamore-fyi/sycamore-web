import { logger } from "firebase-functions/v2";
import { SpeakerSegment } from "../interfaces/SpeakerSegment";

const parseMs = (seconds: string) => Math.round(parseFloat(seconds) * 1000);

export function speakerSegmentsFromRttm(rttmContent: string): SpeakerSegment[] {
  logger.info("getting speaker segments from rttm content", {
    rttmHead: rttmContent.split("\n").slice(0, 5).join("\n"),
  });

  const speakerSegments = rttmContent
    .split("\n")
    .filter((rttmLine) => rttmLine.length > 0)
    .map((rttmLine) => {
      // rttm lines are always in the same format
      const fields = rttmLine.split(" ");
      const startSeconds = fields[3];
      const endSeconds = fields[3];
      const speakerLabel = fields[7];
      const speakerIndex = parseInt(speakerLabel.replace("SPEAKER_", ""), 10);

      return {
        startMs: parseMs(startSeconds),
        endMs: parseMs(endSeconds),
        speakerIndex,
      };
    });

  logger.info("got speaker segments", {
    speakerSegmentsHead: speakerSegments.slice(0, 5),
  });

  return speakerSegments;
}
