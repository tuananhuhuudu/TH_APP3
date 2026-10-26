/** Dinh dang va tinh toan ngay gio. Moi noi hien thi ngay deu goi qua day. */

const WEEKDAY_LABELS: Record<number, string> = {
  2: 'Thu 2',
  3: 'Thu 3',
  4: 'Thu 4',
  5: 'Thu 5',
  6: 'Thu 6',
  7: 'Thu 7',
  8: 'Chu nhat',
};

function pad(value: number): string {
  return `${value}`.padStart(2, '0');
}

/** Tra ve dd/MM/yyyy; chuoi rong neu du lieu khong hop le. */
export function formatDate(iso?: string): string {
  if (!iso) {
    return '';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

/** Tra ve HH:mm, dd/MM/yyyy. */
export function formatDateTime(iso?: string): string {
  if (!iso) {
    return '';
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return '';
  }
  return `${pad(d.getHours())}:${pad(d.getMinutes())}, ${formatDate(iso)}`;
}

/** Cat phan gio cua chuoi ISO, tra ve moc 0h de so sanh theo ngay. */
function startOfDay(date: Date): number {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** So ngay con lai toi han; am nghia la da qua han. */
export function daysLeft(iso?: string): number {
  if (!iso) {
    return 0;
  }
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) {
    return 0;
  }
  const diff = startOfDay(target) - startOfDay(new Date());
  return Math.round(diff / 86400000);
}

/** Bai tap da qua han hay chua, so theo thoi diem chinh xac. */
export function isOverdue(iso?: string): boolean {
  if (!iso) {
    return false;
  }
  const target = new Date(iso);
  if (Number.isNaN(target.getTime())) {
    return false;
  }
  return target.getTime() < Date.now();
}

/** Nhan mo ta han nop de hien tren the bai tap. */
export function getDueLabel(iso?: string): string {
  if (!iso) {
    return '';
  }
  const days = daysLeft(iso);
  if (days < 0) {
    return `Qua han ${Math.abs(days)} ngay`;
  }
  if (days === 0) {
    return 'Han hom nay';
  }
  if (days === 1) {
    return 'Con 1 ngay';
  }
  return `Con ${days} ngay`;
}

/** Nhan Thu 2..Chu nhat tu gia tri dayOfWeek cua db.json. */
export function getDayLabel(dayOfWeek: number): string {
  return WEEKDAY_LABELS[dayOfWeek] ?? 'Khong ro';
}

/** dayOfWeek (2..8) cua ngay hom nay. */
export function getTodayDayOfWeek(): number {
  const day = new Date().getDay();
  return day === 0 ? 8 : day + 1;
}

/** Danh sach thu trong tuan, dung cho DaySelector. */
export function getWeekDays(): {value: number; label: string}[] {
  return Object.keys(WEEKDAY_LABELS).map(key => ({
    value: Number(key),
    label: WEEKDAY_LABELS[Number(key)],
  }));
}

/** Thoi diem hien tai theo chuan ISO, dung cho updatedAt. */
export function nowISO(): string {
  return new Date().toISOString();
}
