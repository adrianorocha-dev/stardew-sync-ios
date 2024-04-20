interface PromiseRejectedResult {
  status: "rejected";
  reason: unknown;
}

function isFulfilled<T>(
  result: PromiseSettledResult<T>,
): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

function isRejected<T>(
  result: PromiseSettledResult<T>,
): result is PromiseRejectedResult {
  return result.status === "rejected";
}

export async function betterPromiseSettle<T = unknown>(promises: Promise<T>[]) {
  const results = await Promise.allSettled(promises);

  const fulfilled = results.filter(isFulfilled);
  const rejected = results.filter(isRejected);

  return {
    fulfilled,
    rejected,
  };
}
