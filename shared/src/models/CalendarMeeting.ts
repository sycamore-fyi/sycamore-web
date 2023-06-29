export interface CalendarMeeting {
  createdAt: Date,
  startsAt: Date,
  endsAt: Date,
  organisationId: string,
  meetingLink?: string,
}