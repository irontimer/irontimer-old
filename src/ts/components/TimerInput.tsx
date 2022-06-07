import { Component } from "solid-js";
import { parseTimeString } from "../functions/time";
import Notifications from "../state/notifications";
import { addResult } from "../state/result";

const inputRegex = /^([0-9]{0,2}):?([0-9]{0,2}):?([0-9]*)\.?([0-9]{1,3})?\+?$/;
const finalInputRegex = /^(([0-9]{1,2}:){0,2})([0-9]+)(\.[0-9]{1,3})?\+?$/;

export const TimerInput: Component = () => {
  return (
    <input
      class="timer-input"
      placeholder="Enter time"
      onKeyPress={(e) => {
        if (e.key !== "Enter") {
          if (!isLegalCharacter(e)) {
            e.preventDefault();
          }

          return;
        }

        const str = e.currentTarget.value;

        if (!finalInputRegex.test(str)) {
          Notifications.add({
            type: "error",
            message: "Invalid time format"
          });

          return;
        }

        const isPlusTwo = str.endsWith("+");
        const val = isPlusTwo ? str.substring(0, str.length - 1) : str;

        let float = /[^0-9.]/.test(val) ? NaN : parseFloat(val);

        if (isNaN(float)) {
          float = parseTimeString(val);
        }

        if (isNaN(float)) {
          Notifications.add({
            type: "error",
            message: "Entered time is not a number"
          });
        } else {
          if (float % 1 === 0 && !val.includes(".")) {
            float /= 1000;
          }

          addResult(float, isPlusTwo);
        }

        e.currentTarget.value = "";
      }}
    />
  );
};

function isLegalCharacter(
  e: KeyboardEvent & {
    currentTarget: HTMLInputElement;
    target: Element;
  }
): boolean {
  const str = e.currentTarget.value + e.key;

  if (!inputRegex.test(str)) {
    return false;
  }

  return true;
}
