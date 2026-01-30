/**
 * Error handling utilities for network requests and general error management
 */

export interface RetryOptions {
  maxRetries?: number;
  delayMs?: number;
  backoff?: boolean;
  onRetry?: (attempt: number, error: Error) => void;
}

/**
 * Retry a function with exponential backoff
 */
export async function retryAsync<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoff = true,
    onRetry,
  } = options;

  let lastError: Error;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt < maxRetries) {
        const delay = backoff ? delayMs * Math.pow(2, attempt) : delayMs;

        if (onRetry) {
          onRetry(attempt + 1, lastError);
        }

        await sleep(delay);
      }
    }
  }

  throw lastError!;
}

/**
 * Sleep for a specified number of milliseconds
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }
  if (error instanceof Error && 'code' in error) {
    const code = (error as Error & { code?: string }).code;
    return code === 'NETWORK_ERROR' || code === 'ECONNREFUSED';
  }
  return false;
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Normalize error to Error instance
 */
export function normalizeError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  if (typeof error === 'string') {
    return new Error(error);
  }
  return new Error('An unknown error occurred');
}

/**
 * Check if device is online
 */
export function isOnline(): boolean {
  return navigator.onLine;
}

/**
 * Wait for network connection
 */
export function waitForConnection(timeoutMs: number = 30000): Promise<void> {
  return new Promise((resolve, reject) => {
    if (isOnline()) {
      resolve();
      return;
    }

    const timeout = setTimeout(() => {
      window.removeEventListener('online', handleOnline);
      reject(new Error('Connection timeout'));
    }, timeoutMs);

    const handleOnline = () => {
      clearTimeout(timeout);
      window.removeEventListener('online', handleOnline);
      resolve();
    };

    window.addEventListener('online', handleOnline);
  });
}

/**
 * Fetch with retry and error handling
 */
export async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retryOptions: RetryOptions = {}
): Promise<Response> {
  return retryAsync(async () => {
    if (!isOnline()) {
      throw new Error('No internet connection');
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response;
  }, retryOptions);
}

/**
 * Handle async errors with user notification
 */
export function handleAsyncError(
  error: unknown,
  fallbackMessage: string = 'Something went wrong'
): string {
  console.error('Async error:', error);

  if (isNetworkError(error)) {
    return 'Network error. Please check your connection and try again.';
  }

  const message = getErrorMessage(error);
  return message || fallbackMessage;
}

/**
 * Create an abort controller with timeout
 */
export function createAbortController(timeoutMs: number): AbortController {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeoutMs);
  return controller;
}
