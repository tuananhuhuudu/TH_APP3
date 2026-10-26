import AsyncStorage from '@react-native-async-storage/async-storage';
import {OutboxAction} from '../types';
import {OUTBOX_KEY} from './keys';

/**
 * Hang doi thao tac khi offline.
 * Cac thao tac duoc giu dung thu tu them vao de dong bo tuan tu.
 */

export async function getAll(): Promise<OutboxAction[]> {
  try {
    const raw = await AsyncStorage.getItem(OUTBOX_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OutboxAction[]) : [];
  } catch {
    return [];
  }
}

async function save(actions: OutboxAction[]): Promise<void> {
  try {
    await AsyncStorage.setItem(OUTBOX_KEY, JSON.stringify(actions));
  } catch {
  }
}

export async function enqueue(
  action: Omit<OutboxAction, 'id' | 'createdAt'>,
): Promise<OutboxAction> {
  const item: OutboxAction = {
    ...action,
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  };
  const actions = await getAll();
  actions.push(item);
  await save(actions);
  return item;
}

export async function remove(id: string): Promise<void> {
  const actions = await getAll();
  await save(actions.filter(a => a.id !== id));
}

export async function clear(): Promise<void> {
  await save([]);
}

export async function count(): Promise<number> {
  return (await getAll()).length;
}
