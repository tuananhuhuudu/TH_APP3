import {ClassSession} from '../types';
import {request} from './client';

/** Lay kem thong tin mon hoc qua _expand=course. */
export function getAll(): Promise<ClassSession[]> {
  return request<ClassSession[]>('GET', '/sessions?_expand=course');
}

export function getById(id: number): Promise<ClassSession> {
  return request<ClassSession>('GET', `/sessions/${id}?_expand=course`);
}
