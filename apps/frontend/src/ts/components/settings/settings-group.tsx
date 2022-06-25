import { Component, createSignal, JSX } from "solid-js";
import { c } from "../../utils/misc";
import { Collapsible } from "../collapsible";

export const SettingsGroup: Component<{
  class: string;
  title: string;
  children: JSX.Element;
}> = (props) => {
  const [isClosed, setIsClosed] = createSignal(false);

  return (
    <div class={c("settings-group", props.class)}>
      <Collapsible
        title={<h2 class="settings-group-header">{props.title}</h2>}
        isClosed={[isClosed, setIsClosed]}
      >
        <div class="settings-group-content">{props.children}</div>
      </Collapsible>
    </div>
  );
};
