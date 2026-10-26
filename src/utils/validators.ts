/** Kiem tra du lieu nhap tu form. */

export function isNotEmpty(value?: string): boolean {
  return !!value && value.trim().length > 0;
}

export function isValidEmail(email?: string): boolean {
  if (!email) {
    return false;
  }
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function isValidPhone(phone?: string): boolean {
  if (!phone) {
    return false;
  }
  return /^0\d{9}$/.test(phone.trim());
}

/** Han nop khong duoc o qua khu. */
export function isFutureDate(iso?: string): boolean {
  if (!iso) {
    return false;
  }
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) {
    return false;
  }
  return d.getTime() >= Date.now();
}

/** Nhan ngay dang dd/MM/yyyy roi doi sang ISO; tra ve null neu sai dinh dang. */
export function parseDateInput(input?: string): string | null {
  if (!input) {
    return null;
  }
  const match = input.trim().match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!match) {
    return null;
  }
  const [, dd, mm, yyyy] = match;
  const day = Number(dd);
  const month = Number(mm);
  const year = Number(yyyy);
  const d = new Date(year, month - 1, day, 23, 59, 0);
  if (
    d.getDate() !== day ||
    d.getMonth() !== month - 1 ||
    d.getFullYear() !== year
  ) {
    return null;
  }
  return d.toISOString();
}

export type FormErrors = Record<string, string | undefined>;

/** Form hop le khi khong con thong bao loi nao. */
export function hasNoError(errors: FormErrors): boolean {
  return Object.values(errors).every(e => !e);
}
