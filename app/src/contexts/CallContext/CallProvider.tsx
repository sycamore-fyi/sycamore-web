import {
  ReactNode,
  useEffect,
  useMemo,
  useState
} from "react";
import { useUpdateState } from "../../hooks/useUpdateState";
import { doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Collection } from "@/lib/firebase/Collection";
import { CallContext, CallContextState, initialCallState } from "./CallContext";
import { callActions } from "./callActions";
import { useParams } from "react-router-dom";
import { useAuth } from "../AuthContext/AuthContext";
import { getBlob, ref } from "firebase/storage";
import { storage } from "@/lib/firebase/app";
import { DiarizedTranscriptSegment } from "@sycamore-fyi/shared";

export interface TranscriptSegment {
  startMs: number,
  endMs: number,
  text: string
}

export interface SpeakerTurn {
  speakerIndex: number;
  speakerLabel?: string;
  startMs: number;
  endMs: number;
  text: string;
  segments: TranscriptSegment[];
}

export function last<T>(arr: T[]): T | null {
  if (arr.length === 0) return null
  return arr[arr.length - 1]
}

export function speakerTurnsFromDiarizedSegments(
  segments: DiarizedTranscriptSegment[]
): SpeakerTurn[] {
  return segments.reduce<SpeakerTurn[]>((turns, segment) => {
    const { speakerIndex, text, endMs } = segment;
    const lastTurn = last(turns);
    if (lastTurn?.speakerIndex === speakerIndex) {
      return [
        ...turns.slice(0, -1),
        {
          ...lastTurn,
          text: `${lastTurn.text} ${text}`,
          endMs,
          segments: [
            ...lastTurn.segments,
            segment,
          ],
        },
      ];
    } else {
      return [
        ...turns,
        {
          ...segment,
          segments: [segment],
        },
      ];
    }
  }, []);
}

export default function CallProvider({ children }: { children: ReactNode }) {
  const { organisationId, callId } = useParams()
  const { state: { authUser } } = useAuth()
  const authUserId = authUser?.uid
  const errorMessage = "call either doesn't exist, or you don't have permission to view"

  const [state, updateState] = useUpdateState<CallContextState>(initialCallState)
  const [error, setError] = useState<string>()

  console.log("rendering call provider", state)

  useEffect(() => {
    setError(undefined)

    updateState({
      isLoading: !!callId && !!authUserId,
      call: null,
      diarizedSegments: null,
      speakerAliases: null,
      speakerTurns: undefined
    })

    if (!callId || !authUserId) {
      console.log("no organisation id or auth user id in provider, returning")
      setError("No organisation found")
      return
    }

    onSnapshot(doc(Collection.Call, callId),
      call => updateState({ call }),
      (err) => {
        console.error(err)
        setError(errorMessage)
      }
    )

    onSnapshot(
      query(
        Collection.DiarizedTranscriptSegment,
        where("callId", "==", callId),
        where("organisationId", "==", organisationId),
        orderBy("startMs", "asc")
      ),
      ({ docs: segments }) => updateState({
        diarizedSegments: segments,
        speakerTurns: speakerTurnsFromDiarizedSegments(segments.map(s => s.data()))
      }),
      (err) => {
        console.error(err)
        setError(errorMessage)
      }
    )

    onSnapshot(
      query(
        Collection.SpeakerAlias,
        where("callId", "==", callId),
        where("organisationId", "==", organisationId),
      ),
      ({ docs: speakerAliases }) => updateState({
        speakerAliases
      }),
      (err) => {
        console.error(err)
        setError(errorMessage)
      }
    )
  }, [updateState, callId, organisationId, authUserId])

  useEffect(() => {
    (async () => {
      const filePath = state.call?.data()?.filePath

      if (!filePath) return

      const audioBlob = await getBlob(ref(storage, filePath))
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl);

      updateState({ audio })
    })()
  }, [state.call, updateState])

  useEffect(() => {
    if (!state.call || !state.diarizedSegments || !state.speakerAliases) return

    updateState({ isLoading: false })

    if (state.call?.exists() && !!state.diarizedSegments) { return }

    setError(errorMessage)
  }, [state.call, state.diarizedSegments, state.speakerAliases, updateState])

  const value = useMemo(() => ({
    state,
    actions: callActions
  }), [state])

  if (error) return <p>{error}</p>

  return (
    <CallContext.Provider value={value}>
      {children}
    </CallContext.Provider>
  )
}
