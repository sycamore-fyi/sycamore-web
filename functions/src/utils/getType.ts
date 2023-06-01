export enum Type {
  NUMBER = "NUMBER",
  STRING = "STRING",
  NULL = "NULL",
  ARRAY = "ARRAY",
  OBJECT = "OBJECT",
  DATE = "DATE",
  FUNCTION = "FUNCTION",
  BOOLEAN = "BOOLEAN",
  SYMBOL = "SYMBOL",
  BIGINT = "BIGINT"
}

export function getType(value: unknown): Type {
  switch (typeof value) {
    case "undefined":
      return Type.NULL;
    case "string":
      return Type.STRING;
    case "number":
      return Type.NUMBER;
    case "boolean":
      return Type.BOOLEAN;
    case "symbol":
      return Type.SYMBOL;
    case "bigint":
      return Type.BIGINT;
    case "function":
      return Type.FUNCTION;
    case "object":
      if (!value) {
        return Type.NULL;
      } else if (Array.isArray(value)) {
        return Type.ARRAY;
      } else {
        switch (Object.prototype.toString.call(value)) {
          case "[object Date]":
            return Type.DATE;
          default:
            return Type.OBJECT;
        }
      }
  }
}
