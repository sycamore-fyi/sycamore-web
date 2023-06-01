import { logger } from "firebase-functions/v2";
import { bucket } from "../../../clients/firebase/admin";
import { FileType } from "./FileType";
import { fileNameFromExpectedFileType } from "./expectedFileData";
import * as path from "path";

export async function saveObjectToStorage(sourceDataFilePath: string, data: unknown, fileType: FileType) {
  logger.info("saving file type to storage", { fileType });

  const destinationPath = path.join(
    path.dirname(sourceDataFilePath),
    fileNameFromExpectedFileType(fileType)
  );

  await bucket.file(destinationPath).save(JSON.stringify(data));

  logger.info("saved file type", {
    destinationPath,
    fileType,
  });
}
