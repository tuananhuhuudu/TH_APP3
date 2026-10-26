import {Course, Grade} from '../src/types';
import {daysLeft, formatDate, formatDateTime, getDayLabel} from '../src/utils/date';
import {calcGpa, calcTotal, toLetter, toScale4} from '../src/utils/gpa';
import {
  isFutureDate,
  isValidEmail,
  isValidPhone,
  parseDateInput,
} from '../src/utils/validators';

describe('utils/gpa', () => {
  test('toScale4 dung bang quy doi cua de bai', () => {
    expect(toScale4(9.0)).toBe(4.0);
    expect(toScale4(8.5)).toBe(4.0);
    expect(toScale4(8.4)).toBe(3.5);
    expect(toScale4(8.0)).toBe(3.5);
    expect(toScale4(7.9)).toBe(3.0);
    expect(toScale4(7.0)).toBe(3.0);
    expect(toScale4(6.9)).toBe(2.5);
    expect(toScale4(6.5)).toBe(2.5);
    expect(toScale4(6.4)).toBe(2.0);
    expect(toScale4(5.5)).toBe(2.0);
    expect(toScale4(5.4)).toBe(1.5);
    expect(toScale4(5.0)).toBe(1.5);
    expect(toScale4(4.9)).toBe(1.0);
    expect(toScale4(4.0)).toBe(1.0);
    expect(toScale4(3.9)).toBe(0);
  });

  test('toLetter khop voi bang diem chu', () => {
    expect(toLetter(8.85)).toBe('A');
    expect(toLetter(8.4)).toBe('B+');
    expect(toLetter(7.55)).toBe('B');
    expect(toLetter(6.95)).toBe('C+');
    expect(toLetter(3.0)).toBe('F');
  });

  test('calcTotal theo ty le 10/30/60', () => {
    expect(calcTotal(9, 8.5, 9)).toBe(8.85);
    expect(calcTotal(10, 9, 8.5)).toBe(8.8);
  });

  test('calcGpa co trong so tin chi, bo qua mon diem F', () => {
    const courses: Course[] = [
      {
        id: 1,
        code: 'A',
        name: 'Mon A',
        credits: 3,
        lecturer: '',
        description: '',
        semester: 'HK1',
      },
      {
        id: 2,
        code: 'B',
        name: 'Mon B',
        credits: 2,
        lecturer: '',
        description: '',
        semester: 'HK1',
      },
      {
        id: 3,
        code: 'C',
        name: 'Mon C',
        credits: 4,
        lecturer: '',
        description: '',
        semester: 'HK1',
      },
    ];
    const grades: Grade[] = [
      {
        id: 1,
        courseId: 1,
        semester: 'HK1',
        attendance: 9,
        midterm: 9,
        final: 9,
        total: 9.0,
        letter: 'A',
      },
      {
        id: 2,
        courseId: 2,
        semester: 'HK1',
        attendance: 7,
        midterm: 7,
        final: 7,
        total: 7.0,
        letter: 'B',
      },
      {
        id: 3,
        courseId: 3,
        semester: 'HK1',
        attendance: 3,
        midterm: 3,
        final: 3,
        total: 3.0,
        letter: 'F',
      },
    ];

    const {gpa, totalCredits} = calcGpa(grades, courses);
    // (4.0*3 + 3.0*2) / 5 = 3.6; mon F khong tinh tin chi.
    expect(gpa).toBe(3.6);
    expect(totalCredits).toBe(5);
  });

  test('calcGpa tra ve 0 khi khong co du lieu', () => {
    expect(calcGpa([], [])).toEqual({gpa: 0, totalCredits: 0});
  });
});

describe('utils/date', () => {
  test('formatDate ra dd/MM/yyyy', () => {
    expect(formatDate('2026-11-09T23:59:00Z')).toMatch(
      /^\d{2}\/\d{2}\/\d{4}$/,
    );
    expect(formatDate('')).toBe('');
    expect(formatDate('khong-hop-le')).toBe('');
  });

  test('formatDateTime ra HH:mm, dd/MM/yyyy', () => {
    expect(formatDateTime('2026-10-26T08:00:00Z')).toMatch(
      /^\d{2}:\d{2}, \d{2}\/\d{2}\/\d{4}$/,
    );
    expect(formatDateTime(undefined)).toBe('');
  });

  test('daysLeft am khi da qua han', () => {
    const past = new Date(Date.now() - 3 * 86400000).toISOString();
    expect(daysLeft(past)).toBeLessThan(0);
  });

  test('getDayLabel theo quy uoc 2..8', () => {
    expect(getDayLabel(2)).toBe('Thu 2');
    expect(getDayLabel(8)).toBe('Chu nhat');
    expect(getDayLabel(99)).toBe('Khong ro');
  });
});

describe('utils/validators', () => {
  test('isValidEmail', () => {
    expect(isValidEmail('a@b.com')).toBe(true);
    expect(isValidEmail('sai-email')).toBe(false);
    expect(isValidEmail('')).toBe(false);
  });

  test('isValidPhone can 10 so bat dau bang 0', () => {
    expect(isValidPhone('0912345678')).toBe(true);
    expect(isValidPhone('912345678')).toBe(false);
    expect(isValidPhone('09123456789')).toBe(false);
  });

  test('parseDateInput nhan dd/MM/yyyy', () => {
    expect(parseDateInput('31/12/2026')).not.toBeNull();
    expect(parseDateInput('32/12/2026')).toBeNull();
    expect(parseDateInput('2026-12-31')).toBeNull();
  });

  test('isFutureDate chan han nop o qua khu', () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    const future = new Date(Date.now() + 86400000).toISOString();
    expect(isFutureDate(past)).toBe(false);
    expect(isFutureDate(future)).toBe(true);
  });
});
