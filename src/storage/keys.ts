/** Ten khoa dung trong AsyncStorage. Khong viet chuoi truc tiep o noi khac. */

const PREFIX = '@study_manager';

export const CACHE_KEYS = {
  student: `${PREFIX}:cache:student`,
  courses: `${PREFIX}:cache:courses`,
  sessions: `${PREFIX}:cache:sessions`,
  assignments: `${PREFIX}:cache:assignments`,
  grades: `${PREFIX}:cache:grades`,
};

/** Khoa cache cho man hinh chi tiet, dung chung mot tien to. */
export function detailKey(resource: string, id: number | string): string {
  return `${PREFIX}:cache:${resource}:${id}`;
}

export const OUTBOX_KEY = `${PREFIX}:outbox`;
