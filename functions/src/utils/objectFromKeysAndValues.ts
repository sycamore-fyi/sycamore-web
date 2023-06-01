import { logger } from "firebase-functions/v2";

export function objectFromKeysAndValues<T>(
  keys: string[],
  values: T[]
): Record<string, T> {
  if (keys.length !== values.length) {
    logger.info("keys and values aren't the same length", {
      keys: keys.length,
      values: values.length,
    });

    throw new Error("zip: keys and values must be same length");
  }

  return keys.reduce((zipped, key, index) => ({
    ...zipped,
    [key]: values[index],
  }), {});
}
