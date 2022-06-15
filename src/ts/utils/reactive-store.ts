import { Accessor, createSignal } from "solid-js";
import {
  createStore,
  DeepReadonly,
  SetStoreFunction,
  StoreNode
} from "solid-js/store";
import { isShallowEqual } from "./misc";

export function createReactiveStore<T extends StoreNode>(
  initialValue: T
): [
  get: DeepReadonly<T>,
  set: SetStoreFunction<T>,
  getChange: Accessor<boolean>,
  _set: SetStoreFunction<T>
] {
  const [value, _setValue] = createStore<T>(initialValue);
  const [getChange, setChange] = createSignal(false);

  // eslint-disable-next-line
  // @ts-ignore
  const setValue: typeof _setValue = (...args) => {
    const previousValue = { ...value };

    // eslint-disable-next-line
    // @ts-ignore
    _setValue(...args);

    const newValue = { ...value };

    if (!isShallowEqual(previousValue, newValue)) {
      setChange(!getChange());
    }
  };

  return [value, setValue, getChange, _setValue];
}
