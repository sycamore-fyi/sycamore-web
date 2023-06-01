export function shiftOutOfSmallTalkPrompt(transcriptExcerpt: string): string {
  return `Context:

Below is a transcript of a user research session between an interviewer (the person asking questions, denoted by the speaker label "Q") and a participant, who is answering them (denoted by the speaker label "A"). The transcript text is delimited by triple quotes.

Each new line of the transcript is a separate person talking. Each line is of the format:

<line index> <speaker label>: <words>

Instructions:

Step 1:
Return the maximum line index in the transcript

Step 2:
Return the line index where one of the speakers shifts the conversation from small talk to the main thrust of the session

This must be equal to or less than the maximum line index. If the small talk is still going on by the last line, return "?"

Output the results in the following JSON format:

{"step1": <index>, "step2": <index>}

Return only the JSON, with no other text.

"""
${transcriptExcerpt}
"""`;
}
