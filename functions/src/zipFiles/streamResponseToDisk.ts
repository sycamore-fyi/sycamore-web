import * as path from "path";
import * as fs from "fs";
import * as os from "os";
import axios, { AxiosInstance } from "axios";

export async function streamResponseToDisk(
  url: string,
  outputFileName: string,
  directory: string = os.tmpdir(),
  axiosInstance: AxiosInstance = axios
) {
  const outputPath = path.join(directory, outputFileName);
  const res = await axiosInstance.get(url, { responseType: "stream" });
  const writeStream = fs.createWriteStream(outputPath);
  res.data.pipe(writeStream);

  return new Promise((resolve, reject) => {
    writeStream.on("finish", resolve);
    writeStream.on("error", reject);
  });
}
