import { TimerType } from "@prisma/client";
import { Component } from "solid-js";
import { Section } from "../components/settings/section";
import { SettingsGroup } from "../components/settings/settings-group";
import { config, setConfig } from "../state/config";
import {
  currentSession,
  getSessionsByNames,
  setCurrentSession
} from "../state/session";

export const Settings: Component = () => {
  return (
    <div class="settings-page">
      <h1 class="settings-page-header">Settings</h1>

      <div class="groups">
        <SettingsGroup title="Timer" class="timer">
          <Section
            class="timer-type"
            header="Timer Type"
            description="The type of timer to use when solving."
            type="buttons"
            values={Object.keys(TimerType)}
            onValueChange={(value: TimerType) => setConfig("timerType", value)}
            currentValue={() => config.timerType}
          />
        </SettingsGroup>

        <SettingsGroup title="Session" class="session">
          <Section
            class="current-session"
            header="Current Session"
            description="The current session that solves will be added to."
            type="select"
            values={getSessionsByNames}
            onValueChange={(value: string) =>
              setConfig("currentSession", value)
            }
            currentValue={() => config.currentSession}
          />

          <Section
            class="current-session-name"
            header="Current Session Name"
            description="The name of the current session."
            type="input"
            values={[]}
            onValueChange={(value: string) => {
              setCurrentSession("name", value);
              setConfig("currentSession", value);
            }}
            currentValue={() => currentSession.name}
          />
        </SettingsGroup>

        <SettingsGroup title="Averages" class="averages">
          <Section
            class="display-averages"
            header="Display Averages"
            description="What averages to display on the average list."
            type="select"
            values={[
              [5, 12, 50, 100],
              [5, 12, 50, 100, 200, 500],
              [5, 12, 50, 100, 200, 500, 1000]
            ]}
            onValueChange={(value: number[]) =>
              setConfig("displayAverages", value)
            }
            currentValue={() => config.displayAverages}
            displayValues={(value: number[]) =>
              value.map((v) => `ao${v}`).join(", ")
            }
          />
        </SettingsGroup>
      </div>
    </div>
  );
};
