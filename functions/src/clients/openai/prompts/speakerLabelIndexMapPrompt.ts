export function speakerLabelIndexMapPrompt(transcriptExcerpt: string): string {
  return `Context:

Below is a transcript of a user research session between an interviewer (who is asking questions) and a participant, who is answering them.

Each new line of the transcript is a separate person talking. Each line is of the format:

<speaker index>: <words>

Instructions:

1. Get a list of all the speaker indexes, and return them in a deduplicated, comma separated list
2. Take the list from step 1, and identify the indexes that are interviewers and those that are participants

Return the results in the following JSON format:

{"step1": array<number>,"step2": { "interviewers": array<number>, "participants": array<number> } }

Do not return any other text. Your response will be passed to some Python code that expects the above format

If it's unclear to you who the interviewer(s) are, return "?"

Transcript:

${transcriptExcerpt}`;
}
