import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  RxStorage
} from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { getRxStorageMemory } from 'rxdb/plugins/storage-memory';
import { wrappedValidateAjvStorage } from 'rxdb/plugins/validate-ajv';
import { historyItemSchema, HistoryItemDocType } from './schema';

export interface ChronicleCollections {
  history: RxCollection<HistoryItemDocType>;
}

export type ChronicleDatabase = RxDatabase<ChronicleCollections>;

export async function createDatabase(
  name: string,
  storage: 'idb' | 'memory' = 'idb'
): Promise<ChronicleDatabase> {
  const baseStorage = storage === 'memory' ? getRxStorageMemory() : getRxStorageDexie();
  const validatedStorage = wrappedValidateAjvStorage({
    storage: baseStorage as any
  });

  const db = await createRxDatabase<ChronicleCollections>({
    name,
    storage: validatedStorage,
    multiInstance: storage === 'idb',
    ignoreDuplicate: true
  });

  await db.addCollections({
    history: {
      schema: historyItemSchema
    }
  });

  return db;
}
