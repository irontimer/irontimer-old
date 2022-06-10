import { Accessor, Component, JSX, Show } from "solid-js";
import { Button } from "./Button";

export const Popup: Component<{
  children: JSX.Element;
  id: string;
  isOpen: [Accessor<boolean>, (isOpen: boolean) => void];
}> = (props) => {
  const [getIsOpen, setIsOpen] = props.isOpen;

  return (
    <Show when={getIsOpen()}>
      <div class="popup-wrapper" id={`${props.id}-wrapper`}>
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
