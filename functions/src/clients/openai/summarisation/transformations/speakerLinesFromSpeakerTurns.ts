import { ParsedSpeakerTurn } from "../interfaces/SpeakerTurn";

export function speakerLinesFromSpeakerTurns(speakerTurns: ParsedSpeakerTurn[], showIndex: boolean): string[] {
  return speakerTurns.map((turn, index) => {
    const { speakerLabel, speakerIndex } = turn;
    if (showIndex) return `${index} ${speakerLabel ?? speakerIndex}: ${turn.text}`;
    return `${speakerLabel ?? speakerIndex}: ${turn.text}`;
  });
}
