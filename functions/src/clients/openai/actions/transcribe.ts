import { createReadStream } from "fs";
import { AxiosResponse } from "axios";
import { openai } from "../openai";
import { silentSegmentsFromAudioFile } from "../../ffmpeg/silentSegmentsFromAudioFile";
import { splitAudioUsingSilentSegments } from "../../ffmpeg/splitAudioUsingSilentSegments";
import { last } from "../../../utils/last";
import { logger } from "firebase-functions/v2";
import * as fs from "fs";

export interface TranscriptSegment {
  id: number,
  seek: number,
  start: number,
  end: number,
  text: string,
  tokens: number[],
  temperature: number,
  avg_logprob: number,
  compression_ratio: number,
  no_speech_prob: number,
  transient: boolean
}

// openai's sdk assumes we're not consuming the verbose json response, so we need to define a type ourselves
export interface CreateTranscriptionResponse {
  task: "transcribe",
  language: string,
  duration: number,
  segments: TranscriptSegment[],
  text: string
}

const callTranscriptionApi = async (
  filePath: string,
  prompt?: string,
  languageCodeISO2: string | undefined = "en"
) => {
  const { size: fileSizeBytes } = await fs.promises.stat(filePath);
  const maxBodyLength = 25 * 1024 * 1024;

  logger.info("calling transcription api", {
    filePath,
    prompt,
    languageCodeISO2,
    fileSizeBytes,
  });

  const { data } = await openai().createTranscription(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createReadStream(filePath) as any,
    "whisper-1",
    prompt,
    "verbose_json",
    undefined,
    languageCodeISO2,
    {
      maxBodyLength,
    }
  ) as AxiosResponse<CreateTranscriptionResponse, unknown>;

  return data;
};

export const transcribe = async (
  filePath: string,
  languageCodeISO2: string | undefined = "en"
): Promise<CreateTranscriptionResponse[]> => {
  logger.info("transcribing audio", {
    filePath,
    languageCodeISO2,
  });

  const silentSegments = await silentSegmentsFromAudioFile(filePath);

  logger.info("got silent segments", {
    silentSegmentFirst5: silentSegments.slice(0, 5),
  });

  const audioChunkPaths = await splitAudioUsingSilentSegments(filePath, silentSegments, 5);

  logger.info("split audio into chunks", {
    chunkCount: audioChunkPaths.length,
    audioChunkPaths,
  });

  const transcriptResponses: CreateTranscriptionResponse[] = [];

  for (let i = 0; i < audioChunkPaths.length; i++) {
    const audioChunkPath = audioChunkPaths[i];
    const prompt = last(transcriptResponses)?.text.split(" ").slice(-200).join(" ");
    const transcriptResponse = await callTranscriptionApi(audioChunkPath, prompt, languageCodeISO2);
    transcriptResponses.push(transcriptResponse);
  }

  return transcriptResponses;
};
