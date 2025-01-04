import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  addRxPlugin
} from 'rxdb';
import { getRxStorage } from 'rxdb/plugins/storage-dexie';
import { replicateRxCollection } from 'rxdb/plugins/replication';
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
    storage: getRxStorage(),
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