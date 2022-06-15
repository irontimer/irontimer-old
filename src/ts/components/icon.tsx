import type { Component, JSX } from "solid-js";
import { c } from "../utils/misc";

type Props = JSX.IntrinsicElements["i"] & {
  icon: string;
};

export const Icon: Component<Props> = (props) => (
  <i class={c(props.class, "fas", `fa-${props.icon}`)} />
);
