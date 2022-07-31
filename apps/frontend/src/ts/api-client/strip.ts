import { Saved } from "utils";

export function strip<T, O>(obj: Saved<T, O> | T): T {
  const newObj: T = {
    ...obj,
    _id: undefined,
    __v: undefined
  };

  return newObj;
}
