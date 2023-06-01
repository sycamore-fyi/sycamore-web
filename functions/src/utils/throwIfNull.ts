export function throwIfNull<T>(v?: T) {
  if (!v) {
    throw new Error("value is null");
  }
  return v;
}
