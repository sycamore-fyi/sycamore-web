import { FileType } from "./FileType";

export const expectedFileData = [
  {
    fileType: FileType.PROCESSED_RECORDING,
    fileName: "processed_recording.mp3",
    contentType: "audio/mpeg",
  },
  {
    fileType: FileType.SPEAKER_SEGMENTS,
    fileName: "speaker_segments.rttm",
    contentType: "application/octet-stream",
  },
  {
    fileType: FileType.UNDIARIZED_TRANSCRIPT,
    fileName: "transcription_response.json",
    contentType: "application/json",
  },
  {
    fileType: FileType.DIARIZED_TRANSCRIPT_SEGMENTS,
    fileName: "diarized_transcript_segments.json",
    contentType: "application/json",
  },
  {
    fileType: FileType.PARAPHRASED_SPEAKER_TURNS,
    fileName: "paraphrased_speaker_turns.json",
    contentType: "application/json",
  },
];

export function fileNameFromExpectedFileType(fileType: FileType): string {
  if (fileType === FileType.UPLOADED_RECORDING) throw new Error(`${fileType} is not an expected file type`);
  return expectedFileData.find((datum) => datum.fileType === fileType)?.fileName as string;
}
