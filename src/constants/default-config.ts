import { Config } from "../types";

export const DEFAULT_CONFIG: Config = {
  timerType: "timer",
  scrambleType: "3x3x3"
};

export const DEFAULT_CONFIG_ENTRIES = Object.keys(
  DEFAULT_CONFIG
) as (keyof Config)[];
