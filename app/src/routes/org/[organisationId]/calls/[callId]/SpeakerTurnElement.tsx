import { Caption } from "@/components/typography/Caption";
import { Badge } from "@/components/ui/badge";
import { SpeakerTurn } from "@/contexts/CallContext/CallProvider";
import { cn } from "@/lib/utils";
import { timeStringFromMs } from "./timeStringFromMs";
import { SpeakerAlias } from "@sycamore-fyi/shared";
import { ChevronDown } from "lucide-react";

interface Props {
  speakerTurn: SpeakerTurn;
  speakerAlias?: SpeakerAlias;
  audioMs: number;
  handleEditSpeakerAlias: (speakerIndex: number) => void
}

export function SpeakerTurnElement({ speakerTurn, speakerAlias, audioMs, handleEditSpeakerAlias }: Props) {
  const { speakerIndex } = speakerTurn
  return (
    <div className="flex gap-x-4">
      <div className="w-32 flex-shrink-0 flex-grow-0">
        <div className="inline-block max-w-full">
          <Badge
            variant="secondary"
            className="flex gap-2 cursor-pointer hover:opacity-70"
            onClick={() => handleEditSpeakerAlias(speakerIndex)}
          >
            <span className="whitespace-nowrap text-ellipsis overflow-hidden font-semibold">{speakerAlias ? speakerAlias.speakerLabel : `Speaker ${speakerIndex + 1}`}</span>
            <ChevronDown className="flex-shrink-0" size={12} />
          </Badge>
        </div>

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
