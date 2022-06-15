import { Accessor, Component, JSX, Show } from "solid-js";
import { Icon } from "./icon";

export const Collapsible: Component<{
  title: JSX.Element;
  children: JSX.Element;
  isClosed: [Accessor<boolean>, (value: boolean) => void];
}> = (props) => {
  const [isClosed, setIsClosed] = props.isClosed;

  return (
    <>
      <div class="collapsible">
        <div class="collapsible-title" onClick={() => setIsClosed(!isClosed())}>
          {props.title}
        </div>
        <Icon
          icon="chevron-down"
          class="collapsible-icon"
          style={{
            transform: isClosed() ? "rotate(-90deg)" : "rotate(0deg)"
          }}
        />
      </div>
      <Show when={!isClosed()}>{props.children}</Show>
    </>
  );
};
