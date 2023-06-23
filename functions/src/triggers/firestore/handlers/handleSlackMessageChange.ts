import { logger } from "firebase-functions/v2";
import { PineconeDocumentType } from "../../../clients/pinecone/enums/PineconeDocumentType";
import { embed } from "../../../clients/openai/actions/embed";
import { InstantMessage } from "@sycamore-fyi/shared";
import { wrapChangeHandler } from "../utils/wrapChangeHandler";
import { upsert } from "../../../clients/pinecone/actions/upsert";
import { pineconeIndex } from "../../../clients/pinecone/pinecone";
import { constructVector } from "../../../clients/pinecone/utils/constructVector";

async function insertEmbeddingToPinecone(messageData: InstantMessage, embeddingsVector: number[]) {
  const { text } = messageData;

  logger.info("inserting message text embedding to pinecone", { text });

  const vector = constructVector({
    values: embeddingsVector,
    documentType: PineconeDocumentType.INSTANT_MESSAGE,
    organisationId: "",
    text,
  });

  logger.info("creating vector in pinecone for message");

  const index = await pineconeIndex();
  const upsertResponse = await upsert(index, [vector]);
  logger.log("pinecone vector created successfully", upsertResponse);
}

export const handleInstantMessageChange = wrapChangeHandler<InstantMessage>({
  async onCreate(message) {
    const messageText = message.text;
    logger.info("message created", message);

    if (!message || !messageText) {
      logger.info("no data or message text, returning");
      return;
    }

    const [embeddingsVector] = await embed([messageText]);

    await insertEmbeddingToPinecone(message, embeddingsVector);
  },
});
