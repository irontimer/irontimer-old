import { PopulatedConfig, Unsaved } from "utils";

export const DEFAULT_CONFIG: Unsaved<PopulatedConfig> = {
  timerType: "timer",
  currentSessionId: "Default",
  displayAverages: [5, 12, 50, 100, 200, 500, 1000]
};
