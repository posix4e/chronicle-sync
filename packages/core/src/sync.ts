import { createRxDatabase, addRxPlugin } from 'rxdb';
import { getRxStorageDexie } from 'rxdb/plugins/storage-dexie';
import { replicateGraphQL } from 'rxdb/plugins/replication-graphql';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { RxDBQueryBuilderPlugin } from 'rxdb/plugins/query-builder';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { v4 as uuidv4 } from 'uuid';

// Add required plugins
if (process.env.NODE_ENV !== 'production') {
  addRxPlugin(RxDBDevModePlugin);
}
addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBLeaderElectionPlugin);

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
    },
    lastModified: {
      type: 'number'
    }
  },
  required: ['id', 'url', 'timestamp', 'deviceId', 'lastModified'],
  indexes: ['timestamp', 'deviceId', 'lastModified']
};

let dbPromise = null;
let replicationState = null;

export const getDatabase = async (dbName = 'chronicle_sync') => {
  if (!dbPromise) {
    dbPromise = createRxDatabase({
      name: dbName,
      storage: getRxStorageDexie(),
      multiInstance: true,
      ignoreDuplicate: true
    });

    const db = await dbPromise;
    await db.addCollections({
      history: {
        schema: historySchema
      }
    });
  }
  return dbPromise;
};

export const setupSync = async (syncUrl: string, deviceId: string) => {
  if (!syncUrl) {
    throw new Error('Sync URL is required');
  }

  const db = await getDatabase();
  
  // Stop existing replication if any
  if (replicationState) {
    await replicationState.cancel();
  }

  // Set up GraphQL replication
  replicationState = replicateGraphQL({
    collection: db.history,
    url: { http: syncUrl },
    pull: {
      queryBuilder: (lastPulledId) => ({
        query: `
          query SyncHistoryEntries($lastId: String, $minTimestamp: Float!) {
            historyEntries(lastId: $lastId, minTimestamp: $minTimestamp) {
              id
              url
              title
              timestamp
              deviceId
              lastModified
            }
          }
        `,
        variables: {
          lastId: lastPulledId,
          minTimestamp: Date.now() - (30 * 24 * 60 * 60 * 1000) // Sync last 30 days
        }
      }),
      modifier: (doc) => ({
        ...doc,
        lastModified: Date.now()
      })
    },
    push: {
      batchSize: 50,
      queryBuilder: (docs) => ({
        query: `
          mutation SyncHistoryEntries($entries: [HistoryEntryInput!]!) {
            syncHistoryEntries(entries: $entries) {
              id
              lastModified
            }
          }
        `,
        variables: {
          entries: docs.map(d => ({
            ...d.newDocumentState,
            lastModified: Date.now()
          }))
        }
      })
    },
    live: true,
    retryTime: 1000 * 30, // Retry every 30 seconds
    waitForLeadership: true,
    deletedField: 'deleted'
  });

  // Start replication
  replicationState.start();

  return replicationState;
};

export const addHistoryEntry = async (entry: Omit<HistoryEntry, 'id' | 'lastModified'>) => {
  const db = await getDatabase();
  const id = `${entry.deviceId}-${entry.timestamp}-${uuidv4()}`;
  
  await db.history.insert({
    ...entry,
    id,
    lastModified: Date.now()
  });
};

export const getHistoryEntries = async (options = {}) => {
  const db = await getDatabase();
  const query = db.history.find({
    sort: [{ timestamp: 'desc' }],
    ...options
  });
  return query.exec();
};

export const clearHistory = async (deviceId?: string) => {
  const db = await getDatabase();
  if (deviceId) {
    await db.history.find({
      selector: {
        deviceId: deviceId
      }
    }).remove();
  } else {
    await db.history.remove();
  }
};