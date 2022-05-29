import { Component, For } from "solid-js";
import {
  deleteNotification,
  getNotificationBuffer
} from "../state/notifications";

export const NotificationCenter: Component = () => {
  return (
    <div id="notification-center">
      <For each={getNotificationBuffer()}>
        {(notification, getIndex) => (
          <div
            class={`notification ${notification.status}`}
            onClick={() => {
              deleteNotification(getIndex());
            }}
          >
            <div class="notification-message unselectable">
              {notification.message}
            </div>
          </div>
        )}
      </For>
    </div>
  );
};
