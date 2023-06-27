import { ParsedSpeakerTurn } from "../interfaces/SpeakerTurn";
import { enumValues } from "../../../../utils/enumValues";
import { SpeakerLabel } from "../interfaces/SpeakerLabel";
import { isNumber } from "../../../../utils/isNumber";

export function parsedSpeakersTurnsFromSpeakerLines(speakerLines: string[]): ParsedSpeakerTurn[] {
  return speakerLines
    .map((line) => {
      const colonDelimiter = ": ";
      const colonSplit = line.split(colonDelimiter);

      if (colonSplit.length < 2) {
        return null;
      }

      const [labels] = colonSplit;
      const text = line.slice(labels.length + colonDelimiter.length);

      const labelSpaceSplit = labels.split(" ");

      let turnIndexStr: string | undefined;
      let speakerLabelStr: string | undefined;
      let speakerIndexStr: string | undefined;

      if (labelSpaceSplit.length < 2 || labelSpaceSplit.length > 3) {
        return null;
      } else if (labelSpaceSplit.length === 2) {
        [speakerLabelStr, speakerIndexStr] = labelSpaceSplit;
      } else if (labelSpaceSplit.length === 3) {
        [turnIndexStr, speakerLabelStr, speakerIndexStr] = labelSpaceSplit;
      }

      const turnIndex = turnIndexStr && isNumber(turnIndexStr) ? parseFloat(turnIndexStr) : undefined;
      const speakerLabel = speakerLabelStr && enumValues(SpeakerLabel).includes(speakerLabelStr) ? speakerLabelStr as SpeakerLabel : undefined;
      const speakerIndex = speakerIndexStr && isNumber(speakerIndexStr) ? parseFloat(speakerIndexStr) : undefined;

      return {
        text,
        speakerIndex,
        speakerLabel,
        turnIndex,
      };
    })
    .filter((l) => !!l) as ParsedSpeakerTurn[];
}
