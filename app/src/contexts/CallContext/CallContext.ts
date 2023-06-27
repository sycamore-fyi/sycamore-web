import { createContext, useContext } from "react"
import { DiarizedTranscriptSegment, Call, SpeakerAlias, ParaphrasedSpeakerTurn, CallSummary } from "@sycamore-fyi/shared"
import { DocumentSnapshot } from "firebase/firestore"
import { callActions } from "./callActions"
import { SpeakerTurn } from "./CallProvider"

export interface CallContextState {
  isLoading: boolean,
  call?: DocumentSnapshot<Call> | null,
  diarizedSegments?: DocumentSnapshot<DiarizedTranscriptSegment>[] | null,
  speakerAliases?: DocumentSnapshot<SpeakerAlias>[] | null,
  speakerTurns?: SpeakerTurn[],
  paraphrasedSpeakerTurns?: DocumentSnapshot<ParaphrasedSpeakerTurn>[] | null,
  callSummary?: CallSummary | null,
  audio?: HTMLAudioElement
}

export interface CallContextProps {
  state: CallContextState,
  actions: typeof callActions
}

export const initialCallState: CallContextState = {
  isLoading: true,
}

export const CallContext = createContext<CallContextProps>({
  state: initialCallState,
  actions: callActions
})

export const useCall = () => useContext(CallContext)
