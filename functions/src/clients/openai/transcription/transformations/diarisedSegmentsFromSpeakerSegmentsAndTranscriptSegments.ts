import { deduplicate } from "../../../../utils/deduplicate";
import { mean } from "../../../../utils/mean";
import { nsorter, sorter } from "../../../../utils/sorter";
import { DiarizedTranscriptSegment } from "../interfaces/DiarizedTranscriptSegment";
import { SpeakerSegment } from "../interfaces/SpeakerSegment";
import { TranscriptSegment } from "../interfaces/TranscriptSegment";

function getOverlappingSegments(
  transcriptSegment: TranscriptSegment,
  speakerSegments: SpeakerSegment[],
  speakerIndex: number
) {
  const { startMs, endMs } = transcriptSegment;

  return speakerSegments.filter((segment) => (
    segment.speakerIndex === speakerIndex &&
    segment.startMs < endMs &&
    segment.endMs > startMs
  ));
}

function getOverlapTime(
  transcriptSegment: TranscriptSegment,
  speakerSegments: SpeakerSegment[],
  speakerIndex: number
) {
  const { startMs, endMs } = transcriptSegment;
  const overlappingSegments = getOverlappingSegments(transcriptSegment, speakerSegments, speakerIndex);

  return overlappingSegments.reduce((sum, segment) => {
    return sum + Math.min(endMs, segment.endMs) - Math.max(startMs, segment.startMs);
  }, 0);
}

function getMaxOverlappingSegmentLength(
  overlappingSegments: SpeakerSegment[],
) {
  if (overlappingSegments.length === 0) return 0;
  return Math.max(...overlappingSegments.map((segment) => segment.endMs - segment.startMs));
}

export function calculateProbableSpeaker(
  transcriptSegment: TranscriptSegment,
  speakerSegments: SpeakerSegment[]
) {
  const speakerIndexes = deduplicate(speakerSegments.map((segment) => segment.speakerIndex));
  const speakerData = speakerIndexes.map((speaker) => ({
    speaker,
    overlapTime: getOverlapTime(transcriptSegment, speakerSegments, speaker),
    maxOverlappingSegmentLength: getMaxOverlappingSegmentLength(
      getOverlappingSegments(transcriptSegment, speakerSegments, speaker)
    ),
  }));

  const overlappingSpeakerData = speakerData.filter((datum) => datum.overlapTime > 0);
  const overlappingSpeakerCount = overlappingSpeakerData.length;

  switch (overlappingSpeakerCount) {
    case 0: {
      const { startMs, endMs } = transcriptSegment;
      const midpoint = mean([startMs, endMs]);
      const calcDistance = (segment: SpeakerSegment) => Math.abs(midpoint - mean([segment.startMs, segment.endMs]));
      const closestSpeakerMidpointIndex = speakerSegments.reduce((prevSegmentIndex, segment, index, arr) => {
        const prevSegment = arr[prevSegmentIndex];
        const isCurrentSpeakerSegmentNearerToTranscriptSegmentMidpoint = calcDistance(segment) < calcDistance(prevSegment);
        return isCurrentSpeakerSegmentNearerToTranscriptSegmentMidpoint ? index : prevSegmentIndex;
      }, 0);

      return speakerSegments[closestSpeakerMidpointIndex].speakerIndex;
    }

    case 1: return overlappingSpeakerData[0].speaker;
    default: {
      const sortedOverlapTimes = speakerData.map((datum) => datum.overlapTime).sort(nsorter(false));
      const overlapPercDiff = (sortedOverlapTimes[0] - sortedOverlapTimes[1]) / sortedOverlapTimes[1];

      if (overlapPercDiff > 0.4) {
        return speakerData.sort(sorter((v) => v.overlapTime, false))[0].speaker;
      } else {
        return speakerData.sort(sorter((v) => v.maxOverlappingSegmentLength))[0].speaker;
      }
    }
  }
}

export function diarisedSegmentsFromSpeakerSegmentsAndTranscriptSegments(
  speakerSegments: SpeakerSegment[],
  transcriptSegments: TranscriptSegment[]
): DiarizedTranscriptSegment[] {
  return transcriptSegments.map((transcriptSegment) => ({
    ...transcriptSegment,
    speakerIndex: calculateProbableSpeaker(transcriptSegment, speakerSegments),
  }));
}
