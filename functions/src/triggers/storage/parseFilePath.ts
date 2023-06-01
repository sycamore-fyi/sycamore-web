interface ParsedFilePath {
  organisationId: string,
  recordingId: string,
  fileName: string
}

export function parseFilePath(filePath: string): ParsedFilePath {
  const pathComponents = filePath.split("/");
  if (pathComponents.length !== 3) throw new Error("path should be 3 long");
  const [organisationId, recordingId, fileName] = pathComponents;

  return {
    organisationId,
    recordingId,
    fileName,
  };
}
