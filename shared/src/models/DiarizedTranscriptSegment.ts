export interface DiarizedTranscriptSegment {
  startMs: number,
  endMs: number,
  speakerIndex: number,
  text: string,
  speakerLabel?: string,
  recordingId: string,
  organisationId: string
}