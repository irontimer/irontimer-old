const HOUR = 3600;
const MINUTE = 60;
const SECOND = 1;

export function formatTime(time: number): string {
  const roundedTime = roundToMilliseconds(time);

  const hours = Math.floor(roundedTime / HOUR);
  const minutes = Math.floor((roundedTime % HOUR) / MINUTE);
  const seconds = Math.floor((roundedTime % MINUTE) / SECOND);
  const milliseconds = Math.round((roundedTime % SECOND) * 1000);

  const hoursString = hours.toString();
  const minutesString = minutes.toString();
  const secondsString = seconds.toString();
  const millisecondsString = milliseconds.toString().padStart(3, "0");

  let output = "";
  if (hours > 0) {
    output += hoursString + ":";
  }

  if (minutes > 0) {
    output += minutesString + ":";
  }

  output += secondsString + "." + millisecondsString;

  return output;
}

export function roundToMilliseconds(time: number): number {
  return Math.round(time * 1000) / 1000;
}

export function parseTimeString(timeString: string): number {
  let [seconds, minutes, hours] = timeString
    .split(":")
    .map((str) => parseFloat(str))
    .reverse();

  // setting values to 0 if they are NaN
  seconds ??= 0;
  minutes ??= 0;
  hours ??= 0;

  if (isNaN(seconds) || isNaN(minutes) || isNaN(hours)) {
    return NaN;
  }

  return hours * HOUR + minutes * MINUTE + seconds * SECOND;
}
