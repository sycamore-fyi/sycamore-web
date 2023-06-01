export function sorter<T>(getValue: (v: T) => number, ascending = true) {
  return (i1: T, i2: T) => {
    if (ascending) {
      return getValue(i1) - getValue(i2);
    } else {
      return getValue(i2) - getValue(i1);
    }
  };
}

export const nsorter = (ascending = true) => sorter<number>((v) => v, ascending);
