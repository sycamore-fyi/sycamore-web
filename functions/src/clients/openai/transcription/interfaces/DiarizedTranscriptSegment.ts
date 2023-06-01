import { z } from "zod";
import { transcriptSegmentSchema } from "./TranscriptSegment";

export const diarizedTranscriptSegmentSchema = transcriptSegmentSchema.extend({
  speakerIndex: z.number().int().positive(),
});

export type DiarizedTranscriptSegment = typeof diarizedTranscriptSegmentSchema._type
