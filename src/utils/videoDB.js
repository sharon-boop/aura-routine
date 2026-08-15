const DB_NAME = 'auraRoutineMedia'
const STORE   = 'videos'
const VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = e => e.target.result.createObjectStore(STORE)
    req.onsuccess  = e => resolve(e.target.result)
    req.onerror    = () => reject(req.error)
  })
}

export async function saveVideoBlob(key, blob) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).put(blob, key)
    tx.oncomplete = resolve
    tx.onerror    = () => reject(tx.error)
  })
}

export async function getVideoBlob(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx  = db.transaction(STORE, 'readonly')
    const req = tx.objectStore(STORE).get(key)
    req.onsuccess = () => resolve(req.result || null)
    req.onerror   = () => reject(req.error)
  })
}

export async function deleteVideoBlob(key) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE, 'readwrite')
    tx.objectStore(STORE).delete(key)
    tx.oncomplete = resolve
    tx.onerror    = () => reject(tx.error)
  })
}
