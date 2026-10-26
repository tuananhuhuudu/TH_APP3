/* eslint-env jest */
/**
 * Mock cac native module de chay duoc trong moi truong test.
 */
jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock.js'),
);

// AsyncStorage luu trong bo nho khi chay test.
jest.mock('@react-native-async-storage/async-storage', () => {
  let store = {};
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(key => Promise.resolve(store[key] ?? null)),
      setItem: jest.fn((key, value) => {
        store[key] = value;
        return Promise.resolve();
      }),
      removeItem: jest.fn(key => {
        delete store[key];
        return Promise.resolve();
      }),
      clear: jest.fn(() => {
        store = {};
        return Promise.resolve();
      }),
      getAllKeys: jest.fn(() => Promise.resolve(Object.keys(store))),
    },
  };
});
