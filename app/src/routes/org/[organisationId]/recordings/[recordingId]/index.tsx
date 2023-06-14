import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRecording } from "@/contexts/RecordingContext/RecordingContext"
import { useUpdateState } from "@/hooks/useUpdateState"
import { Pause } from "lucide-react"
import { Play } from "lucide-react"
import { MouseEventHandler, useEffect } from "react"
import { timeStringFromMs } from "./timeStringFromMs"
import { SpeakerTurnElement } from "./SpeakerTurnElement"
import { doc, setDoc } from "firebase/firestore"
import { Collection } from "@/lib/firebase/Collection"
import { useParams } from "react-router-dom"
import { logPageView } from "@/lib/lytics/actions"
import { Page } from "@/lib/lytics/Page"
import BackLink from "@/components/layout/BackLink"
import Container from "@/components/layout/Container"

function getAudioVisualisation(audio: HTMLAudioElement) {
  const audioContext = new AudioContext()
  const analyzer = audioContext.createAnalyser()
  const source = audioContext.createMediaElementSource(audio)
  source.connect(analyzer)
}

interface RecordingPageData {
  audioMs: number,
  hoverAudioMs: number
  mouseLeftOffset: number | null
}

export default function RecordingPage() {
  const { state: { recording, speakerTurns, speakerAliases, audio } } = useRecording()
  const { organisationId, recordingId } = useParams()

  useEffect(() => {
    logPageView(Page.RECORDING)
  }, [recordingId, organisationId])

  const audioDurationMs = (audio?.duration ?? 0) * 1000

  const [state, updateState] = useUpdateState<RecordingPageData>({
    audioMs: 0,
    hoverAudioMs: 0,
    mouseLeftOffset: null
  })

  useEffect(() => {
    return () => {
      audio?.pause()
    }
  }, [recordingId, audio])

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

  const handleMouseLeave: MouseEventHandler<HTMLDivElement> = (event) => {
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
    <div className="h-full flex flex-col">
      <ScrollArea>
        <Container className="space-y-4 px-4 py-4">
          <BackLink to={".."}>Back to recordings</BackLink>
          <h1>Recording</h1>
          <div className="space-y-6">
            {
              speakerTurns?.map(turn => (
                <SpeakerTurnElement
                  speakerTurn={turn}
                  audioMs={state.audioMs}
                />
              ))}
          </div>

        </Container>
      </ScrollArea>
      <div className="h-12 box-border items-center flex flex-shrink-0 border-t border-slate-100 bg-white p-1 gap-x-2">
        <Button className="p-0 h-full rounded-full aspect-square" onClick={toggleAudio}>
          {audio?.paused ? <Play color="white" size={24} /> : <Pause color="white" size={24} />}
        </Button>
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
      </div>
    </div>
  )
}

