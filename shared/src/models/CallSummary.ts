export interface CallSummary {
  markdown: string,
  createdAt: Date,
  promptVersion: string,

  organisationId: string,
  callId: string,
}