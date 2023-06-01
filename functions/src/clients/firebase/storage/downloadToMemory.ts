import { DownloadRequest } from "./DownloadRequest";
import { fileFromDownloadRequest } from "./fileFromDownloadRequest";
import { ZodTypeAny } from "zod";

export async function downloadBuffer(downloadRequest: DownloadRequest) {
  const file = fileFromDownloadRequest(downloadRequest);
  const [buffer] = await file.download();
  return buffer;
}

export async function downloadString(downloadRequest: DownloadRequest) {
  const buffer = await downloadBuffer(downloadRequest);
  return buffer.toString();
}

export async function downloadJson<T extends ZodTypeAny>(downloadRequest: DownloadRequest, schema: T) {
  const jsonString = await downloadString(downloadRequest);
  const data = JSON.parse(jsonString);

  if (schema) {
    return schema.parse(data);
  } else {
    return data;
  }
}
