const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const TIMEOUT_MS = 10_000;
const RETRY_DELAY_MS = 2_000;
const MAX_RETRIES = 1;

async function fetchWithTimeout(url: string, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function api<T>(path: string): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      if (attempt > 0) {
        await delay(RETRY_DELAY_MS);
      }

      const res = await fetchWithTimeout(`${API_URL}${path}`, TIMEOUT_MS);

      if (!res.ok) {
        throw new Error(
          res.status >= 500
            ? 'The data service encountered an issue. Please try again.'
            : res.status === 404
              ? 'The requested data was not found.'
              : `Request failed (${res.status}).`
        );
      }

      return await res.json();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // If it's an abort (timeout) or network error, retry
      if (lastError.name === 'AbortError') {
        lastError = new Error('Connecting to data service... Request timed out.');
      }

      // Don't retry 4xx client errors
      if (lastError.message.includes('not found') || lastError.message.includes('400')) {
        break;
      }
    }
  }

  // If we exhausted retries, provide a user-friendly message
  if (lastError?.message.includes('fetch') || lastError?.name === 'TypeError') {
    throw new Error('Connecting to data service... Please ensure the API is running.');
  }

  throw lastError ?? new Error('An unexpected error occurred.');
}
