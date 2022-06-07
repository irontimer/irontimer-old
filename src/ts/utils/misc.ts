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

export function randomInteger(min: number, max: number): number {
  return Math.floor(randomFloat(min, max));
}

export function randomFloat(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function randomBoolean(): boolean {
  return Math.round(Math.random()) === 1;
}

export function calculateAverage(results: Result[]): number {
  const sorted = results.sort((a, b) => actualTime(a) - actualTime(b));

  const middle = sorted.slice(1, results.length - 1); // this gets rid of the best and worst results respectively

  return mean(middle.map((result) => result.time)); // means the three middle results
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
      return result.time.toString();

    case "+2":
      return `${actualTime(result)}+`;

    case "DNF":
      return "DNF";
  }
}
