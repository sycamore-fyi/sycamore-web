import { File } from "@google-cloud/storage";
import { bucket } from "../admin";
import { DownloadRequest } from "./DownloadRequest";

export function fileFromDownloadRequest({ filePath, file }: DownloadRequest): File {
  if (file) return file;
  if (filePath) return bucket.file(filePath);
  throw new Error("either file or filePath must be present, but neither given");
}
