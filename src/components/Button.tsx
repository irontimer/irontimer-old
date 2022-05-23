import { Component, JSX } from "solid-js";
import "./Button.scss";

export const Button: Component<{
  children: JSX.Element;
  onClick: (
    e: MouseEvent & {
      currentTarget: HTMLDivElement;
      target: Element;
    }
  ) => void;
  class?: string;
}> = (props) => {
  return (
    <div
      class={`button${props.class === undefined ? "" : " " + props.class}`}
      onClick={props.onClick}
    >
      <span>{props.children}</span>
    </div>
  );
};
