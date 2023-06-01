import { z } from "zod";
import { BeamAppId } from "./BeamAppId";
import { AxiosInstance } from "axios";

export const webhookResponseSchema = z.object({
  taskId: z.string().uuid(),
});

export async function requestWebhookTrigger(beam: AxiosInstance, appId: BeamAppId, audioFilePath: string) {
  const res = await beam.post(`/${appId}`, {
    remote_audio_path: audioFilePath,
  });

  const { taskId } = webhookResponseSchema.parse(res.data);

  return taskId;
}
