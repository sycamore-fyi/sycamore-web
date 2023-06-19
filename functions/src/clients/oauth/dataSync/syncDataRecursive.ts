interface SyncDataArgs<T> {
  fetchFn: (cursor?: string) => Promise<{ data: T[], cursor?: string }>,
  saveFn: (data: T[]) => Promise<void>,
  cursor?: string
}

export async function syncDataRecursive<T>({ fetchFn, saveFn, cursor }: SyncDataArgs<T>) {
  const { data, cursor: nextCursor } = await fetchFn(cursor);

  await Promise.all([
    saveFn(data),
    syncDataRecursive({ fetchFn, saveFn, cursor: nextCursor }),
  ]);
}
