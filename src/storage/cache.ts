import AsyncStorage from '@react-native-async-storage/async-storage';

/** Moi ban ghi cache luu kem thoi diem luu de hien "Cap nhat lan cuoi". */
export type CacheEntry<T> = {
  data: T;
  savedAt: string;
};

export async function getCache<T>(key: string): Promise<CacheEntry<T> | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed = JSON.parse(raw) as CacheEntry<T>;
    if (!parsed || typeof parsed !== 'object' || !('data' in parsed)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export async function setCache<T>(key: string, data: T): Promise<void> {
  try {
    const entry: CacheEntry<T> = {data, savedAt: new Date().toISOString()};
    await AsyncStorage.setItem(key, JSON.stringify(entry));
  } catch {
  }
}

export async function removeCache(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch {
  }
}
