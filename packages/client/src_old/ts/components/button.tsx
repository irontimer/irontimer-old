import { Component, JSX } from "solid-js";
import { c } from "../utils/misc";

type Props = JSX.IntrinsicElements["div"];

export const Button: Component<Props> = (props) => (
  <div {...props} class={c("button", "unselectable", props.class)}>
    <span>{props.children}</span>
  </div>
);
