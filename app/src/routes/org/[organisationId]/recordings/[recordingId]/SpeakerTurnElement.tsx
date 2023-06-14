import { Caption } from "@/components/typography/Caption";
import { Badge } from "@/components/ui/badge";
import { SpeakerTurn } from "@/contexts/RecordingContext/RecordingProvider";
import { cn } from "@/lib/utils";
import { timeStringFromMs } from "./timeStringFromMs";

export function SpeakerTurnElement({ speakerTurn, audioMs }: { speakerTurn: SpeakerTurn; audioMs: number; }) {
  return (
    <div className="flex gap-x-4">
      <div className="flex-shrink-0">
        <Badge variant="secondary" className="">Speaker {speakerTurn.speakerIndex + 1}</Badge>
      </div>
      <div>
        {speakerTurn.segments.map(s => (
          <span
            className={cn(
              s.startMs <= audioMs && s.endMs > audioMs ? "bg-blue-200" : ""
            )}
          >
            {`${s.text} `}
          </span>
        ))}
      </div>
      <div className="flex-grow"></div>
      <Caption className="flex-shrink-0 mt-0.5">{timeStringFromMs(speakerTurn.startMs)}</Caption>
    </div>
  );
}
