import { z } from "zod";

export const timeSegmentSchema = z.object({
  startMs: z.number().positive(),
  endMs: z.number().positive(),
});

export type TimeSegment = typeof timeSegmentSchema._type
