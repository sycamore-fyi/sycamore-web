import { sleep } from "./sleep";

const baseDelayMs = 1000;
const exponent = 2;

export async function retry<Result>(
  fn: () => Promise<Result>,
  retryData: (error: any) => { isRetryable: boolean, retryAfterMs?: number } = () => ({ isRetryable: true }),
  maxAttempts = 5,
  attemptCount = 0,
): Promise<Result> {
  try {
    return await fn();
  } catch (err) {
    const { isRetryable, retryAfterMs } = retryData(err);
    const shouldRetry = isRetryable && attemptCount < maxAttempts;
    if (!shouldRetry) throw err;
    const delayMs = retryAfterMs ?? (baseDelayMs * Math.pow(exponent, attemptCount));
    await sleep(delayMs);
    return retry(fn, retryData, attemptCount + 1, maxAttempts);
  }
}

export const retryIfTransientApiError = <Result>(
  fn: () => Promise<Result>,
  maxAttempts = 5,
  attemptCount = 0,
) => {
  return retry(
    fn,
    (error: any) => ({ isRetryable: error.status === 429 || error.status >= 500 }),
    maxAttempts,
    attemptCount
  );
};
