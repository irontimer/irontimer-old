import { Component } from "solid-js";
import { parseTimeString } from "../functions/time";
import { addNotification } from "../state/notifications";
import { addResult } from "../state/result";

export const TimerInput: Component = () => {
  return (
    <div class="timer-input">
      <input
        placeholder="Enter time"
        onKeyPress={(e) => {
          if (e.key !== "Enter") {
            if (/[^0-9.:,]/.test(e.key)) {
              e.preventDefault();
            }

            return;
          }

          const val = e.currentTarget.value.replace(/,/g, "");

          let float = /[^0-9.]/.test(val) ? NaN : parseFloat(val);

          if (isNaN(float)) {
            float = parseTimeString(val);
          }

          if (isNaN(float)) {
            addNotification({
              type: "error",
              message: "Entered time is not a number"
            });
          } else {
            if (float % 1 === 0 && !val.includes(".")) {
              float /= 1000;
            }

            addResult(float);
          }

          e.currentTarget.value = "";
        }}
      />
    </div>
  );
};
