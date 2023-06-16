interface ParsedFilePath {
  organisationId: string,
  callId: string,
  fileName: string
}

export function parseFilePath(filePath: string): ParsedFilePath {
  const pathComponents = filePath.split("/");
  if (pathComponents.length !== 3) throw new Error("path should be 3 long");
  const [organisationId, callId, fileName] = pathComponents;

  return {
    organisationId,
    callId,
    fileName,
  };
}
