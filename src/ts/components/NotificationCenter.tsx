import { Component, For } from "solid-js";
import Notifications, { notificationBuffer } from "../state/notifications";

export const NotificationCenter: Component = () => {
  return (
    <div id="notification-center">
      <For each={Object.keys(notificationBuffer).reverse()}>
        {(id) => {
          const notification = notificationBuffer[id];

          return (
            <div
              class={`notification ${notification.type}`}
              onClick={() => Notifications.delete(id)}
            >
              <div class="notification-message unselectable">
                {notification.message}
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
};
