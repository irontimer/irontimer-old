import { createSignal } from "solid-js";
import API from "../../api-client";
import { DEFAULT_CONFIG } from "../../constants/default-config";
import { auth } from "../functions/auth";
import { SavedConfig, UnsavedConfig } from "../../types";

export const [getConfig, setConfig] = createSignal<UnsavedConfig | SavedConfig>(
  DEFAULT_CONFIG
);

export function saveConfig(config: UnsavedConfig | SavedConfig): void {
  setConfig(config);

  if (auth.currentUser !== null) {
    API.configs.save(config);
  }
}

export function getConfigValue(key: keyof UnsavedConfig): string {
  return getConfig()[key];
}

export function setConfigValue<K extends keyof UnsavedConfig>(
  key: keyof UnsavedConfig,
  value: UnsavedConfig[K]
): void {
  setConfig({
    ...getConfig(),
    [key]: value
  });

  if (auth.currentUser !== null) {
    API.configs.save(getConfig());
  }
}
