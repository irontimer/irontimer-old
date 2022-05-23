import { Component, JSX, Show } from "solid-js";
import { Button } from "./Button";
import "./Popup.scss";

export const Popup: Component<{
  children: JSX.Element;
  id: string;
  wrapperID: string;
  isOpen: [() => boolean, (isOpen: boolean) => void];
}> = (props) => {
  const [getIsOpen, setIsOpen] = props.isOpen;

  return (
    <Show when={getIsOpen()}>
      <div class="popup-wrapper" id={props.wrapperID}>
        <div id={props.id}>
          {props.children}

          <Button class="popup-close-button" onClick={() => setIsOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    </Show>
  );
};
