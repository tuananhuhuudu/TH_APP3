import {useCallback, useEffect, useRef, useState} from 'react';
import {request} from '../api/client';
import * as outbox from '../storage/outbox';
import {OutboxAction} from '../types';
import useNetworkStatus from './useNetworkStatus';

export type SyncResult = {
  synced: number;
  failed: number;
  conflicts: number;
};

export type OutboxSyncValue = {
  pendingCount: number;
  pendingIds: string[];
  syncing: boolean;
  lastResult: SyncResult | null;
  syncNow: () => Promise<SyncResult>;
  refreshPending: () => Promise<void>;
};

/** Lay updatedAt tu ban ghi tren server de so sanh xung dot. */
async function fetchServerUpdatedAt(url: string): Promise<string | null> {
  try {
    const record = await request<{updatedAt?: string}>('GET', url);
    return record?.updatedAt ?? null;
  } catch {
    return null;
  }
}

/**
 * Tu dong bo hang doi khi co mang tro lai.
 *
 * Xu ly xung dot (muc B5): truoc khi gui PATCH, so sanh updatedAt tren server
 * voi updatedAt luc nguoi dung thao tac offline. Neu server moi hon thi bo qua
 * thao tac offline va uu tien du lieu server.
 */
export default function useOutboxSync(): OutboxSyncValue {
  const {isOnline} = useNetworkStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingIds, setPendingIds] = useState<string[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastResult, setLastResult] = useState<SyncResult | null>(null);
  const running = useRef(false);

  const refreshPending = useCallback(async () => {
    const actions = await outbox.getAll();
    setPendingCount(actions.length);
    setPendingIds(actions.map(a => String(targetIdOf(a))));
  }, []);

  useEffect(() => {
    refreshPending();
  }, [refreshPending]);

  const syncNow = useCallback(async (): Promise<SyncResult> => {
    const result: SyncResult = {synced: 0, failed: 0, conflicts: 0};

    if (running.current) {
      return result;
    }
    running.current = true;
    setSyncing(true);

    try {
      const actions = await outbox.getAll();

      for (const action of actions) {
        try {
          if (action.method === 'PATCH' && action.baseUpdatedAt) {
            const serverUpdatedAt = await fetchServerUpdatedAt(action.url);
            if (
              serverUpdatedAt &&
              new Date(serverUpdatedAt).getTime() >
                new Date(action.baseUpdatedAt).getTime()
            ) {
              await outbox.remove(action.id);
              result.conflicts += 1;
              continue;
            }
          }

          await request(action.method, action.url, action.body);
          await outbox.remove(action.id);
          result.synced += 1;
        } catch {
          result.failed += 1;
        }
      }
    } finally {
      await refreshPending();
      running.current = false;
      setSyncing(false);
      setLastResult(result);
    }

    return result;
  }, [refreshPending]);

  const prevOnline = useRef(isOnline);
  useEffect(() => {
    if (!prevOnline.current && isOnline) {
      syncNow();
    }
    prevOnline.current = isOnline;
  }, [isOnline, syncNow]);

  return {
    pendingCount,
    pendingIds,
    syncing,
    lastResult,
    syncNow,
    refreshPending,
  };
}

/** Suy ra id ban ghi tu url cua thao tac, dung de danh dau "Chua dong bo". */
function targetIdOf(action: OutboxAction): string {
  if (action.method === 'POST') {
    const body = action.body as {id?: string | number} | undefined;
    return String(body?.id ?? '');
  }
  const parts = action.url.split('/');
  return parts[parts.length - 1] ?? '';
}
