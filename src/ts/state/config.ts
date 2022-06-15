import { DEFAULT_CONFIG } from "../../constants/config";
import { Config, Saved } from "../../types";
import { createReactiveStore } from "../utils/reactive-store";

export const [config, setConfig, getConfigChange, _setConfig] =
  createReactiveStore<Config | Saved<Config, string>>({
    ...DEFAULT_CONFIG
  });
