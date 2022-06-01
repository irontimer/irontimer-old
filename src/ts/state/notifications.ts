import { createStore } from "solid-js/store";
import type { Notification } from "../../types";

export const [notificationBuffer, setNotificationBuffer] = createStore<
  Record<string, Notification>
>({});

function add(notification: Omit<Notification, "id">): void {
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

export default {
  add,
  delete: deleteNotification
};
