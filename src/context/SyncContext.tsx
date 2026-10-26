import React, {createContext, useContext, useEffect, useMemo, useRef} from 'react';
import {Alert} from 'react-native';
import useNetworkStatus from '../hooks/useNetworkStatus';
import useOutboxSync, {SyncResult} from '../hooks/useOutboxSync';

type SyncContextValue = {
  isOnline: boolean;
  pendingCount: number;
  pendingIds: string[];
  syncing: boolean;
  syncNow: () => Promise<SyncResult>;
  refreshPending: () => Promise<void>;
};

const SyncContext = createContext<SyncContextValue | undefined>(undefined);

export function SyncProvider({children}: {children: React.ReactNode}) {
  const {isOnline} = useNetworkStatus();
  const {pendingCount, pendingIds, syncing, lastResult, syncNow, refreshPending} =
    useOutboxSync();

  const shownResult = useRef<SyncResult | null>(null);
  useEffect(() => {
    if (!lastResult || lastResult === shownResult.current) {
      return;
    }
    shownResult.current = lastResult;

    const {synced, conflicts, failed} = lastResult;
    if (synced === 0 && conflicts === 0 && failed === 0) {
      return;
    }

    const lines: string[] = [];
    if (synced > 0) {
      lines.push(`Da dong bo ${synced} thay doi.`);
    }
    if (conflicts > 0) {
      lines.push(
        `${conflicts} thay doi bi bo qua vi du lieu tren may chu moi hon.`,
      );
    }
    if (failed > 0) {
      lines.push(`${failed} thay doi chua gui duoc, se thu lai sau.`);
    }
    Alert.alert('Dong bo du lieu', lines.join('\n'));
  }, [lastResult]);

  const value = useMemo<SyncContextValue>(
    () => ({
      isOnline,
      pendingCount,
      pendingIds,
      syncing,
      syncNow,
      refreshPending,
    }),
    [isOnline, pendingCount, pendingIds, syncing, syncNow, refreshPending],
  );

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
}

export function useSync(): SyncContextValue {
  const context = useContext(SyncContext);
  if (!context) {
    throw new Error('useSync phai duoc dung ben trong SyncProvider');
  }
  return context;
}
