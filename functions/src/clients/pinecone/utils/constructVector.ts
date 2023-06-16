import { Vector } from "@pinecone-database/pinecone";
import { Environment } from "@sycamore-fyi/shared";
import { randomUUID } from "crypto";
import { getEnvironment } from "../../firebase/Environment";
import { PineconeDocumentType } from "../enums/PineconeDocumentType";

interface VectorConstructor {
  values: number[],
  documentType: PineconeDocumentType,
  organisationId: string,
  metadata?: { [key: string]: string | number }
  environment?: Environment,
}

export function constructVector({
  values,
  documentType,
  organisationId,
  metadata = {},
  environment = getEnvironment(),
}: VectorConstructor): Vector {
  return {
    id: randomUUID(),
    values,
    metadata: {
      environment,
      documentType,
      organisationId,
      ...metadata,
    },
  };
}
