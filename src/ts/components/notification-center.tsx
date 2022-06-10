import { Component, For, Show } from "solid-js";
import Notifications, { notificationBuffer } from "../state/notifications";
import { isTauri } from "../utils/tauri";
import { isTiming } from "./stopwatch";

export const NotificationCenter: Component = () => {
  return (
    <div id="notification-center">
      <Show when={!isTiming() && !isTauri}>
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
      </Show>
    </div>
  );
};
