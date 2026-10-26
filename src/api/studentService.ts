import {Student} from '../types';
import {request} from './client';

/** De bai chi dung mot ho so sinh vien duy nhat. */
export const STUDENT_ID = 1;

export function getById(id: number = STUDENT_ID): Promise<Student> {
  return request<Student>('GET', `/students/${id}`);
}

export function update(
  id: number,
  data: Partial<Student>,
): Promise<Student> {
  return request<Student>('PATCH', `/students/${id}`, data);
}
