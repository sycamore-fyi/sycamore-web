import { z } from "zod";
import { transcriptSegmentSchema } from "./TranscriptSegment";

export const diarizedTranscriptSegmentSchema = transcriptSegmentSchema.extend({
  speakerIndex: z.number().int().gte(0),
});

export type DiarizedTranscriptSegment = typeof diarizedTranscriptSegmentSchema._type
