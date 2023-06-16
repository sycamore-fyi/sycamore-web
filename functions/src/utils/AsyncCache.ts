export class AsyncCache<T> {
  private lastFetchedAt = new Date(0);
  private getter: () => Promise<T>;
  private value: T | null = null;
  private cacheInvalidationIntervalMs: number;

  retrieveValue = async (): Promise<T> => {
    const now = new Date();
    const timeSinceLastFetch = now.getTime() - this.lastFetchedAt.getTime();

    if (timeSinceLastFetch < this.cacheInvalidationIntervalMs) {
      return this.value!;
    }

    const newValue = await this.getter();
    this.value = newValue;
    this.lastFetchedAt = now;

    return newValue;
  };

  constructor(
    getter: () => Promise<T>, // How to retrieve a fresh value
    cacheInvalidationIntervalMs: number // How long to cache the value for
  ) {
    this.getter = getter;
    this.cacheInvalidationIntervalMs = cacheInvalidationIntervalMs;
  }
}
