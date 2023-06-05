import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useAuth } from "@/contexts/AuthContext/AuthContext"
import { useOrganisation } from "@/contexts/OrganisationContext/OrganisationContext"
import { useUpdateState } from "@/hooks/useUpdateState"
import { uploadRecording } from "@/lib/firebase/uploadRecording"
import { useParams } from "react-router-dom"

interface OrganisationPageData {
  files?: FileList,
  fileInputKey: string,
  uploadProgress?: number
}

export default function OrganisationPage() {
  const { state: { organisation } } = useOrganisation()
  const { state: { authUser } } = useAuth()
  const { organisationId } = useParams()

  const [state, updateState] = useUpdateState<OrganisationPageData>({
    fileInputKey: (new Date()).toISOString()
  })

  const handleUploadRecording = async () => {
    if (!state.files || state.files.length === 0) {
      console.log("no files uploaded")
      return
    }

    const userId = authUser?.uid

    if (!userId || !organisationId) return

    const [file] = state.files

    await uploadRecording(
      file,
      organisationId,
      userId,
      (progress: number) => {
        updateState({ uploadProgress: progress })
      }
    )

    updateState({
      files: undefined,
      fileInputKey: (new Date()).toISOString()
    })
  }

  return (
    <div className="pt-12 space-y-3 px-4">
      <p>Organisation: {JSON.stringify(organisation?.data() ?? {})}</p>
      <h2>Recordings</h2>
      <Input
        type="file"
        className="cursor-pointer"
        onChange={e => updateState({ files: e.target.files ?? undefined })}
        key={state.fileInputKey}
      />
      <Button onClick={handleUploadRecording}>Upload</Button>
      {state.uploadProgress ? <Progress value={state.uploadProgress} /> : null}
    </div>
  )
}