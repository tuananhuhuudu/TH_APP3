import NetInfo from '@react-native-community/netinfo';
import {useEffect, useState} from 'react';

/** Theo doi trang thai mang. Tra ve { isOnline }. */
export default function useNetworkStatus(): {isOnline: boolean} {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      const reachable =
        state.isInternetReachable === null ? true : state.isInternetReachable;
      setIsOnline(!!state.isConnected && reachable);
    });

    NetInfo.fetch().then(state => {
      const reachable =
        state.isInternetReachable === null ? true : state.isInternetReachable;
      setIsOnline(!!state.isConnected && reachable);
    });

    return unsubscribe;
  }, []);

  return {isOnline};
}
