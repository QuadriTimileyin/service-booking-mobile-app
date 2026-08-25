import { API_BASE_URL, API_TIMEOUT_MS } from '../config/env';

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/** One place for every network call, so timeouts and failures behave the same. */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  signal?.addEventListener('abort', () => controller.abort(), { once: true });

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) {
      throw new ApiError(
        `The server could not complete the request (error ${response.status}).`,
        response.status,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    // The caller cancelled this one, so pass it through instead of reporting it.
    if (signal?.aborted) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('The request timed out. Please check your connection.');
    }
    throw new ApiError('Unable to reach the server. Please check your connection.');
  } finally {
    clearTimeout(timeout);
  }
}
