/**
 * Safe Storage Helper
 * Wraps localStorage access with try/catch and provides an in-memory fallback
 */

const memoryStore = new Map();
let storageAvailable;

const isLocalStorageAvailable = () => {
  if (storageAvailable !== undefined) return storageAvailable;
  if (typeof window === "undefined" || !window.localStorage) {
    storageAvailable = false;
    return storageAvailable;
  }
  try {
    const testKey = "__gesturePortfolio_storage_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    storageAvailable = true;
  } catch (error) {
    storageAvailable = false;
  }
  return storageAvailable;
};

const getItem = (key) => {
  if (!key) return null;

  if (isLocalStorageAvailable()) {
    try {
      return window.localStorage.getItem(key);
    } catch (error) {
      storageAvailable = false;
    }
  }

  return memoryStore.has(key) ? memoryStore.get(key) : null;
};

const setItem = (key, value) => {
  if (!key) return;

  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.setItem(key, value);
      return;
    } catch (error) {
      storageAvailable = false;
    }
  }

  memoryStore.set(key, value);
};

const removeItem = (key) => {
  if (!key) return;

  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.removeItem(key);
      return;
    } catch (error) {
      storageAvailable = false;
    }
  }

  memoryStore.delete(key);
};

const clear = () => {
  if (isLocalStorageAvailable()) {
    try {
      window.localStorage.clear();
    } catch (error) {
      storageAvailable = false;
    }
  }

  memoryStore.clear();
};

export { getItem, setItem, removeItem, clear };
