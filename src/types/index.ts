/** Kieu du lieu dung chung, khop voi cac tap du lieu trong db.json. */

export type Student = {
  id: number;
  studentCode: string;
  fullName: string;
  className: string;
  major: string;
  email: string;
  phone: string;
  updatedAt: string;
};

export type Course = {
  id: number;
  code: string;
  name: string;
  credits: number;
  lecturer: string;
  description: string;
  semester: string;
};

export type ClassSession = {
  id: number;
  courseId: number;
  /** 2 = Thu 2 ... 8 = Chu nhat. */
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room: string;
  note: string;
  /** Co khi goi kem _expand=course. */
  course?: Course;
};

export type AssignmentStatus = 'todo' | 'done';

export type Assignment = {
  id: number | string;
  courseId: number;
  title: string;
  description: string;
  /** Chuan ISO 8601. */
  dueDate: string;
  status: AssignmentStatus;
  updatedAt: string;
  course?: Course;
};

export type Grade = {
  id: number;
  courseId: number;
  semester: string;
  attendance: number;
  midterm: number;
  final: number;
  total: number;
  letter: string;
  course?: Course;
};

/** Loi da chuan hoa tu tang api/client. */
export type ApiErrorType = 'network' | 'timeout' | 'http';

export type ApiError = {
  type: ApiErrorType;
  status: number | null;
  message: string;
};

/** Mot thao tac nam trong hang doi cho dong bo. */
export type OutboxAction = {
  id: string;
  method: 'POST' | 'PATCH';
  url: string;
  body: unknown;
  createdAt: string;
  /** Dung de doi chieu xung dot theo updatedAt. */
  baseUpdatedAt?: string;
};
