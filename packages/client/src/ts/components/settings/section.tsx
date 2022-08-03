import { Accessor, Component, For, Match, Switch } from "solid-js";
import { c } from "../../utils/misc";
import { Button } from "../button";

function isAccessor<T>(obj: any): obj is Accessor<T> {
  return typeof obj === "function";
}

export const Section: Component<{
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
                      props.currentValue() === value && "active"
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
