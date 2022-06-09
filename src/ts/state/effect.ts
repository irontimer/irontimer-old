import { createEffect, untrack } from "solid-js";
import API from "../api-client";
import { auth } from "../utils/auth";
import { config, getConfigChange } from "./config";
import { getSolves } from "./solve";
import { setAndGenerateScramble } from "./scramble";
import Notifications from "./notifications";

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
    const response = await API.configs.save(config);

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
