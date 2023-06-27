import { ParsedSpeakerTurn } from "../interfaces/SpeakerTurn";

export function speakerLinesFromSpeakerTurns(speakerTurns: ParsedSpeakerTurn[], showLabel: boolean, showIndex = true): string[] {
  return speakerTurns.map((turn, index) => {
    const { speakerLabel, speakerIndex } = turn;

    let label = showIndex ? `${index} ` : "";

    if (showLabel) {
      label += `${speakerLabel ?? "UNKNOWN"}`;
    }

    label += ` ${speakerIndex}`;

    return `${label}: ${turn.text}`;
  });
}
