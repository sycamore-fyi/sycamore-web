import * as os from "os";
import * as path from "path";
import * as fs from "fs";
import { logger } from "firebase-functions/v2";
import { v4 as uuid } from "uuid";
import { DownloadRequest } from "./DownloadRequest";
import { fileFromDownloadRequest } from "./fileFromDownloadRequest";

export async function downloadToDisk<T>(
  downloadRequest: DownloadRequest,
  onDownloadComplete: (tempFilePath: string) => Promise<T>
): Promise<T> {
  const file = fileFromDownloadRequest(downloadRequest);
  const fileName = path.basename(file.name);
  const tempDir = path.join(os.tmpdir(), uuid());
  const tempFilePath = path.join(tempDir, fileName);

  logger.info("making temp directory", {
    tempDir,
  });

  await fs.promises.mkdir(tempDir, { recursive: true });

  logger.info("temp directory created, downloading file from Cloud Storage into directory", {
    tempFilePath,
  });

  await file.download({
    destination: tempFilePath,
  });

  logger.info("file downloaded successfully");

  let returnedData: T;

  try {
    returnedData = await onDownloadComplete(tempFilePath);
  } finally {
    logger.info("deleting temp dir", {
      tempDir,
    });

    await fs.promises.rm(tempDir, { recursive: true });

    logger.info("temp dir deleted");
  }

  return returnedData;
}
