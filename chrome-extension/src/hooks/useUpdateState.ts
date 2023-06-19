import { Dispatch, useReducer } from "react";

export function useUpdateState<T>(initialState: T): [
  T,
  Dispatch<Partial<T>>,
  (key: keyof T) => {
    name: keyof T,
    value: T[keyof T],
    onChange: (value: T[keyof T]) => void
  }
] {
  const [state, updateState] = useReducer(
    (s: T, update: Partial<T>) => ({ ...s, ...update }),
    initialState
  )

  const stateProps = (key: keyof T) => ({
    name: key,
    value: state[key],
    onChange: (value: T[keyof T]) => updateState({ [key]: value } as Partial<T>)
  })

  return [state, updateState, stateProps]
}
