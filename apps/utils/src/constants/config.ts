import { Config } from "../types";

export const DEFAULT_CONFIG: Config = {
  timerType: "timer",
  currentSession: "Default",
  displayAverages: [5, 12, 50, 100, 200, 500, 1000]
};

export const DEFAULT_CONFIG_KEYS = Object.keys(
  DEFAULT_CONFIG
) as (keyof Config)[];

export const CONFIG_VALUES = {
  timerType: ["timer", "typing", "stackmat"],
  currentSession: [],
  displayAverages: [
    [5, 12, 50, 100],
    [5, 12, 50, 100, 200, 500],
    [5, 12, 50, 100, 200, 500, 1000]
  ]
};
