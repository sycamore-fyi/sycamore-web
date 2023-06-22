import { ref, uploadBytesResumable } from "firebase/storage"
import { v4 as uuid } from "uuid"
import { storage } from "./app"

export async function uploadCall(
  file: File,
  organisationId: string,
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onProgress: (bytesTransferred: number, totalBytes: number) => void = () => { }
) {
  const callId = uuid()
  const extension = file.name.split(".").pop()
  const callRef = ref(storage, `${organisationId}/${callId}/uploaded_call.${extension}`)
  const uploadTask = uploadBytesResumable(callRef, file, {
    customMetadata: {
      userId
    }
  })

  uploadTask.on("state_changed", ({ bytesTransferred, totalBytes }) => onProgress(bytesTransferred, totalBytes))

  return uploadTask.then
}