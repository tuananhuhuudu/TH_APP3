import {BASE_URL, TIMEOUT} from '../config';
import {ApiError} from '../types';

/**
 * Ham goi API dung chung cho toan bo ung dung.
 * Tang nay khong duoc dung AsyncStorage, Context hay React.
 */

function buildError(
  type: ApiError['type'],
  status: number | null,
  message: string,
): ApiError {
  return {type, status, message};
}

function messageForStatus(status: number): string {
  if (status === 404) {
    return 'Khong tim thay du lieu yeu cau.';
  }
  if (status === 400) {
    return 'Du lieu gui len khong hop le.';
  }
  if (status >= 500) {
    return 'May chu dang gap su co. Vui long thu lai sau.';
  }
  return `Yeu cau that bai (ma loi ${status}).`;
}

export async function request<T>(
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE',
  url: string,
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT);

  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: controller.signal,
    });

    if (!response.ok) {
      throw buildError('http', response.status, messageForStatus(response.status));
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    if (error && typeof error === 'object' && 'type' in error) {
      throw error as ApiError;
    }

    const name = (error as {name?: string})?.name;
    if (name === 'AbortError') {
      throw buildError(
        'timeout',
        null,
        'May chu phan hoi qua lau. Vui long thu lai.',
      );
    }

    throw buildError(
      'network',
      null,
      'Khong ket noi duoc may chu. Kiem tra mang hoac dia chi server.',
    );
  } finally {
    clearTimeout(timer);
  }
}
