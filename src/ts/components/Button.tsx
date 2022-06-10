import { Component, JSX } from "solid-js";

type Props = JSX.IntrinsicElements["div"];

export const Button: Component<Props> = (props) => {
  return (
    <div {...props} class={`button unselectable ${props.class ?? ""}`.trim()}>
      <span>{props.children}</span>
    </div>
  );
};
