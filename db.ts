/**
 * Al-Asani Store - IndexedDB Manager
 * 
 * This file manages all interactions with the browser's IndexedDB, which acts as the
 * client-side database for the application. This allows for persistent storage of
 * services, categories, settings, and other data, enabling faster load times and
 * offline capabilities.
 *
 * How it works:
 * 1. initDB(): Establishes a connection to the database and creates the necessary
 *    'object stores' (like tables in a traditional DB) if they don't exist.
 * 2. Data is stored in key-value pairs or as objects within these stores.
 * 3. The app first tries to load data from IndexedDB. If it's the user's first visit
 *    and the DB is empty, it's "seeded" with initial data from the `data.json` file.
 * 4. All subsequent changes made by the admin are saved directly to IndexedDB.
 */

import { Service, Category, ServiceSuggestion } from './types';

const DB_NAME = 'AlAsaniStoreDB';
const DB_VERSION = 2; // Incremented version for schema change

// A global variable to hold the database connection instance.
let db: IDBDatabase;

/**
 * Initializes the IndexedDB database.
 * This function must be called before any other database operations.
 * It handles the creation and versioning of the database schema.
 * @returns {Promise<boolean>} A promise that resolves to true on successful connection.
 */
export const initDB = (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    // If the database connection is already open, resolve immediately.
    if (db) {
      return resolve(true);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('Database error:', request.error);
      reject('Database error');
    };

    request.onsuccess = () => {
      db = request.result;
      resolve(true);
    };

    // This event is triggered only when the database version changes or is first created.
    // It's the only place where you can alter the database's structure (schema).
    request.onupgradeneeded = (event) => {
      const dbInstance = (event.target as IDBOpenDBRequest).result;
      // Create object stores if they don't already exist.
      if (!dbInstance.objectStoreNames.contains('services')) {
        dbInstance.createObjectStore('services', { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains('categories')) {
        dbInstance.createObjectStore('categories', { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains('settings')) {
        dbInstance.createObjectStore('settings', { keyPath: 'key' });
      }
      if (!dbInstance.objectStoreNames.contains('serviceSuggestions')) {
        dbInstance.createObjectStore('serviceSuggestions', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

/**
 * Clears all data from the specified object stores.
 * Useful for resetting the application's local state.
 * @param {string[]} storeNames - An array of store names to clear.
 * @returns {Promise<void>}
 */
export const clearStores = (storeNames: string[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(storeNames, 'readwrite');
        if (storeNames.length === 0) {
            resolve();
            return;
        }

        storeNames.forEach(storeName => {
            if (db.objectStoreNames.contains(storeName)) {
                const request = transaction.objectStore(storeName).clear();
                request.onerror = () => reject(request.error);
            }
        });

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
    });
};

/**
 * Retrieves all items from a given object store.
 * @template T - The type of items in the store.
 * @param {string} storeName - The name of the object store.
 * @returns {Promise<T[]>} A promise that resolves with an array of all items.
 */
export const getAll = <T>(storeName: string): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => {
            resolve(request.result as T[]);
        };
        request.onerror = () => {
            console.error(`Error getting all from ${storeName}:`, request.error);
            reject(request.error);
        };
    });
};

/**
 * Replaces all items in an object store with a new set of items.
 * This is done by clearing the store first, then adding all new items.
 * @template T - The type of items, must have an 'id' property.
 * @param {string} storeName - The name of the object store.
 * @param {T[]} items - The array of new items to save.
 * @returns {Promise<void>}
 */
export const replaceAll = <T extends { id: any }>(storeName: string, items: T[]): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        
        const clearRequest = store.clear();
        clearRequest.onerror = () => reject(clearRequest.error);
        clearRequest.onsuccess = () => {
            if (items.length === 0) {
                 transaction.oncomplete = () => resolve();
                 return;
            }
            items.forEach(item => {
                store.put(item);
            });
        };

        transaction.oncomplete = () => {
            resolve();
        };

        transaction.onerror = () => {
            console.error(`Error saving all to ${storeName}:`, transaction.error);
            reject(transaction.error);
        };
    });
};

/**
 * Retrieves a single setting value from the 'settings' store.
 * @template T - The expected type of the setting's value.
 * @param {string} key - The key of the setting to retrieve.
 * @returns {Promise<T | undefined>} A promise that resolves with the setting's value or undefined if not found.
 */
export const getSetting = <T>(key: string): Promise<T | undefined> => {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction('settings', 'readonly');
        const store = transaction.objectStore('settings');
        const request = store.get(key);

        request.onsuccess = () => {
            resolve(request.result?.value as T);
        };
        request.onerror = () => {
             console.error(`Error getting setting with key ${key}:`, request.error);
            reject(request.error);
        };
    });
};

/**
 * Saves or updates a single setting in the 'settings' store.
 * @param {string} key - The key of the setting to save.
 * @param {any} value - The value of the setting.
 * @returns {Promise<void>}
 */
export const saveSetting = (key: string, value: any): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction('settings', 'readwrite');
        const store = transaction.objectStore('settings');
        const request = store.put({ key, value });

        request.onsuccess = () => {
            resolve();
        };
        request.onerror = () => {
            console.error(`Error saving setting with key ${key}:`, request.error);
            reject(request.error);
        };
    });
};

// --- Service Suggestion Functions ---

/**
 * Adds a new service suggestion to the 'serviceSuggestions' store.
 * @param {Omit<ServiceSuggestion, 'id'>} suggestion - The suggestion object without an ID.
 * @returns {Promise<number>} A promise that resolves with the ID of the newly added suggestion.
 */
export const addSuggestion = (suggestion: Omit<ServiceSuggestion, 'id'>): Promise<number> => {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction('serviceSuggestions', 'readwrite');
        const store = transaction.objectStore('serviceSuggestions');
        const request = store.add(suggestion);
        request.onsuccess = () => resolve(request.result as number);
        request.onerror = () => reject(request.error);
    });
};

/**
 * Retrieves all service suggestions.
 * @returns {Promise<ServiceSuggestion[]>}
 */
export const getAllSuggestions = (): Promise<ServiceSuggestion[]> => {
    return getAll<ServiceSuggestion>('serviceSuggestions');
};

/**
 * Deletes a service suggestion by its ID.
 * @param {number} id - The ID of the suggestion to delete.
 * @returns {Promise<void>}
 */
export const deleteSuggestion = (id: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        if (!db) return reject("DB not initialized");
        const transaction = db.transaction('serviceSuggestions', 'readwrite');
        const store = transaction.objectStore('serviceSuggestions');
        const request = store.delete(id);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
};