import { isHttpError } from 'tosslib';

export function isAuthError(error: unknown): boolean {
  if (isHttpError(error)) {
    const status = error.status;
    return status === 401 || status === 403;
  }
  return false;
}

export function isServerError(error: unknown): boolean {
  if (isHttpError(error)) {
    return error.status >= 500;
  }
  return false;
}

export function isCriticalError(error: unknown): boolean {
  return isAuthError(error) || isServerError(error);
}

export function isNetworkError(error: unknown): boolean {
  // fetch 실패 (서버 도달 전 실패)
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return true;
  }

  // AbortError (타임아웃)
  if (error instanceof DOMException && error.name === 'AbortError') {
    return true;
  }

  return false;
}

// 여기는 서버 개발자랑 이야기 해야함. (status code들은 예시)
export function isRetryableHttpError(error: unknown): boolean {
  if (isHttpError(error)) {
    const status = error.status;

    // 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout, 429 Too Many Requests
    return status === 502 || status === 503 || status === 504 || status === 429;
  }
  return false;
}

export function isRetryableError(error: unknown): boolean {
  return isNetworkError(error) || isRetryableHttpError(error);
}
