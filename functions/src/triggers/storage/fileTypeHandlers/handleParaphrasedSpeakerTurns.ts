import { StorageEvent } from "firebase-functions/v2/storage";
import { downloadJson } from "../../../clients/firebase/storage/downloadToMemory";
import { z } from "zod";
import { chatSimple } from "../../../clients/openai/actions/chat";
import { summarisePrompt } from "../../../clients/openai/prompts/summarisePrompt";
import { Collection } from "../../../clients/firebase/firestore/collection";
import { parseFilePath } from "../parseFilePath";
import { getEnvironment } from "../../../clients/firebase/Environment";
import { Environment } from "@sycamore-fyi/shared";
import * as fs from "fs";
import * as path from "path";
import { SpeakerLabel } from "../../../clients/openai/summarisation/interfaces/SpeakerLabel";

const paraphrasedSchema = z.array(
  z.object({
    text: z.string(),
    speakerIndex: z.number().int().gte(0),
    speakerLabel: z.nativeEnum(SpeakerLabel),
    turnIndex: z.number().int().gte(0),
  })
);

export const handleParaphrasedSpeakerTurns = async (event: StorageEvent, filePath: string) => {
  const { organisationId, callId } = parseFilePath(filePath);

  let summary: string;

  if (getEnvironment() === Environment.PROD) {
    const paraphrasedSpeakerTurns = await downloadJson({ filePath }, paraphrasedSchema);
    const speakerLines = paraphrasedSpeakerTurns.map(({ speakerLabel, text }) => `${speakerLabel}: ${text}`);
    summary = await chatSimple({
      prompt: summarisePrompt(speakerLines),
      model: "gpt-4-0613",
      schema: z.string(),
    });
  } else {
    summary = await fs.promises.readFile(path.join(__dirname, "call_summary.md"), "utf-8");
  }

  await Collection.CallSummary.add({
    promptVersion: "1.0.0",
    markdown: summary,
    organisationId,
    callId,
    createdAt: new Date,
  });
};
