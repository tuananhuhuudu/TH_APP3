import {Course, Grade} from '../types';

/**
 * Quy doi diem he 10 sang he 4 theo bang quy dinh trong de bai.
 * 8,5-10 => A 4,0 | 8,0-8,4 => B+ 3,5 | 7,0-7,9 => B 3,0 | 6,5-6,9 => C+ 2,5
 * 5,5-6,4 => C 2,0 | 5,0-5,4 => D+ 1,5 | 4,0-4,9 => D 1,0 | duoi 4,0 => F 0
 */
export function toScale4(score10: number): number {
  if (score10 >= 8.5) {
    return 4.0;
  }
  if (score10 >= 8.0) {
    return 3.5;
  }
  if (score10 >= 7.0) {
    return 3.0;
  }
  if (score10 >= 6.5) {
    return 2.5;
  }
  if (score10 >= 5.5) {
    return 2.0;
  }
  if (score10 >= 5.0) {
    return 1.5;
  }
  if (score10 >= 4.0) {
    return 1.0;
  }
  return 0;
}

/** Diem chu tuong ung voi diem he 10. */
export function toLetter(score10: number): string {
  if (score10 >= 8.5) {
    return 'A';
  }
  if (score10 >= 8.0) {
    return 'B+';
  }
  if (score10 >= 7.0) {
    return 'B';
  }
  if (score10 >= 6.5) {
    return 'C+';
  }
  if (score10 >= 5.5) {
    return 'C';
  }
  if (score10 >= 5.0) {
    return 'D+';
  }
  if (score10 >= 4.0) {
    return 'D';
  }
  return 'F';
}

/** Diem tong ket: 10% chuyen can + 30% giua ky + 60% cuoi ky. */
export function calcTotal(
  attendance: number,
  midterm: number,
  final: number,
): number {
  return Number((attendance * 0.1 + midterm * 0.3 + final * 0.6).toFixed(2));
}

function findCourse(courses: Course[], courseId: number): Course | undefined {
  return courses.find(c => c.id === courseId);
}

/**
 * GPA he 4 co trong so theo so tin chi.
 * Mon diem F khong tinh vao tin chi tich luy nen cung khong vao mau so.
 */
export function calcGpa(
  grades: Grade[],
  courses: Course[],
): {gpa: number; totalCredits: number} {
  let points = 0;
  let credits = 0;

  grades.forEach(grade => {
    const course = grade.course ?? findCourse(courses, grade.courseId);
    if (!course) {
      return;
    }
    const scale4 = toScale4(grade.total);
    if (scale4 === 0) {
      return;
    }
    points += scale4 * course.credits;
    credits += course.credits;
  });

  return {
    gpa: credits === 0 ? 0 : Number((points / credits).toFixed(2)),
    totalCredits: credits,
  };
}

/** Xep loai hoc luc theo GPA he 4. */
export function getClassification(gpa: number): string {
  if (gpa >= 3.6) {
    return 'Xuat sac';
  }
  if (gpa >= 3.2) {
    return 'Gioi';
  }
  if (gpa >= 2.5) {
    return 'Kha';
  }
  if (gpa >= 2.0) {
    return 'Trung binh';
  }
  return 'Yeu';
}
