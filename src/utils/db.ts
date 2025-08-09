import type { Case } from '../services/caseService'

const DB_NAME = 'courtDBv6'
const STORE_NAME = 'cases'

export const openDB = async (): Promise<IDBDatabase> => new Promise((resolve, reject) => {
  const request = indexedDB.open(DB_NAME, 1)
  request.onsuccess = () => resolve(request.result)
  request.onerror = () => reject(request.error)
})

export const getAllCases = async (): Promise<Case[]> => {
  const db = await openDB()
  return new Promise<Case[]>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).getAll()
    request.onsuccess = () => resolve(request.result as Case[])
    request.onerror = () => reject(request.error)
  })
}

export const getCaseCount = async (): Promise<number> => {
  const db = await openDB()
  return new Promise<number>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).count()
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const clearCases = async (): Promise<void> => {
  const db = await openDB()
  return new Promise<void>((resolve, reject) => {
    const request = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).clear()
    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}
