export interface Case {
  id: string;
  description: string;
  opinions: { system: string; reply: string }[];
  balanced: string;
  timestamp: string;
}

const DB_NAME = 'courtDBv6';
const STORE_NAME = 'cases';

class CaseService {
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async saveCase(caseData: Case): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.put(caseData);
    } catch (error) {
      console.warn('Could not save to IndexedDB', error);
    }
  }

  async getAllCases(): Promise<Case[]> {
    try {
      const db = await this.openDB();
      return new Promise((resolve) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
      });
    } catch (error) {
      console.warn('Could not read from IndexedDB', error);
      return [];
    }
  }

  async clearAllCases(): Promise<void> {
    try {
      const db = await this.openDB();
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      store.clear();
    } catch (error) {
      console.warn('Could not clear IndexedDB', error);
    }
  }
}

export const caseService = new CaseService();