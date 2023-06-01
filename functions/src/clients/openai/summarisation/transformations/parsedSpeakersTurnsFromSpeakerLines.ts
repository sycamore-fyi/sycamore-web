import { logger } from "firebase-functions/v2";
import { ParsedSpeakerTurn } from "../interfaces/SpeakerTurn";
import { enumValues } from "../../../../utils/enumValues";
import { SpeakerLabel } from "../interfaces/SpeakerLabel";
import { isNumber } from "../../../../utils/isNumber";

export function parsedSpeakersTurnsFromSpeakerLines(speakerLines: string[]): ParsedSpeakerTurn[] {
  return speakerLines.map((line) => {
    const colonDelimiter = ": ";
    const colonSplit = line.split(colonDelimiter);

    if (colonSplit.length < 2) {
      logger.info("invalid speaker line, no colon");
      return {};
    }

    const [labels] = colonSplit;
    const text = line.slice(labels.length + colonDelimiter.length);

    const labelSpaceSplit = labels.split(" ");

    let indexString: string | undefined;
    let labelString: string | undefined;

    switch (labelSpaceSplit.length) {
      case 0: return {};
      case 1: {
        [labelString] = labelSpaceSplit;
        break;
      }
      case 2: {
        [indexString, labelString] = labelSpaceSplit;
        break;
      }
      default: return {};
    }

    const turnIndex = indexString && isNumber(indexString) ? parseFloat(indexString) : undefined;
    const speakerLabel = labelString && enumValues(SpeakerLabel).includes(labelString) ? labelString as SpeakerLabel : undefined;
    const speakerIndex = labelString && isNumber(labelString) ? parseFloat(labelString) : undefined;

    return {
      text,
      speakerIndex,
      speakerLabel,
      turnIndex,
    };
  });
}
