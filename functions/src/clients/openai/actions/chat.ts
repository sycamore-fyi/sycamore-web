import { ChatCompletionRequestMessage, OpenAIApi } from "openai";
import { openai } from "../openai";
import { retry, retryIfTransientApiError } from "../../../utils/retry";
import { ZodObject, ZodArray, ZodString, ZodNumber, ZodTypeAny, ZodType } from "zod";
import { logger } from "firebase-functions/v2";

type ChatModel = "gpt-3.5-turbo" | "gpt-4" | "gpt-3.5-turbo-16k" | "gpt-4-0613"

function parseStringBasedOnSchema(content: string, schema: ZodTypeAny) {
  if (schema instanceof ZodString) return content;
  if (schema instanceof ZodObject || schema instanceof ZodArray) return JSON.parse(content);
  if (schema instanceof ZodNumber) return parseFloat(content);
  throw new Error("unimplemented zod schema");
}

interface ChatRequest<Data> {
  messages: ChatCompletionRequestMessage[],
  instance?: OpenAIApi,
  schema: ZodType<Data>,
  model?: ChatModel,
  temperature?: number
}

export async function chat<Data>({
  messages,
  schema,
  instance = openai(),
  model = "gpt-3.5-turbo",
  temperature = 0.2,
}: ChatRequest<Data>) {
  if (temperature < 0 || temperature > 1) throw new Error("Invalid tempature value");

  const getChatCompletion = () => instance.createChatCompletion({
    model,
    messages,
    temperature,
  });

  const processChatCompletion = async () => {
    const res = await retryIfTransientApiError(getChatCompletion);

    const { message } = res.data.choices[0];

    logger.log("got response", message);

    if (!message) {
      throw new Error("no message received from chat completion");
    }

    const parsedContent = parseStringBasedOnSchema(message.content, schema);
    return schema.parse(parsedContent);
  };

  return retry(processChatCompletion);
}

export async function chatSimple<Data>({
  prompt,
  schema,
  model = "gpt-3.5-turbo",
  instance = openai(),
  temperature = 0,
}: {
  prompt: string,
  schema: ZodType<Data>,
  model?: ChatModel,
  instance?: OpenAIApi,
  temperature?: number,
}) {
  return chat({
    instance,
    messages: [{ role: "user", content: prompt }],
    schema,
    model,
    temperature,
  });
}
