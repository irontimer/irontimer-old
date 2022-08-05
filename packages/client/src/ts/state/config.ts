import { PopulatedConfig, Unsaved } from "utils";
import { DEFAULT_CONFIG } from "../utils/defaults";
import { createReactiveStore } from "../utils/reactive-store";

export const [config, setConfig, getConfigChange, _setConfig] =
  createReactiveStore<PopulatedConfig | Unsaved<PopulatedConfig>>({
    ...DEFAULT_CONFIG
  });
