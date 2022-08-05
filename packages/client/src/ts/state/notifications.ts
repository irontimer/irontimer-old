import { createStore } from "solid-js/store";
import type { Notification, Unsaved } from "utils";
import { isTauri } from "../utils/tauri";

export const [notificationBuffer, setNotificationBuffer] = createStore<
  Record<string, Notification>
>({});

function addWeb(notification: Unsaved<Notification>): void {
  let id = generateNotificationId();

  while (notificationBuffer[id] !== undefined) {
    id = generateNotificationId();
  }

  setNotificationBuffer((buffer) => ({
    ...buffer,
    [id]: {
      ...notification,
      id
    }
  }));

  if (notification.duration) {
    setTimeout(() => {
      deleteNotification(id);
    }, notification.duration);
  }
}

function addTauri(notification: Unsaved<Notification>): void {
  window.__TAURI__?.notification.sendNotification(notification.message);
}

function deleteNotification(id: string): void {
  setNotificationBuffer((buffer) => {
    return {
      ...buffer,
      [id]: undefined
    };
  });
}

function generateNotificationId(): string {
  return Math.random().toString(36).substring(2, 15);
}

const Notifications = {
  add: isTauri ? addTauri : addWeb,
  delete: deleteNotification
};

export default Notifications;
