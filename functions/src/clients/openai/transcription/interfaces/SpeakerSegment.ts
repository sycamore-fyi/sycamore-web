import { timeSegmentSchema } from "./TimeSegment";
import { z } from "zod";

export const speakerSegmentSchema = timeSegmentSchema.extend({
  speakerIndex: z.number().int().gte(0),
});

export type SpeakerSegment = typeof speakerSegmentSchema._type
