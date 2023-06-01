import { ChatCompletionRequestMessage } from "openai";
import { openai } from "../openai";
import { retry, retryIfTransientApiError } from "../../../utils/retry";
import { ZodObject, ZodArray, ZodString, ZodNumber, ZodTypeAny } from "zod";

type ChatModel = "gpt-3.5-turbo" | "gpt-4"

function parseStringBasedOnSchema(content: string, schema: ZodTypeAny) {
  if (schema instanceof ZodString) return content;
  if (schema instanceof ZodObject || schema instanceof ZodArray) return JSON.parse(content);
  if (schema instanceof ZodNumber) return parseFloat(content);
  throw new Error("unimplemented zod schema");
}

export async function chat<T extends ZodTypeAny>(
  messages: ChatCompletionRequestMessage[],
  schema: T,
  model: ChatModel = "gpt-3.5-turbo",
  temperature = 0.2,
) {
  const getChatCompletion = () => openai().createChatCompletion({
    model,
    messages,
    temperature,
  });

  const processChatCompletion = async () => {
    const res = await retryIfTransientApiError(getChatCompletion);

    const { message } = res.data.choices[0];

    if (!message) {
      throw new Error("no message received from chat completion");
    }

    const parsedContent = parseStringBasedOnSchema(message.content, schema);
    return schema.parse(parsedContent);
  };

  return retry(processChatCompletion);
}

export async function chatSimple<T extends ZodTypeAny>(
  prompt: string,
  schema: T,
  model: ChatModel = "gpt-3.5-turbo",
  temperature = 0,
) {
  return chat(
    [{ role: "user", content: prompt }],
    schema,
    model,
    temperature,
  );
}
