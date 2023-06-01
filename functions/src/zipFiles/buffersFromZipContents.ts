import * as AdmZip from "adm-zip";
import { getZippedData } from "./getZippedData";
import { objectFromKeysAndValues } from "../utils/objectFromKeysAndValues";

export async function buffersFromZipContents(zipContents: Buffer) {
  const zipFile = new AdmZip(zipContents);
  const fileEntries = zipFile.getEntries().filter((e) => !e.isDirectory);
  const buffers = await Promise.all(fileEntries.map(getZippedData));
  const fileNames = fileEntries.map((e) => e.entryName);
  return objectFromKeysAndValues(fileNames, buffers);
}
