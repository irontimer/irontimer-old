import { Component, For } from "solid-js";
import {
  CONFIG_VALUES,
  DEFAULT_CONFIG_KEYS
} from "../../constants/default-config";
import { setConfig } from "../state/config";

export const Settings: Component = () => {
  return (
    <div class="settings-page">
      <For each={DEFAULT_CONFIG_KEYS}>
        {(key) => (
          <div class="setting">
            <div class="setting-key">{key}</div>
            <div class="setting-options">
              <For each={CONFIG_VALUES[key]}>
                {(value) => (
                  <button onClick={() => setConfig(key, value)}>{value}</button>
                )}
              </For>
            </div>
          </div>
        )}
      </For>
    </div>
  );
};
