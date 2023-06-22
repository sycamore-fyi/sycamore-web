import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useUpdateState } from "@/hooks/useUpdateState";
import { uploadCall } from "@/lib/firebase/uploadCall";

interface Props {
  organisationId: string,
  userId: string,
  isWithinLimit: boolean,
}

function formatBytes(bytes: number) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let unitIndex = 0;

  while (bytes >= 1000 && unitIndex < units.length - 1) {
    bytes /= 1000;
    unitIndex++;
  }

  return {
    units: units[unitIndex],
    value: bytes,
    decimalPlaces: bytes >= 1 && bytes < 10 ? 1 : 0
  }
}

function BytesDisplay({ totalBytes, bytesTransferred }: { totalBytes: number, bytesTransferred: number }) {
  const { units, value: totalValue, decimalPlaces } = formatBytes(totalBytes)
  const transferredValue = (bytesTransferred / totalBytes) * totalValue
  return (
    <p><span className="text-semibold">{transferredValue.toFixed(decimalPlaces)}</span> / {totalValue.toFixed(decimalPlaces)}{units}</p>
  )
}

interface Data {
  files?: FileList,
  fileInputKey: string,
  uploadBytesTransferred?: number,
  uploadTotalBytes?: number,
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
      (bytesTransferred: number, totalBytes: number) => {
        updateState({ uploadBytesTransferred: bytesTransferred, uploadTotalBytes: totalBytes });
      }
    );
  };

  const uploadState = state.uploadBytesTransferred
    ? state.uploadBytesTransferred === state.uploadTotalBytes
      ? UploadState.COMPLETE
      : UploadState.IN_PROGRESS
    : UploadState.NOT_STARTED

  if (!props.isWithinLimit) {
    return (
      <Tooltip delayDuration={100}>
        <TooltipTrigger>
          <Button disabled>Upload a call</Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-[200px]">
          <p>You've used up your transcription hours this month</p>
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Dialog onOpenChange={open => {
      if (!open) {
        updateState({
          files: undefined,
          uploadBytesTransferred: undefined,
          uploadTotalBytes: undefined,
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
          {
            state.uploadBytesTransferred && state.uploadTotalBytes
              ? (
                <>
                  <Progress value={(state.uploadBytesTransferred / state.uploadTotalBytes) * 100} />
                  <BytesDisplay totalBytes={state.uploadTotalBytes} bytesTransferred={state.uploadBytesTransferred} />
                </>
              )
              : null}
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
