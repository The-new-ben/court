export interface Evidence {
  id: string;
  owner: string;
  timestamp: string;
  source: string;
  content: string;
}

export interface EvidenceLog {
  id: string;
  evidenceId: string;
  action: 'create' | 'transfer' | 'modify';
  from?: string;
  to?: string;
  timestamp: string;
}

const DB_NAME = 'evidenceDB';
const EVIDENCE_STORE = 'evidences';
const LOG_STORE = 'evidenceLogs';

class EvidenceService {
  private async openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, 1);
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(EVIDENCE_STORE)) {
          db.createObjectStore(EVIDENCE_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(LOG_STORE)) {
          db.createObjectStore(LOG_STORE, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async addEvidence(data: Omit<Evidence, 'id' | 'timestamp'>): Promise<Evidence> {
    const evidence: Evidence = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...data
    };
    const db = await this.openDB();
    const tx = db.transaction([EVIDENCE_STORE, LOG_STORE], 'readwrite');
    tx.objectStore(EVIDENCE_STORE).put(evidence);
    const log: EvidenceLog = {
      id: crypto.randomUUID(),
      evidenceId: evidence.id,
      action: 'create',
      to: evidence.owner,
      timestamp: evidence.timestamp
    };
    tx.objectStore(LOG_STORE).put(log);
    return evidence;
  }

  async transferEvidence(id: string, newOwner: string): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction([EVIDENCE_STORE, LOG_STORE], 'readwrite');
    const store = tx.objectStore(EVIDENCE_STORE);
    const req = store.get(id);
    await new Promise<void>((resolve) => {
      req.onsuccess = () => {
        const evidence = req.result as Evidence | undefined;
        if (evidence) {
          const log: EvidenceLog = {
            id: crypto.randomUUID(),
            evidenceId: id,
            action: 'transfer',
            from: evidence.owner,
            to: newOwner,
            timestamp: new Date().toISOString()
          };
          evidence.owner = newOwner;
          store.put(evidence);
          tx.objectStore(LOG_STORE).put(log);
        }
        resolve();
      };
    });
  }

  async modifyEvidence(id: string, content: string): Promise<void> {
    const db = await this.openDB();
    const tx = db.transaction([EVIDENCE_STORE, LOG_STORE], 'readwrite');
    const store = tx.objectStore(EVIDENCE_STORE);
    const req = store.get(id);
    await new Promise<void>((resolve) => {
      req.onsuccess = () => {
        const evidence = req.result as Evidence | undefined;
        if (evidence) {
          evidence.content = content;
          store.put(evidence);
          const log: EvidenceLog = {
            id: crypto.randomUUID(),
            evidenceId: id,
            action: 'modify',
            timestamp: new Date().toISOString()
          };
          tx.objectStore(LOG_STORE).put(log);
        }
        resolve();
      };
    });
  }

  async getEvidence(id: string): Promise<Evidence | undefined> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const req = db.transaction(EVIDENCE_STORE, 'readonly').objectStore(EVIDENCE_STORE).get(id);
      req.onsuccess = () => resolve(req.result as Evidence | undefined);
      req.onerror = () => resolve(undefined);
    });
  }

  async getLogs(id: string): Promise<EvidenceLog[]> {
    const db = await this.openDB();
    return new Promise((resolve) => {
      const store = db.transaction(LOG_STORE, 'readonly').objectStore(LOG_STORE);
      const logs: EvidenceLog[] = [];
      store.openCursor().onsuccess = (e) => {
        const cursor = (e.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          const log = cursor.value as EvidenceLog;
          if (log.evidenceId === id) logs.push(log);
          cursor.continue();
        } else {
          resolve(logs);
        }
      };
    });
  }
}

export const evidenceService = new EvidenceService();
