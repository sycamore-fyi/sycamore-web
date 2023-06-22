export enum CallState {
  UPLOADED = "UPLOADED",
}

export interface Call {
  organisationId: string,
  userId: string,
  createdAt: Date,
  filePath?: string,
  durationMs?: number,

  isProcessed: boolean,
  isDiarized: boolean,
  isTranscribed: boolean,
  wereDiarizedSegmentsCreated: boolean,
  isSummarised: boolean,

  isRejected: boolean,
  rejectionReason?: string
}
