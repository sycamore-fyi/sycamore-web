import { openai } from "../openai";

export async function embed(text: string): Promise<number[]> {
  const res = await openai().createEmbedding({
    model: "text-embedding-ada-002",
    input: text,
  });

  return res.data.data[0].embedding;
}
