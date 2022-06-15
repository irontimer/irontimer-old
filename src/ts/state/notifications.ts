import { createStore } from "solid-js/store";
import type { Notification, NotificationOptions } from "../../types";
import { isTauri } from "../utils/tauri";

export const [notificationBuffer, setNotificationBuffer] = createStore<
  Record<string, Notification>
>({});

function addWeb(notification: NotificationOptions): void {
  let id = generateNotificationID();

  while (notificationBuffer[id] !== undefined) {
    id = generateNotificationID();
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

function addTauri(notification: NotificationOptions): void {
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

function generateNotificationID(): string {
  return Math.random().toString(36).substring(2, 15);
}

const Notifications = {
  add: isTauri ? addTauri : addWeb,
  delete: deleteNotification
};

export default Notifications;
