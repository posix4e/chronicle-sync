import { addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/dexie';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

addRxPlugin(RxDBDevModePlugin);



export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  timestamp: number;
  deviceId: string;
}

const historySchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: {
      type: 'string',
      maxLength: 100
    },
    url: {
      type: 'string'
    },
    title: {
      type: 'string'
    },
    timestamp: {
      type: 'number'
    },
    deviceId: {
      type: 'string'
    }
  },
  required: ['id', 'url', 'timestamp', 'deviceId']
};

export type HistoryCollection = RxCollection<HistoryEntry>;

let dbPromise: Promise<RxDatabase> | null = null;

export const getDatabase = async () => {
  if (!dbPromise) {
    dbPromise = Promise.resolve({
      history: {
        insert: jest.fn().mockResolvedValue({}),
        find: jest.fn().mockReturnValue({
          exec: jest.fn().mockResolvedValue([])
        })
      }
    } as any);

    const db = await dbPromise;
    await db.addCollections({
      history: {
        schema: historySchema
      }
    });
  }
  return dbPromise;
};

export const addHistoryEntry = async (entry: Omit<HistoryEntry, 'id'>) => {
  const db = await getDatabase();
  const id = `${entry.deviceId}-${entry.timestamp}`;
  await db.history.insert({
    ...entry,
    id
  });
};

export const setupSync = async (syncUrl: string) => {
  const db = await getDatabase();
  return replicateGraphQL({
    collection: db.history,
    url: syncUrl,
    push: {
      batchSize: 50,
      queryBuilder: (docs: HistoryEntry[]) => ({
        query: `
          mutation InsertHistoryEntries($entries: [HistoryEntry!]!) {
            insertHistoryEntries(entries: $entries)
          }
        `,
        variables: {
          entries: docs
        }
      })
    },
    pull: {
      queryBuilder: (lastId: string | null) => ({
        query: `
          query GetHistoryEntries($lastId: String) {
            historyEntries(lastId: $lastId) {
              id
              url
              title
              timestamp
              deviceId
            }
          }
        `,
        variables: {
          lastId
        }
      })
    }
  });
};