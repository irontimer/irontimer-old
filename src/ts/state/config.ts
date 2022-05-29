import { createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { DEFAULT_CONFIG } from "../../constants/default-config";
import { Config, Saved } from "../../types";

export const [config, setConfigTemp] = createStore<
  Config | Saved<Config, string>
>({ ...DEFAULT_CONFIG });

export const [getConfigChange, setConfigChange] = createSignal(false);

// eslint-disable-next-line
// @ts-ignore
export const setConfig: typeof setConfigTemp = (...args) => {
  setConfigChange(!getConfigChange());

  // eslint-disable-next-line
  // @ts-ignore
  setConfigTemp(...args);
};
