import { VectorOperationsApi } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

export const query = async (
  index: VectorOperationsApi,
  vector: number[],
  filter: { $and: { [key: string]: string | number }[] },
  limit = 10
) => {
  const { matches } = await index.query({
    queryRequest: {
      vector,
      filter,
      topK: limit,
      includeValues: false,
      includeMetadata: true,
    },
  });

  return matches;
};
