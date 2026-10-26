/**
 * Cau hinh chung cua ung dung.
 *
 * Doi BASE_URL theo moi truong chay:
 * - May ao Android: http://10.0.2.2:3000
 * - Dien thoai that cung Wi-Fi: http://<IP-LAN-may-tinh>:3000
 */
import {Platform} from 'react-native';

const LAN_IP = '192.168.1.10';

export const BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3000',
  ios: `http://${LAN_IP}:3000`,
  default: `http://${LAN_IP}:3000`,
}) as string;

/** Thoi gian toi da cho mot request, tinh bang mili giay. */
export const TIMEOUT = 10000;

/** Cache qua han sau khoang thoi gian nay thi uu tien goi lai API. */
export const CACHE_TTL = 5 * 60 * 1000;
