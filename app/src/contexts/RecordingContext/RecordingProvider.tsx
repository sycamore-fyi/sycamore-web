import {
  ReactNode,
  useEffect,
  useMemo,
  useState
} from "react";
import { useUpdateState } from "../../hooks/useUpdateState";
import { doc, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { Collection } from "@/lib/firebase/Collection";
import { RecordingContext, RecordingContextState, initialRecordingState } from "./RecordingContext";
import { recordingActions } from "./recordingActions";
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

export default function RecordingProvider({ children }: { children: ReactNode }) {
  const { organisationId, recordingId } = useParams()
  const { state: { authUser } } = useAuth()
  const authUserId = authUser?.uid
  const errorMessage = "Recording either doesn't exist, or you don't have permission to view"

  const [state, updateState] = useUpdateState<RecordingContextState>(initialRecordingState)
  const [error, setError] = useState<string>()

  console.log("rendering recording provider", state)

  useEffect(() => {
    setError(undefined)

    updateState({
      isLoading: !!recordingId && !!authUserId,
      recording: null,
      diarizedSegments: null,
      speakerAliases: null,
      speakerTurns: undefined
    })

    if (!recordingId || !authUserId) {
      console.log("no organisation id or auth user id in provider, returning")
      setError("No organisation found")
      return
    }

    onSnapshot(doc(Collection.Recording, recordingId),
      recording => updateState({ recording }),
      () => setError(errorMessage)
    )

    onSnapshot(
      query(
        Collection.DiarizedTranscriptSegment,
        where("recordingId", "==", recordingId),
        where("organisationId", "==", organisationId),
        orderBy("startMs", "asc")
      ),
      ({ docs: segments }) => updateState({
        diarizedSegments: segments,
        speakerTurns: speakerTurnsFromDiarizedSegments(segments.map(s => s.data()))
      }),
      () => setError(errorMessage)
    )

    onSnapshot(
      query(
        Collection.SpeakerAlias,
        where("recordingId", "==", recordingId),
        where("organisationId", "==", organisationId),
      ),
      ({ docs: speakerAliases }) => updateState({
        speakerAliases
      }),
      () => setError(errorMessage)
    )
  }, [updateState, recordingId, organisationId, authUserId])

  useEffect(() => {
    (async () => {
      const filePath = state.recording?.data()?.processedFilePath

      if (!filePath) return

      const audioBlob = await getBlob(ref(storage, filePath))
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl);

      updateState({ audio })
    })()
  }, [state.recording, updateState])

  useEffect(() => {
    if (!state.recording || !state.diarizedSegments || !state.speakerAliases) return

    updateState({ isLoading: false })

    if (state.recording?.exists() && !!state.diarizedSegments) { return }

    setError(errorMessage)
  }, [state.recording, state.diarizedSegments, state.speakerAliases, updateState])

  const value = useMemo(() => ({
    state,
    actions: recordingActions
  }), [state])

  if (error) return <p className="pt-16">{error}</p>

  return (
    <RecordingContext.Provider value={value}>
      {children}
    </RecordingContext.Provider>
  )
}
