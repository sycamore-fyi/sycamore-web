import { z } from "zod";

export const timeSegmentSchema = z.object({
  startMs: z.number().gte(0),
  endMs: z.number().gte(0),
});

export type TimeSegment = typeof timeSegmentSchema._type
