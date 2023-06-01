import { AxiosInstance } from "axios";

interface TaskOutput<OutputName extends string> {
  path: string,
  name: OutputName,
  url: string,
}

interface TaskStatusData<OutputName extends string> {
  taskId: string,
  startedAt: Date,
  endedAt?: Date,
  outputs?: Record<OutputName, TaskOutput<OutputName>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const retrieveTaskStatus = async <T extends string>(beamClient: AxiosInstance, taskId: string, outputName: T) => {
  const taskOutputRes = await beamClient.get(`/v1/task/${taskId}/status`);
  return taskOutputRes.data as TaskStatusData<T>;
};


