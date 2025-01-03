import {
  createRxDatabase,
  RxDatabase,
  RxCollection,
  addRxPlugin
} from 'rxdb';
import { getRxStoragePouch, addPouchPlugin } from 'rxdb/plugins/pouchdb';
import { historyItemSchema, HistoryItemDocType } from './schema';

// Add required plugins
import { RxDBReplicationPlugin } from 'rxdb/plugins/replication';
addRxPlugin(RxDBReplicationPlugin);

// Add PouchDB adapters
import * as PouchDBIdb from 'pouchdb-adapter-idb';
import * as PouchDBHttp from 'pouchdb-adapter-http';
addPouchPlugin(PouchDBIdb);
addPouchPlugin(PouchDBHttp);

export interface ChronicleCollections {
  history: RxCollection<HistoryItemDocType>;
}

export type ChronicleDatabase = RxDatabase<ChronicleCollections>;

export async function createDatabase(name: string): Promise<ChronicleDatabase> {
  const db = await createRxDatabase<ChronicleCollections>({
    name,
    storage: getRxStoragePouch('idb'),
    multiInstance: true,
    ignoreDuplicate: true
  });

  await db.addCollections({
    history: {
      schema: historyItemSchema
    }
  });

  return db;
}