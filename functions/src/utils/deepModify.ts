import { getType, Type } from "./getType";

interface Modifiers {
  date?: (value: Date) => any,
  string?: (value: string) => any,
  number?: (value: number) => any,
  boolean?: (value: boolean) => any,
  symbol?: (value: symbol) => any,
  null?: () => any,
  key?: (value: string) => string
}

export function deepModify(value: any, modifiers: Modifiers): any {
  switch (getType(value)) {
    case Type.NULL:
      return modifiers.null?.() ?? null;
    case Type.BOOLEAN:
      return modifiers.boolean?.(value) ?? value;
    case Type.NUMBER:
      return modifiers.number?.(value) ?? value;
    case Type.STRING:
      return modifiers.string?.(value) ?? value;
    case Type.SYMBOL:
      return modifiers.symbol?.(value) ?? value;
    case Type.BIGINT:
      return modifiers.number?.(Number(value)) ?? Number(value);
    case Type.DATE:
      return modifiers.date?.(value) ?? value;
    case Type.ARRAY:
      return value.map((element: any) => deepModify(element, modifiers));
    case Type.OBJECT:
      return Object.entries(value).reduce((obj, [key, value]) => ({
        ...obj,
        [modifiers.key?.(key) ?? key]: deepModify(value, modifiers),
      }), {});
    case Type.FUNCTION:
      return value;
  }
}
