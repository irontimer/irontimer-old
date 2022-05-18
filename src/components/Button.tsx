import { Component, JSX } from "solid-js";
import "./Button.scss";

export const Button: Component<{
  children: JSX.Element;
  onClick: (
    e: MouseEvent & {
      currentTarget: HTMLDivElement;
      target: Element;
    }
  ) => any;
  color: "light" | "dark";
}> = (props) => {
  return (
    <div class={`button ${props.color}`} onClick={props.onClick}>
      <span>{props.children}</span>
    </div>
  );
};
