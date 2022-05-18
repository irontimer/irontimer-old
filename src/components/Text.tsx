import { Component, JSX } from "solid-js";
import "./Text.scss";

export const Text: Component<{
  children: JSX.Element;
  color: "black" | "gray" | "white";
}> = (props) => {
  return <div class={`text ${props.color}`}>{props.children}</div>;
};
