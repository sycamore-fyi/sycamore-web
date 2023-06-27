export function summarisePrompt(speakerLines: string[]) {
  return `***Context***

A transcript of a sales call is delimitd by triple quotes below. Each line is a speaker turn, with Q indicating the seller and A indicating the prospect.

***Instructions***

Summarise the sales call using concise bullet points. Return the summary in markdown.

Use the following headings:
- Next steps: any actions the seller or prospect needs to take - aim for 200 works
- Prospect's problems: any issues the prospect currently has in their role, that the seller could allieviate - aim for 400 words
- Personal information: any small talk between the seller and prospect the seller should remember - aim for 200 words

Transcript:

"""
${speakerLines.join("\n")}
"""`;
}
