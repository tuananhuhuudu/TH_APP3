import {Assignment, Course, GradeItem} from '../types';

export const WEEKDAYS = [
  {value: 2, label: 'Thứ 2'},
  {value: 3, label: 'Thứ 3'},
  {value: 4, label: 'Thứ 4'},
  {value: 5, label: 'Thứ 5'},
  {value: 6, label: 'Thứ 6'},
  {value: 7, label: 'Thứ 7'},
  {value: 8, label: 'Chủ nhật'},
];

export function getWeekdayLabel(weekday: number): string {
  return WEEKDAYS.find(d => d.value === weekday)?.label ?? 'Không rõ';
}

/** Ngày hiện tại ở dạng yyyy-mm-dd theo giờ địa phương. */
export function todayISO(): string {
  const now = new Date();
  const month = `${now.getMonth() + 1}`.padStart(2, '0');
  const day = `${now.getDate()}`.padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
}

export function formatDate(iso: string): string {
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

/** Số ngày còn lại tới hạn nộp; âm nghĩa là đã quá hạn. */
export function daysUntil(iso: string): number {
  const target = new Date(`${iso}T00:00:00`);
  const today = new Date(`${todayISO()}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function getDueLabel(assignment: Assignment): string {
  if (assignment.done) {
    return 'Đã hoàn thành';
  }
  const days = daysUntil(assignment.dueDate);
  if (days < 0) {
    return `Quá hạn ${Math.abs(days)} ngày`;
  }
  if (days === 0) {
    return 'Hạn hôm nay';
  }
  if (days === 1) {
    return 'Còn 1 ngày';
  }
  return `Còn ${days} ngày`;
}

/**
 * Giá trị hiển thị cho các trường chưa có dữ liệu (giảng viên, phòng học...).
 * Trang lớp tín chỉ không cung cấp sẵn nên chuỗi rỗng là trường hợp bình thường.
 */
export function orDash(value?: string): string {
  return value && value.trim() ? value : '--';
}

export function findCourse(
  courses: Course[],
  courseId: string,
): Course | undefined {
  return courses.find(c => c.id === courseId);
}

export function getCourseName(courses: Course[], courseId: string): string {
  return findCourse(courses, courseId)?.name ?? 'Không xác định';
}

/** Điểm trung bình tích lũy theo hệ 10, trọng số là số tín chỉ. */
export function calculateGPA(grades: GradeItem[], courses: Course[]): number {
  let totalPoints = 0;
  let totalCredits = 0;

  grades.forEach(grade => {
    const course = findCourse(courses, grade.courseId);
    if (!course) {
      return;
    }
    totalPoints += grade.total * course.credits;
    totalCredits += course.credits;
  });

  return totalCredits === 0 ? 0 : totalPoints / totalCredits;
}

export function getClassification(gpa: number): string {
  if (gpa >= 9) {
    return 'Xuất sắc';
  }
  if (gpa >= 8) {
    return 'Giỏi';
  }
  if (gpa >= 7) {
    return 'Khá';
  }
  if (gpa >= 5) {
    return 'Trung bình';
  }
  return 'Yếu';
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone: string): boolean {
  return /^0\d{9}$/.test(phone.trim());
}
