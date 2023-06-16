export interface DiarizedTranscriptSegment {
  startMs: number,
  endMs: number,
  speakerIndex: number,
  text: string,
  speakerLabel?: string,
  callId: string,
  organisationId: string
}