import { Component, JSX } from "solid-js";
import { c } from "../utils/misc";

export const Text: Component<{
  children: JSX.Element;
  color: "black" | "gray" | "white";
}> = (props) => {
  return <div class={c("text", props.color)}>{props.children}</div>;
};
