import { createStore } from "solid-js/store";
import { createEffect } from "solid-js";
import API from "../api-client";
import { auth } from "../functions/auth";
import { DEFAULT_CONFIG } from "../../constants/default-config";
import { SavedConfig, UnsavedConfig } from "../../types";

export const [config, setConfig] = createStore<UnsavedConfig | SavedConfig>(
  DEFAULT_CONFIG
);

createEffect(() => {
  if (auth.currentUser !== null) {
    API.configs.save(config);
  }
});
