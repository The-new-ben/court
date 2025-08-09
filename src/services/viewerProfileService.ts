const DB_NAME = 'courtDBv6';
const STORE_NAME = 'viewer_profile';

export interface ViewerProfile {
  id: string;
  watchHistory: string[];
  notificationPreferences: {
    email: boolean;
    sms: boolean;
  };
  avatarImage: string;
}

class ViewerProfileService {
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = event => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getProfile(id: string): Promise<ViewerProfile | null> {
    try {
      const db = await this.openDB();
      return new Promise(resolve => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result || null);
      });
    } catch (error) {
      console.warn('Could not read viewer profile from IndexedDB', error);
      return null;
    }
  }

  async saveProfile(profile: ViewerProfile): Promise<void> {
    try {
      const db = await this.openDB();
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put(profile);
    } catch (error) {
      console.warn('Could not save viewer profile to IndexedDB', error);
    }
  }

  tailorContent(profile: ViewerProfile): string[] {
    const types: string[] = [];
    if (profile.notificationPreferences.email) {
      types.push('legal-news');
    }
    if (profile.notificationPreferences.sms) {
      types.push('case-updates');
    }
    return types;
  }
}

export const viewerProfileService = new ViewerProfileService();
