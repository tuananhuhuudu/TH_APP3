import {useCallback, useEffect, useRef, useState} from 'react';
import {getCache, setCache} from '../storage/cache';
import {ApiError} from '../types';
import useNetworkStatus from './useNetworkStatus';

export type CachedQueryResult<T> = {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
  refreshing: boolean;
  lastUpdated: string | null;
  refresh: () => Promise<void>;
  /** Cap nhat du lieu ngay tai cho, dung cho optimistic update. */
  setData: (updater: (prev: T | null) => T | null) => void;
};

/**
 * Chien luoc "cache truoc, mang sau":
 * hien du lieu trong cache ngay lap tuc, sau do goi API de lam moi neu co mang.
 */
export default function useCachedQuery<T>(
  key: string,
  fetcher: () => Promise<T>,
): CachedQueryResult<T> {
  const [data, setDataState] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const {isOnline} = useNetworkStatus();
  const mounted = useRef(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const load = useCallback(
    async (mode: 'initial' | 'refresh') => {
      if (mode === 'refresh') {
        setRefreshing(true);
      }

      if (mode === 'initial') {
        const cached = await getCache<T>(key);
        if (cached && mounted.current) {
          setDataState(cached.data);
          setLastUpdated(cached.savedAt);
          setLoading(false);
        }
      }

      try {
        const fresh = await fetcherRef.current();
        if (!mounted.current) {
          return;
        }
        setDataState(fresh);
        setError(null);
        await setCache(key, fresh);
        const saved = await getCache<T>(key);
        if (mounted.current) {
          setLastUpdated(saved?.savedAt ?? new Date().toISOString());
        }
      } catch (e) {
        if (!mounted.current) {
          return;
        }
        const cached = await getCache<T>(key);
        if (cached) {
          setDataState(cached.data);
          setLastUpdated(cached.savedAt);
          setError(null);
        } else {
          setError(e as ApiError);
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [key],
  );

  useEffect(() => {
    load('initial');
  }, [load]);

  const prevOnline = useRef(isOnline);
  useEffect(() => {
    if (!prevOnline.current && isOnline) {
      load('refresh');
    }
    prevOnline.current = isOnline;
  }, [isOnline, load]);

  const refresh = useCallback(async () => {
    await load('refresh');
  }, [load]);

  const setData = useCallback(
    (updater: (prev: T | null) => T | null) => {
      setDataState(prev => {
        const next = updater(prev);
        if (next !== null) {
          setCache(key, next);
        }
        return next;
      });
    },
    [key],
  );

  return {data, loading, error, refreshing, lastUpdated, refresh, setData};
}
