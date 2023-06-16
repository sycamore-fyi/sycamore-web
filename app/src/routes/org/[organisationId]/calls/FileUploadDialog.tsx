import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useUpdateState } from "@/hooks/useUpdateState";
import { uploadCall } from "@/lib/firebase/uploadCall";

interface Props {
  organisationId: string,
  userId: string
}

interface Data {
  files?: FileList,
  fileInputKey: string,
  uploadProgress?: number
}

enum UploadState {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETE = "COMPLETE",
}

function title(uploadState: UploadState) {
  switch (uploadState) {
    case UploadState.NOT_STARTED: return "Upload a call"
    case UploadState.IN_PROGRESS: return "Uploading your call"
    case UploadState.COMPLETE: return "Upload complete"
  }
}

function description(uploadState: UploadState) {
  switch (uploadState) {
    case UploadState.NOT_STARTED: return "You can upload any audio or video file under 5GB."
    case UploadState.IN_PROGRESS: return "Don't close this modal until the upload is complete."
    case UploadState.COMPLETE: return "You can now close this modal."
  }
}

function buttonTitle(uploadState: UploadState) {
  switch (uploadState) {
    case UploadState.NOT_STARTED: return "Upload"
    case UploadState.IN_PROGRESS: return "Uploading..."
    case UploadState.COMPLETE: return "Uploaded"
  }
}

// need this to reset the file input
const generateFileUploadKey = () => (new Date()).toISOString()

export default function FileUploadDialog(props: Props) {
  const [state, updateState] = useUpdateState<Data>({
    fileInputKey: generateFileUploadKey()
  });

  const handleUploadCall = async () => {
    if (!state.files || state.files.length === 0) {
      console.log("no files uploaded");
      return;
    }

    const [file] = state.files;

    await uploadCall(
      file,
      props.organisationId,
      props.userId,
      (progress: number) => {
        updateState({ uploadProgress: progress });
      }
    );
  };

  const uploadState = state.uploadProgress
    ? state.uploadProgress === 1
      ? UploadState.COMPLETE
      : UploadState.IN_PROGRESS
    : UploadState.NOT_STARTED

  return (
    <Dialog onOpenChange={open => {
      if (!open) {
        updateState({
          files: undefined,
          uploadProgress: undefined,
          fileInputKey: generateFileUploadKey()
        })
      }
    }}>
      <DialogTrigger>
        <Button>Upload a call</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {title(uploadState)}
          </DialogTitle>
          <DialogDescription>{description(uploadState)}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            type="file"
            className="cursor-pointer"
            onChange={e => updateState({ files: e.target.files ?? undefined })}
            disabled={uploadState !== UploadState.NOT_STARTED}
            key={state.fileInputKey}
          />
          {state.uploadProgress ? <Progress value={state.uploadProgress * 100} /> : null}
        </div>
        <DialogFooter>
          <Button
            onClick={handleUploadCall}
            disabled={uploadState !== UploadState.NOT_STARTED}
          >{buttonTitle(uploadState)}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
