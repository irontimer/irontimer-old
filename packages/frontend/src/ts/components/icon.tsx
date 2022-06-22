import type { Component, JSX } from "solid-js";
import type { IconName } from "@fortawesome/fontawesome-common-types";
import { c } from "../utils/misc";

type Props = JSX.IntrinsicElements["i"] & {
  icon: IconName;
};

export const Icon: Component<Props> = (props) => (
  <i {...props} class={c(props.class, "fas", `fa-${props.icon}`)} />
);
