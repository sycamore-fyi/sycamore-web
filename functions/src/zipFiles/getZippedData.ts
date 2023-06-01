import { IZipEntry } from "adm-zip";


export async function getZippedData(entry: IZipEntry): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    entry.getDataAsync((data, err) => {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
