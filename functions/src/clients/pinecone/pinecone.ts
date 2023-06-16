import { PineconeClient } from "@pinecone-database/pinecone";
import { getCredentials, pineconeCredentials } from "../firebase/secrets";
import { AsyncCache } from "../../utils/AsyncCache";
import { PineconeIndex } from "./enums/PineconeIndex";

export interface PineconeCredentials {
  apiKey: string
}

export const fetchPineconeClient = async (
  { apiKey }: PineconeCredentials = getCredentials(pineconeCredentials)
) => {
  const client = new PineconeClient();

  await client.init({
    apiKey,
    environment: "us-west1-gcp-free",
  });

  return client;
};

const pineconeCache = new AsyncCache(fetchPineconeClient, 1000 * 60 * 60 * 24);

export const pinecone = pineconeCache.retrieveValue;

export const pineconeIndex = async () => {
  const client = await pinecone();
  // eslint-disable-next-line new-cap
  return client.Index(PineconeIndex.PRIMARY);
};
