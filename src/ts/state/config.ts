import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { DEFAULT_CONFIG } from "../../constants/default-config";
import { Config, Saved } from "../../types";
import { isShallowEqual } from "../utils/misc";

export const [getConfigChange, setConfigChange] = createSignal(false);
export const [config, _setConfig] = createStore<Config | Saved<Config, string>>(
  { ...DEFAULT_CONFIG }
);

/**
 * @description This is so we can know if the config has changed.
 */
// eslint-disable-next-line
// @ts-ignore
export const setConfig: typeof _setConfig = (...args) => {
  const previousConfig = { ...config };

  // eslint-disable-next-line
  // @ts-ignore
  _setConfig(...args);

  const newConfig = { ...config };

  if (!isShallowEqual(previousConfig, newConfig)) {
    setConfigChange(!getConfigChange());
  }
};
