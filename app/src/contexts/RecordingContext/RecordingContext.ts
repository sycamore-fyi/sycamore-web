import { createContext, useContext } from "react"
import { DiarizedTranscriptSegment, Recording, SpeakerAlias } from "@sycamore-fyi/shared"
import { DocumentSnapshot } from "firebase/firestore"
import { recordingActions } from "./recordingActions"
import { SpeakerTurn } from "./RecordingProvider"

export interface RecordingContextState {
  isLoading: boolean,
  recording?: DocumentSnapshot<Recording> | null,
  diarizedSegments?: DocumentSnapshot<DiarizedTranscriptSegment>[] | null,
  speakerAliases?: DocumentSnapshot<SpeakerAlias>[] | null,
  speakerTurns?: SpeakerTurn[],
  audio?: HTMLAudioElement
}

export interface RecordingContextProps {
  state: RecordingContextState,
  actions: typeof recordingActions
}

export const initialRecordingState: RecordingContextState = {
  isLoading: true,
}

export const RecordingContext = createContext<RecordingContextProps>({
  state: initialRecordingState,
  actions: recordingActions
})

export const useRecording = () => useContext(RecordingContext)
