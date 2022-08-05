import { Config, DEFAULT_CONFIG, Saved } from "utils";
import { createReactiveStore } from "../utils/reactive-store";

export const [config, setConfig, getConfigChange, _setConfig] =
  createReactiveStore<Config | Saved<Config, string>>({
    ...DEFAULT_CONFIG
  });
