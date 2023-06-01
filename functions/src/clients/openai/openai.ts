import { Configuration, OpenAIApi } from "openai";
import { getCredentials, openaiCredentials } from "../firebase/secrets";

export interface OpenAICredentials {
  apiKey: string
}

export const openai = (
  { apiKey }: OpenAICredentials = getCredentials<OpenAICredentials>(openaiCredentials)
) => {
  const configuration = new Configuration({ apiKey });
  return new OpenAIApi(configuration);
};
