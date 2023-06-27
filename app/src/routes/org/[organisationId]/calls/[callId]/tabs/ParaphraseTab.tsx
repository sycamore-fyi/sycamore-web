import { Badge } from "@/components/ui/badge";
import { TabsContent } from "@/components/ui/tabs";
import { useCall } from "@/contexts/CallContext/CallContext";
import { ChevronDown } from "lucide-react";

interface Props {
  handleEditSpeakerAlias: (speakerIndex: number) => void
}

export default function ParaphraseTab({ handleEditSpeakerAlias }: Props) {
  const { state: { paraphrasedSpeakerTurns, speakerAliases } } = useCall()
  return (
    <TabsContent value="paraphrase" className="space-y-6">
      {
        paraphrasedSpeakerTurns?.map((turn) => {
          const { text, speakerLabel, speakerIndex } = turn.data()!
          const speakerAlias = speakerAliases?.find(a => a.data()?.speakerIndex === speakerIndex)?.data()
          return (
            <div key={turn.id} className="gap-x-4 flex">
              <div className="w-32 flex-shrink-0 flex-grow-0">
                <div className="inline-block max-w-full">
                  <Badge
                    variant="secondary"
                    className="flex gap-2 cursor-pointer hover:opacity-70"
                    onClick={(speakerIndex || speakerIndex === 0) ? () => handleEditSpeakerAlias(speakerIndex) : undefined}
                  >
                    <span className="whitespace-nowrap text-ellipsis overflow-hidden font-semibold">{speakerAlias ? speakerAlias.speakerLabel : speakerIndex ? (`Speaker ${speakerIndex + 1}`) : speakerLabel}</span>
                    <ChevronDown className="flex-shrink-0" size={12} />
                  </Badge>
                </div>
              </div>
              <p>{text}</p>
            </div>
          )
        })
      }
    </TabsContent>
  )
}