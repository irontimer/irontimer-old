import { Unsaved } from "utils";

export function strip<T>(obj: T): Unsaved<T> {
  const newObj: T = {
    ...obj,
    id: undefined,
    createdAt: undefined,
    updatedAt: undefined
  };

  return newObj;
}
