import { http, isHttpError } from 'tosslib';

const API_BASE_URL = '/api';

function mergeURL(path: string) {
  return `${API_BASE_URL}${path}`;
}

export async function get<T>(url: string): Promise<T> {
  try {
    return await http.get<T>(mergeURL(url));
  } catch (error: unknown) {
    if (isHttpError(error)) {
      console.error(error.message);
    }
    throw error;
  }
}
