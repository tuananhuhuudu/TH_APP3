import {Assignment} from '../types';
import {request} from './client';

/** Sap xep theo han nop tang dan ngay tu phia server. */
export function getAll(): Promise<Assignment[]> {
  return request<Assignment[]>(
    'GET',
    '/assignments?_expand=course&_sort=dueDate',
  );
}

export function getById(id: number | string): Promise<Assignment> {
  return request<Assignment>('GET', `/assignments/${id}?_expand=course`);
}

export function update(
  id: number | string,
  data: Partial<Assignment>,
): Promise<Assignment> {
  return request<Assignment>('PATCH', `/assignments/${id}`, data);
}

export function create(data: Partial<Assignment>): Promise<Assignment> {
  return request<Assignment>('POST', '/assignments', data);
}
