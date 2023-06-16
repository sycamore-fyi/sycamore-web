export interface Call {
  organisationId: string,
  userId: string,
  createdAt: Date,
  uploadedFilePath: string,
  processedFilePath?: string,
  durationMs?: number,
  processedAt?: Date
}
