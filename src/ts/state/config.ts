import { createStore } from "solid-js/store";
import { DEFAULT_CONFIG } from "../../constants/default-config";
import { Config, Saved } from "../../types";

export const [config, setConfig] = createStore<Config | Saved<Config, string>>(
  DEFAULT_CONFIG
);
