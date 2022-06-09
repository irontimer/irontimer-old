import { Result } from "../../types";

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

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomInteger(min: number, max: number): number {
  const num = Math.floor(randomFloat(min, max));

  return num;
}

export function randomBoolean(): boolean {
  return Math.round(Math.random()) === 1;
}

export function randomChance(percent: number): boolean {
  return randomFloat(0, 100) <= percent;
}

export function calculateAverage(results: Result[]): number {
  const sorted = results.sort((a, b) => actualTime(a) - actualTime(b));

  // we trim off 10% of the solves to avoid outliers
  // if 5% of the length is not even, we take one less of the best and one more of the worst
  // otherwise we trim 5% of the best and 5% of the worst
  // at minimum we remove the best and worst solve
  const toTrim = Math.max(results.length * 0.1, 2) / 2;
  const toTrimLeft = Math.floor(toTrim);
  const toTrimRight = Math.ceil(toTrim);

  // get rid of the best and worst results
  const middle = sorted.slice(toTrimLeft, results.length - toTrimRight);

  // means the three middle results
  return mean(middle.map((result) => actualTime(result)));
}

export function calculateAverageString(results: Result[]): string {
  const avg = calculateAverage(results);

  if (avg === Infinity) {
    return "DNF";
  }

  return formatTime(avg);
}

export function mean(arr: number[]): number {
  return sum(arr) / arr.length;
}

export function sum(arr: number[]): number {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

export function actualTime(result: Result | undefined): number {
  if (result === undefined) {
    return 0;
  }

  switch (result.penalty) {
    case "OK":
      return result.time;

    case "+2":
      return result.time + 2;

    case "DNF":
      return Infinity;
  }
}

export function actualTimeString(result: Result | undefined): string {
  if (result === undefined) {
    return "";
  }

  switch (result.penalty) {
    case "OK":
      return formatTime(result.time);

    case "+2":
      return `${formatTime(actualTime(result))}+`;

    case "DNF":
      return "DNF";
  }
}
