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

/**
 * Minimal typed `fetch` wrapper. Every remote call in the app goes through here
 * so timeout, status and parse failures are reported the same way.
 */
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
    // A caller-initiated abort (screen unmounted, query cancelled) is not a
    // failure to report — let React Query discard it as a cancellation.
    if (signal?.aborted) throw error;
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError('The request timed out. Please check your connection.');
    }
    throw new ApiError('Unable to reach the server. Please check your connection.');
  } finally {
    clearTimeout(timeout);
  }
}
