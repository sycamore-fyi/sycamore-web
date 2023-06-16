import { Vector } from "@pinecone-database/pinecone";
import { UpsertResponse, VectorOperationsApi } from "@pinecone-database/pinecone/dist/pinecone-generated-ts-fetch";

export async function upsert(
  index: VectorOperationsApi,
  vectors: Vector[]
): Promise<UpsertResponse> {
  return index.upsert({ upsertRequest: { vectors } });
}
