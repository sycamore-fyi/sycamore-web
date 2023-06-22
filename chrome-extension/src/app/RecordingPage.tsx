import { Button } from "@/components/ui/button"
import { useMemberships } from "@/contexts/MembershipsContext/MembershipsContext"
import { useUpdateState } from "@/hooks/useUpdateState"
import { storage } from "@/lib/firebase/app"
import { ref, uploadBytes } from "firebase/storage"
import { v4 as uuid } from "uuid"

interface Data {
  isRecording: boolean,
  error?: string,
  stopRecording?: () => void
}

export default function RecordingPage() {
  const { state: { selectedMembership } } = useMemberships()
  const { organisationId } = selectedMembership!.data()!
  const [state, updateState] = useUpdateState<Data>({
    isRecording: false
  })

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorder.start()

      updateState({
        isRecording: true,
        stopRecording: () => mediaRecorder.stop()
      })

      const recordedChunks: Blob[] = []
      mediaRecorder.addEventListener('dataavailable', function (e) {
        recordedChunks.push(e.data);
      });
      mediaRecorder.addEventListener('stop', async function () {
        const blob = new Blob(recordedChunks, {
          type: 'audio/webm'
        });
        const callId = uuid()
        const callRef = ref(storage, `${organisationId}/${callId}/uploaded_call.webm`)

        await uploadBytes(callRef, blob)
      });
    } catch (err) {
      console.error(err)
    }

  }

  return (
    <div className="p-2">
      <Button onClick={state.isRecording ? state.stopRecording : handleStartRecording}>
        {state.isRecording ? "Stop recording" : "Start recording"}
      </Button>
    </div>
  )
}