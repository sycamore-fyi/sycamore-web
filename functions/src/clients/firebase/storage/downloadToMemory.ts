import { DownloadRequest } from "./DownloadRequest";
import { fileFromDownloadRequest } from "./fileFromDownloadRequest";
import { ZodType } from "zod";

export async function downloadBuffer(downloadRequest: DownloadRequest) {
  const file = fileFromDownloadRequest(downloadRequest);
  const [buffer] = await file.download();
  return buffer;
}

export async function downloadString(downloadRequest: DownloadRequest) {
  const buffer = await downloadBuffer(downloadRequest);
  return buffer.toString();
}

export async function downloadJson<Data>(downloadRequest: DownloadRequest, schema: ZodType<Data>) {
  const jsonString = await downloadString(downloadRequest);
  const data = JSON.parse(jsonString);
  return schema.parse(data);
}
