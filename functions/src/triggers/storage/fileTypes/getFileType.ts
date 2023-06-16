import { logger } from "firebase-functions/v2";
import * as path from "path";
import supportedCallUploadFileFormatData from "./supportedCallUploadFileFormatData";
import { expectedFileData } from "./expectedFileData";
import { FileType } from "./FileType";

export function getFileType(filePath: string, contentType?: string): FileType {
  logger.info("determining file type", { filePath, contentType });

  if (!contentType) throw new Error("file has no content type");

  const fileName = path.basename(filePath);
  const fileExtension = path.extname(filePath).toLowerCase().replace(".", "");
  const filenameWithoutExtension = path.parse(filePath).name;

  logger.info("parsed info from file path", {
    fileName,
    fileExtension,
    filenameWithoutExtension,
  });

  const expectedFileDatum = expectedFileData.find((datum) => (
    datum.contentType === contentType &&
    datum.fileName === fileName
  ));

  if (expectedFileDatum) return expectedFileDatum.fileType;

  const isUploadedFileInAcceptedFormat = !!supportedCallUploadFileFormatData.find((datum) => datum.contentType === contentType);

  if (isUploadedFileInAcceptedFormat && filenameWithoutExtension === "uploaded_call") return FileType.UPLOADED_CALL;

  throw new Error("invalid combination of filename and content type");
}
