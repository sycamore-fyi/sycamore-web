export enum PipelineTaskModel {
  WHISPER_1 = "OPENAI_WHISPER_1",
  PYANNOTE_AUDIO_2_1 = "PYANNOTE_AUDIO_2_1"
}

export enum PipelineTaskType {
  DIARIZATION = "DIARIZATION",
  TRANSCRIPTION = "TRANSCRIPTION"
}

export enum PipelineTaskProvider {
  BEAM = "BEAM"
}

export enum PipelineTaskResult {
  SUCCESS = "SUCCESS",
  FAILURE = "FAILURE",
  PENDING = "PENDING"
}

export interface PipelineTask {
  type: PipelineTaskType,
  provider: PipelineTaskProvider,
  model: PipelineTaskModel,
  callId: string,
  organisationId: string,
  beam: {
    taskId: string
  },
  result: PipelineTaskResult,
  isResolved: boolean,
  createdAt: Date,
  resolvedAt?: Date,
}
