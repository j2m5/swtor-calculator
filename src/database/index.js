import { Dexie } from 'dexie'

export const db = new Dexie('swtor')

db.version(1).stores({
  builds: '++id, &key, name, data'
})
