export type Course = {
  id: string;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  semester: string;
  description: string;
};

export type ClassSession = {
  id: string;
  courseId: string;
  weekday: number; // 2..8 ứng với Thứ 2 .. Chủ nhật
  startTime: string;
  endTime: string;
  room: string;
  type: 'Lý thuyết' | 'Thực hành';
};

export type Assignment = {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string; // ISO yyyy-mm-dd
  done: boolean;
};

export type GradeItem = {
  id: string;
  courseId: string;
  midterm: number;
  final: number;
  total: number;
  letter: string;
};

export type StudentProfile = {
  studentId: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
};
