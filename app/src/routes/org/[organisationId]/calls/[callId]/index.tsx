import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCall } from "@/contexts/CallContext/CallContext"
import { useUpdateState } from "@/hooks/useUpdateState"
import { Loader2, Pause } from "lucide-react"
import { Play } from "lucide-react"
import { MouseEventHandler, useEffect } from "react"
import { timeStringFromMs } from "./timeStringFromMs"
import { SpeakerTurnElement } from "./SpeakerTurnElement"
import { useParams } from "react-router-dom"
import { logPageView } from "@/lib/lytics/actions"
import { Page } from "@/lib/lytics/Page"
import BackLink from "@/components/layout/BackLink"
import Container from "@/components/layout/Container"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FormUtil } from "@/components/FormUtil"
import { z } from "zod"
import { FormFieldUtil } from "@/components/FormFieldUtil"
import { Input } from "@/components/ui/input"
import { DocumentSnapshot, addDoc, doc, getDocs, query, updateDoc, where } from "firebase/firestore"
import { Collection } from "@/lib/firebase/Collection"
import { SpeakerAlias } from "@sycamore-fyi/shared"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import TranscriptTab from "./tabs/TranscriptTab"
import ParaphraseTab from "./tabs/ParaphraseTab"
import SummaryTab from "./tabs/SummaryTab"

interface CallPageData {
  audioMs: number,
  hoverAudioMs: number
  mouseLeftOffset: number | null,
  speakerIndex?: number,
  isSpeakerAliasModalOpen: boolean,
}

interface SpeakerAliasDialogProps {
  speakerAliases?: DocumentSnapshot<SpeakerAlias>[] | null,
  speakerIndex?: number,
  isOpen: boolean,
  setOpen: (open: boolean) => void,
  organisationId?: string,
  callId?: string,
}

function SpeakerAliasDialog({ speakerAliases, isOpen, setOpen, speakerIndex, organisationId, callId }: SpeakerAliasDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Label speaker</DialogTitle>
          <DialogDescription>Give this speaker a memorable name, not just a number.</DialogDescription>
        </DialogHeader>
        <FormUtil
          schema={z.object({
            speakerLabel: z.string().nonempty(),
          })}
          defaultValues={{ speakerLabel: speakerAliases?.find(alias => alias.data()?.speakerIndex === speakerIndex)?.data()?.speakerLabel ?? "" }}
          onSubmit={async ({ speakerLabel }) => {
            if ((!speakerIndex && speakerIndex !== 0) || !callId || !organisationId) return

            const speakerAliasQuery = query(
              Collection.SpeakerAlias,
              where("callId", "==", callId),
              where("organisationId", "==", organisationId),
              where("speakerIndex", "==", speakerIndex)
            )
            const { docs: speakerAliases } = await getDocs(speakerAliasQuery)

            if (speakerAliases.length > 0) {
              await updateDoc(doc(Collection.SpeakerAlias, speakerAliases[0].id), {
                speakerLabel
              })
            } else {
              await addDoc(Collection.SpeakerAlias, {
                speakerIndex,
                speakerLabel,
                callId,
                organisationId,
                createdAt: new Date(),
              })
            }

            setOpen(false)
          }}
          render={form => (
            <FormFieldUtil
              control={form.control}
              name="speakerLabel"
              render={({ field }) => <Input {...field} />}
            />
          )}
        />
      </DialogContent>
    </Dialog>
  )
}

export default function CallPage() {
  const { state: { speakerTurns, speakerAliases, audio } } = useCall()
  const { organisationId, callId } = useParams()

  useEffect(() => {
    logPageView(Page.CALL)
  }, [callId, organisationId])

  const audioDurationMs = (audio?.duration ?? 0) * 1000

  const [state, updateState] = useUpdateState<CallPageData>({
    audioMs: 0,
    hoverAudioMs: 0,
    mouseLeftOffset: null,
    isSpeakerAliasModalOpen: false,
  })

  useEffect(() => {
    return () => {
      audio?.pause()
    }
  }, [callId, audio])

  useEffect(() => {
    const timeUpdateListener = () => {
      if (!audio) return
      console.log()
      updateState({ audioMs: audio.currentTime * 1000 })
    }

    audio?.addEventListener("timeupdate", timeUpdateListener)

    return () => {
      audio?.removeEventListener("timeupdate", timeUpdateListener)
    }
  }, [audio, updateState])

  function toggleAudio() {
    if (audio?.paused) {
      audio.play()
    } else {
      audio?.pause()
    }
  }

  const handleMouseMove: MouseEventHandler<HTMLDivElement> = (event) => {
    const divRect = event.currentTarget.getBoundingClientRect()
    const leftOffset = Math.max(0, event.pageX - divRect.left)
    const hoverAudioMs = (leftOffset / divRect.width) * audioDurationMs

    updateState({
      mouseLeftOffset: leftOffset,
      hoverAudioMs
    })
  }

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = () => {
    updateState({ mouseLeftOffset: null })
  }

  const handleClick: MouseEventHandler<HTMLDivElement> = (event) => {
    if (!audio) return
    const divRect = event.currentTarget.getBoundingClientRect()
    const leftOffset = Math.max(0, event.pageX - divRect.left - 2)
    const audioDurationPerc = leftOffset / divRect.width
    audio.currentTime = audio.duration * audioDurationPerc
  }

  return (
    <Tabs defaultValue="transcript" className="h-full flex flex-col">
      <SpeakerAliasDialog
        organisationId={organisationId}
        callId={callId}
        isOpen={state.isSpeakerAliasModalOpen}
        setOpen={open => updateState({ isSpeakerAliasModalOpen: open })}
        speakerAliases={speakerAliases}
        speakerIndex={state.speakerIndex}
      />
      <Container className="space-y-4 flex-shrink-0 flex-grow-0 px-4 py-4">
        <BackLink to={".."}>Back to calls</BackLink>
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="transcript">Transcript</TabsTrigger>
          <TabsTrigger value="paraphrase">Paraphrase</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>
      </Container>
      <ScrollArea className="flex-grow">
        <Container>
          <TranscriptTab
            speakerAliases={speakerAliases}
            speakerTurns={speakerTurns}
            audioMs={state.audioMs}
            openSpeakerAliasModal={i => updateState({ isSpeakerAliasModalOpen: true, speakerIndex: i })}
          />
          <ParaphraseTab
            handleEditSpeakerAlias={i => updateState({ isSpeakerAliasModalOpen: true, speakerIndex: i })}
          />
          <SummaryTab />
        </Container>
      </ScrollArea>
      <div className="h-12 box-border items-center flex flex-shrink-0 border-t border-slate-100 bg-white p-1 gap-x-2">
        {
          audio
            ? (
              <Button className="p-0 h-full rounded-full aspect-square" onClick={toggleAudio}>
                {audio?.paused ? <Play color="white" size={24} /> : <Pause color="white" size={24} />}
              </Button>
            )
            : (
              <Skeleton className="rounded-full h-full aspect-square flex items-center justify-center bg-slate-200">
                <Loader2 className="animate-spin" />
              </Skeleton>
            )
        }
        {
          audio
            ? (
              <div
                className="bg-slate-100 rounded-md h-full flex-grow relative cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}
              >
                <div
                  className="bg-red-500 rounded-sm w-1 h-full absolute cursor-pointer"
                  style={{
                    left: (state.audioMs / audioDurationMs * 100).toFixed(2).toString() + "%"
                  }}
                />
                {
                  !!state.mouseLeftOffset && <div
                    className="bg-slate-500 rounded-sm w-1 h-full absolute cursor-pointer"
                    style={{ left: state.mouseLeftOffset - 2 }}
                  />
                }
                {
                  !!state.mouseLeftOffset && <div
                    className="bg-slate-500 flex items-center justify-center text-white text-sm w-10 h-4 absolute rounded"
                    style={{ left: state.mouseLeftOffset - 20, top: -10 }}
                  >
                    {timeStringFromMs(state.hoverAudioMs)}
                  </div>
                }
              </div>
            )
            : (
              <Skeleton className="h-full rounded-md w-full bg-slate-200 flex p-2 items-center">
                <p>Loading audio</p>
              </Skeleton>
            )
        }
      </div>
    </Tabs>

  )
}

