import { ref, uploadBytesResumable } from "firebase/storage"
import { v4 as uuid } from "uuid"
import { storage } from "./app"

export async function uploadRecording(
  file: File,
  organisationId: string,
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onProgress: (progress: number) => void = () => { }
) {
  const recordingId = uuid()
  const extension = file.name.split(".").pop()
  const recordingRef = ref(storage, `${organisationId}/${recordingId}/uploaded_recording.${extension}`)
  const uploadTask = uploadBytesResumable(recordingRef, file, {
    customMetadata: {
      userId
    }
  })

  uploadTask.on("state_changed", snapshot => onProgress(snapshot.bytesTransferred / snapshot.totalBytes))

  return uploadTask.then
}