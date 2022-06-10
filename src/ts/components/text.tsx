import { Component, JSX } from "solid-js";

export const Text: Component<{
  children: JSX.Element;
  color: "black" | "gray" | "white";
}> = (props) => {
  return <div class={`text ${props.color}`}>{props.children}</div>;
};
