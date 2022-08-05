import { createEffect, on } from "solid-js";
import { Config } from "utils";
import API from "../api-client";
import { auth } from "../utils/auth";
import { config, getConfigChange } from "./config";
import Notifications from "./notifications";
import { setAndGenerateScramble } from "./scramble";
import { getSolves } from "./solve";
// import { currentSession, getCurrentSessionChange } from "./session";

// This also updates a scramble when the scramble type changes

createEffect(on([getSolves, getConfigChange], () => setAndGenerateScramble()));

createEffect(
  on(getConfigChange, async () => {
    if (auth.currentUser === null) {
      return;
    }

    const response = await API.configs.save(config as Config);

    if (response.status !== 200) {
      Notifications.add({
        type: "error",
        message: `Failed to save config\n${response.message}`
      });

      return;
    }

    console.log("Saved config to database");
  })
);

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
