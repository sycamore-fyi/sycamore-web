import { TabsContent } from "@/components/ui/tabs";
import { SpeakerTurn } from "@/contexts/CallContext/CallProvider";
import { DocumentSnapshot } from "firebase/firestore";
import { SpeakerTurnElement } from "../SpeakerTurnElement";
import { SpeakerAlias } from "@sycamore-fyi/shared";

interface Props {
  speakerTurns?: SpeakerTurn[] | null,
  speakerAliases?: DocumentSnapshot<SpeakerAlias>[] | null,
  audioMs: number,
  openSpeakerAliasModal(speakerIndex: number): void
}

export default function TranscriptTab({ speakerTurns, speakerAliases, audioMs, openSpeakerAliasModal }: Props) {
  return (
    <TabsContent value="transcript" className="space-y-6">
      {
        speakerTurns?.map(turn => (
          <SpeakerTurnElement
            speakerTurn={turn}
            speakerAlias={speakerAliases?.find(alias => alias.data()?.speakerIndex === turn.speakerIndex)?.data()}
            audioMs={audioMs}
            handleEditSpeakerAlias={openSpeakerAliasModal}
          />
        ))
      }
    </TabsContent>
  )
}