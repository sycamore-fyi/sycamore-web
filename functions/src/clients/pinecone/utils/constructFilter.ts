import { Environment } from "@sycamore-fyi/shared";
import { getEnvironment } from "../../firebase/Environment";
import { PineconeDocumentType } from "../enums/PineconeDocumentType";

interface FilterRequest {
  documentType: PineconeDocumentType,
  organisationId: string,
  environment?: Environment,
  otherFilters?: Record<string, string | number>
}

export function constructFilter({
  documentType,
  organisationId,
  environment = getEnvironment(),
  otherFilters = {},
}: FilterRequest) {
  if (!environment) {
    throw new Error("Environment must be present when constructing filter");
  }

  const allFilters = {
    environment,
    organisationId,
    documentType,
    ...(otherFilters ?? {}),
  };

  const filterArray = Object.entries(allFilters).map(([key, value]) => ({ [key]: value }));

  return {
    "$and": filterArray,
  };
}
