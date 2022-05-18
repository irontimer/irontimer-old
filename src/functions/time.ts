const HOUR = 3600;
const MINUTE = 60;
const SECOND = 1;

export function timeFormat(time: number): string {
  const roundedTime = roundMilliseconds(time);

  const hours = Math.floor(roundedTime / HOUR);
  const minutes = Math.floor((roundedTime - hours * HOUR) / MINUTE);
  const seconds = Math.floor(
    (roundedTime - hours * HOUR - minutes * MINUTE) / SECOND
  );
  const milliseconds = Math.floor(
    (roundedTime - hours * HOUR - minutes * MINUTE - seconds * SECOND) * 1000
  );

  const hoursString = hours.toString();
  const minutesString = minutes.toString().padStart(2, "0");
  const secondsString = seconds.toString().padStart(2, "0");
  const millisecondsString = milliseconds.toString().padStart(3, "0");

  return `${hoursString}:${minutesString}:${secondsString}.${millisecondsString}`;
}

export function roundMilliseconds(time: number): number {
  return Math.round(time * 1000) / 1000;
}

export function parseTimeString(timeString: string): number {
  let [seconds, minutes, hours] = timeString
    .split(":")
    .map((str) => parseFloat(str))
    .reverse();

  // settings values to 0 if they are undefined
  seconds ??= 0;
  minutes ??= 0;
  hours ??= 0;

  if (isNaN(seconds) || isNaN(minutes) || isNaN(hours)) {
    return NaN;
  }

  return hours * HOUR + minutes * MINUTE + seconds * SECOND;
}
