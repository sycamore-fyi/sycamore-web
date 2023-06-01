import { z } from "zod";
import { timeSegmentSchema } from "./TimeSegment";

export const transcriptSegmentSchema = timeSegmentSchema.extend({
  text: z.string(),
});

export type TranscriptSegment = typeof transcriptSegmentSchema._type
