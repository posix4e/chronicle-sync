import {
  createRxDatabase,
  RxDatabase,
  RxCollection
} from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { historyItemSchema, HistoryItemDocType } from './schema';

export interface ChronicleCollections {
  history: RxCollection<HistoryItemDocType>;
}

export type ChronicleDatabase = RxDatabase<ChronicleCollections>;

export async function createDatabase(
  name: string,
  storage: 'idb' | 'memory' = 'idb'
): Promise<ChronicleDatabase> {
  const db = await createRxDatabase<ChronicleCollections>({
    name,
    storage: getRxStorageDexie(),
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