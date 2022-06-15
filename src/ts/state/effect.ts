import { createEffect, untrack } from "solid-js";
import { config, getConfigChange } from "./config";
import { getSolves } from "./solve";
import { setAndGenerateScramble } from "./scramble";
import { auth } from "../utils/auth";
import API from "../api-client";
import Notifications from "./notifications";
import { Config, Saved } from "../../types";
// import { currentSession, getCurrentSessionChange } from "./session";

createEffect(() => {
  // Update scramble when solves list changes
  // Basically, calling a signal is like a dependency array in React
  getSolves();
  getConfigChange();

  // This also updates a scramble when the scramble type changes
  untrack(() => setAndGenerateScramble());
});

createEffect(async () => {
  getConfigChange();

  if (auth.currentUser !== null) {
    const response = await API.configs.save(config as Config | Saved<Config>);

    if (response.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to save config\n${response.message}`
      });

      return;
    }

    console.log("Saved config to database");
  }
});

// createEffect(async () => {
//   getCurrentSessionChange();

//   if (auth.currentUser !== null) {
//     const response = await API.sessions.save(currentSession);

//     if (response.status !== 200) {
//       Notifications.add({
//         type: "error",
//         message: `Failed to save session\n${response.message}`
//       });

//       return;
//     }

//     console.log("Saved session to database");
//   }
// });
