import { Type, getType } from "./getType";

export const deepEquals = (value1: unknown, value2: unknown): boolean => {
  const values = [value1, value2];
  const [type1, type2] = values.map(getType);

  if (type1 !== type2) return false;

  switch (type1) {
    case Type.NULL: {
      return true;
    }
    case Type.ARRAY: {
      const [arr1, arr2] = values.map((v) => v as unknown[]);
      if (arr1.length !== arr2.length) return false;
      return arr1.every((element, index) => deepEquals(element, arr2[index]));
    }
    case Type.BIGINT, Type.BOOLEAN, Type.NUMBER, Type.STRING, Type.SYMBOL: {
      return value1 === value2;
    }
    case Type.DATE: {
      const [epoch1, epoch2] = values.map((v) => (v as Date).getTime());
      return epoch1 === epoch2;
    }
    case Type.OBJECT: {
      const [keys1, keys2] = values.map((v) => Object.keys(v as object));
      if (!deepEquals(keys1, keys2)) return false;

      return Object.entries(value1 as object).every(([key, value]) => {
        return deepEquals(value, (value2 as { [key: string]: unknown })[key]);
      });
    }
  }

  return true;
};
