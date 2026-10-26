import {Course} from '../types';
import {request} from './client';

export function getAll(): Promise<Course[]> {
  return request<Course[]>('GET', '/courses');
}

export function getById(id: number): Promise<Course> {
  return request<Course>('GET', `/courses/${id}`);
}
