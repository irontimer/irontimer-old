import { Config } from "../types";

export const DEFAULT_CONFIG: Config = {
  timerType: "timer",
  currentSession: "Default"
};

export const DEFAULT_CONFIG_KEYS = Object.keys(
  DEFAULT_CONFIG
) as (keyof Config)[];

export const CONFIG_VALUES = {
  timerType: ["timer", "typing", "stackmat"],
  currentSession: []
};
