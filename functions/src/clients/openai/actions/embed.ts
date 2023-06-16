import { logger } from "firebase-functions/v2";
import { retryIfTransientApiError } from "../../../utils/retry";
import { OpenAIApi } from "openai";
import { openai } from "../openai";

export async function embed(
  input: string[],
  instance: OpenAIApi = openai(),
) {
  logger.info("embedding text", { input });

  const res = await retryIfTransientApiError(() => instance.createEmbedding({
    model: "text-embedding-ada-002",
    input,
  }));

  logger.info("embedding successful");

  const embeddings = res.data.data.map((d) => d.embedding);

  return embeddings;
}
