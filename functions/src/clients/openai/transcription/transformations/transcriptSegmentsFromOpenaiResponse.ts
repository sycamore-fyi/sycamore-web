import { logger } from "firebase-functions/v2";
import { CreateTranscriptionResponse } from "../../actions/transcribe";
import { TranscriptSegment } from "../interfaces/TranscriptSegment";

export function transcriptSegmentsFromOpenaiResponse(
  transcriptResponse: CreateTranscriptionResponse
): TranscriptSegment[] {
  const transcriptSegments = transcriptResponse.segments
    .map((segment) => ({
      startMs: segment.start * 1000,
      endMs: segment.end * 1000,
      text: segment.text.trim(),
    }))
    .filter((segment) => segment.text.length > 0);

  logger.info("got transcript segments from openai response", {
    transcriptSegmentHead: transcriptSegments.slice(0, 5),
    transcriptSegmentTail: transcriptSegments.slice(-5),
  });

  return transcriptSegments;
}
