import {Grade} from '../types';
import {request} from './client';

export function getAll(): Promise<Grade[]> {
  return request<Grade[]>('GET', '/grades?_expand=course');
}

export function getById(id: number): Promise<Grade> {
  return request<Grade>('GET', `/grades/${id}?_expand=course`);
}
