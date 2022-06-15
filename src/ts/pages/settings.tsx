import { Accessor, Component, For, JSX, Match, Switch } from "solid-js";
import { TimerType } from "../../types";
import { Button } from "../components/button";
import { config, setConfig } from "../state/config";
import {
  currentSession,
  getSessionsByNames,
  setCurrentSession
} from "../state/session";
import { c } from "../utils/misc";

function isAccessor<T>(obj: any): obj is Accessor<T> {
  return typeof obj === "function";
}

const Section: Component<{
  class: string;
  header: string;
  description: string;
  type: "buttons" | "select" | "input";
  values: any[] | Accessor<any[]>;
  onValueChange: (value: any) => void;
  currentValue: Accessor<any>;
  displayValues?: (value: any) => string;
}> = (props) => {
  const values: Accessor<any[]> = () =>
    isAccessor(props.values) ? props.values() : props.values;

  return (
    <div class={c("section", props.class)}>
      <div class="section-text">
        <h3 class="section-header">{props.header}</h3>
        <div class="section-description">{props.description}</div>
      </div>
      <div class="section-options">
        <Switch>
          <Match when={props.type === "buttons"}>
            <div class="section-buttons">
              <For each={values()}>
                {(value) => (
                  <Button
                    class={c(
                      "section-button",
                      props.currentValue() === value ? "active" : ""
                    )}
                    onClick={() => props.onValueChange(value)}
                  >
                    {props.displayValues !== undefined
                      ? props.displayValues(value)
                      : value}
                  </Button>
                )}
              </For>
            </div>
          </Match>
          <Match when={props.type === "select"}>
            <select class="section-select">
              <For each={values()}>
                {(value) => (
                  <option
                    value={value}
                    selected={props.currentValue() === value}
                  >
                    {props.displayValues !== undefined
                      ? props.displayValues(value)
                      : value}
                  </option>
                )}
              </For>
            </select>
          </Match>
          <Match when={props.type === "input"}>
            <input
              class="section-input"
              placeholder={
                props.displayValues !== undefined
                  ? props.displayValues(props.currentValue())
                  : props.currentValue()
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  props.onValueChange(e.currentTarget.value);
                }
              }}
            />
          </Match>
        </Switch>
      </div>
    </div>
  );
};

const SettingsGroup: Component<{
  class: string;
  title: string;
  children: JSX.Element;
}> = (props) => {
  return (
    <div class={c("settings-group", props.class)}>
      <h2 class="settings-group-header">{props.title}</h2>
      <div class="settings-group-content">{props.children}</div>
    </div>
  );
};

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
            values={["timer", "typing", "stackmat"]}
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
