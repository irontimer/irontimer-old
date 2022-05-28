import { Component, JSX } from "solid-js";

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
      class={`button unselectable ${props.class ?? ""}`.trim()}
      onClick={props.onClick}
    >
      <span>{props.children}</span>
    </div>
  );
};
