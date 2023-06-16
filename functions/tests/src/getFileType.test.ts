import { getFileType } from "../../src/handlers/storage/fileTypes/getFileType"
import { FileType } from "../../src/handlers/storage/fileTypes/FileType"

describe("getFileType", () => {
  test("should return FileType.UPLOADED_call for uploaded_call.mp3", () => {
    const filePath = "uploaded_call.mp3"
    const contentType = "audio/mpeg"
    const fileType = getFileType(filePath, contentType)
    expect(fileType).toEqual(FileType.UPLOADED_call)
  })

  test("should return FileType.SPEAKER_SEGMENTS for speaker_segments.rttm", () => {
    const filePath = "speaker_segments.rttm"
    const contentType = "text/plain"
    const fileType = getFileType(filePath, contentType)
    expect(fileType).toEqual(FileType.SPEAKER_SEGMENTS)
  })

  test("should throw error for unknown file name with valid content type", () => {
    const filePath = "unknown.mp3"
    const contentType = "audio/mpeg"
    expect(() => getFileType(filePath, contentType)).toThrowError("invalid combination of filename and content type")
  })

  test("should throw error when content type is missing", () => {
    const filePath = "uploaded_call.mp3"
    expect(() => getFileType(filePath)).toThrowError("file has no content type")
  })

  test("should return FileType.PROCESSED_call for processed_call.mp3", () => {
    const filePath = "processed_call.mp3"
    const contentType = "audio/mpeg"
    const fileType = getFileType(filePath, contentType)
    expect(fileType).toEqual(FileType.PROCESSED_call)
  })

  test("should return FileType.UNDIARIZED_TRANSCRIPT for undiarized_transcript.json", () => {
    const filePath = "undiarized_transcript.json"
    const contentType = "application/json"
    const fileType = getFileType(filePath, contentType)
    expect(fileType).toEqual(FileType.UNDIARIZED_TRANSCRIPT)
  })

  test("should return FileType.DIARIZED_TRANSCRIPT for diarized_transcript.json", () => {
    const filePath = "diarized_transcript_segments.json"
    const contentType = "application/json"
    const fileType = getFileType(filePath, contentType)
    expect(fileType).toEqual(FileType.DIARIZED_TRANSCRIPT_SEGMENTS)
  })

  test("should return FileType.COMPACT_TRANSCRIPT for compact_transcript.json", () => {
    const filePath = "paraphrased_speaker_turns.json"
    const contentType = "application/json"
    const fileType = getFileType(filePath, contentType)
    expect(fileType).toEqual(FileType.PARAPHRASED_SPEAKER_TURNS)
  })

  test("should return FileType.UPLOADED_CALL for valid video content type", () => {
    const filePath = "uploaded_call.mp4"
    const contentType = "video/mp4"
    const fileType = getFileType(filePath, contentType)
    expect(fileType).toEqual(FileType.UPLOADED_call)
  })

  test("should throw error for unknown content type", () => {
    const filePath = "uploaded_call.mp3"
    const contentType = "unknown/type"
    expect(() => getFileType(filePath, contentType)).toThrowError("invalid combination of filename and content type")
  })
})
