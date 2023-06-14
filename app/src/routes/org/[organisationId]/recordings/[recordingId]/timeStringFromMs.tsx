export function timeStringFromMs(ms: number) {
  const totalSeconds = Math.round(ms / 1000);
  const remainderSeconds = totalSeconds % 60;
  const secondsString = remainderSeconds >= 10 ? remainderSeconds.toString() : "0" + remainderSeconds.toString();
  const minutes = Math.round((totalSeconds - remainderSeconds) / 60);

  return `${minutes}:${secondsString}`;
}
