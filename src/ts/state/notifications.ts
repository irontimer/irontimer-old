import { createSignal } from "solid-js";
import type { Notification } from "../../types";

export const [getNotificationBuffer, setNotificationBuffer] = createSignal<
  Notification[]
>([]);

export function addNotification(notification: Notification): void {
  setNotificationBuffer((buffer) => {
    if (notification.duration !== undefined) {
      setTimeout(() => {
        deleteNotification(buffer.length);
      }, notification.duration);
    }

    return [...buffer, notification];
  });
}

export function deleteNotification(index: number): void {
  if (getNotificationBuffer().length > index) {
    setNotificationBuffer((buffer) => buffer.filter((_, i) => i !== index));
  }
}
