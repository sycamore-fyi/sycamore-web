import { File } from "@google-cloud/storage";


export interface DownloadRequest {
  file?: File;
  filePath?: string;
}
