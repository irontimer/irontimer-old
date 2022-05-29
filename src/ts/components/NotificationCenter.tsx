import { Component, For } from "solid-js";
import { deleteNotification, notificationBuffer } from "../state/notifications";

export const NotificationCenter: Component = () => {
  return (
    <div id="notification-center">
      <For each={Object.keys(notificationBuffer)}>
        {(id) => {
          const notification = notificationBuffer[id];

          return (
            <div
              class={`notification ${notification.type}`}
              onClick={() => {
                deleteNotification(id);
              }}
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
