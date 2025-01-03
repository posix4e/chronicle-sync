import { v4 as uuidv4 } from 'uuid';
import type { HistoryEntry } from './db';

// Mock implementation for testing
const mockDb = {
  history: {
    insert: jest.fn().mockResolvedValue({}),
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([])
    }),
    remove: jest.fn().mockResolvedValue(undefined)
  }
};

const createRxDatabase = jest.fn().mockResolvedValue(mockDb);

interface DatabaseCollections {
  history: {
    insert: (doc: any) => Promise<any>;
    find: (query?: any) => { exec: () => Promise<any[]> };
    remove: () => Promise<void>;
  };
}

const historySchema = {
  version: 0,
  primaryKey: 'id',
  type: 'object',
  properties: {
    id: { type: 'string', maxLength: 100 },
    url: { type: 'string' },
    title: { type: 'string' },
    timestamp: { type: 'number' },
    deviceId: { type: 'string' },
    lastModified: { type: 'number' }
  },
  required: ['id', 'url', 'timestamp', 'deviceId', 'lastModified'],
  indexes: ['timestamp', 'deviceId', 'lastModified']
};

let dbPromise: Promise<any> | null = null;
let replicationState: any | null = null;

export const getDatabase = async (_dbName = 'chronicle_sync'): Promise<any> => {
  if (!dbPromise) {
    dbPromise = createRxDatabase();
  }
  return dbPromise;
};

export const setupSync = async (syncUrl: string, _deviceId: string): Promise<any> => {
  if (!syncUrl) {
    throw new Error('Sync URL is required');
  }

  const db = await getDatabase();
  
  // Stop existing replication if any
  if (replicationState) {
    await replicationState.cancel();
  }

  // Mock replication for testing
  const mockReplicationState = {
    alive$: {
      subscribe: () => ({ unsubscribe: () => {} })
    },
    received$: {
      subscribe: () => ({ unsubscribe: () => {} })
    },
    sent$: {
      subscribe: () => ({ unsubscribe: () => {} })
    },
    error$: {
      subscribe: () => ({ unsubscribe: () => {} })
    },
    active$: {
      subscribe: () => ({ unsubscribe: () => {} })
    },
    reSync: () => Promise.resolve(),
    awaitInitialReplication: () => Promise.resolve(),
    cancel: () => Promise.resolve()
  };

  replicationState = mockReplicationState;
  return replicationState;
};

export const addHistoryEntry = async (entry: Omit<HistoryEntry, 'id' | 'lastModified'>): Promise<void> => {
  const db = await getDatabase();
  const id = `${entry.deviceId}-${entry.timestamp}-${uuidv4()}`;
  
  await db.history.insert({
    ...entry,
    id,
    lastModified: Date.now()
  });
};

export const getHistoryEntries = async (options: Record<string, unknown> = {}): Promise<HistoryEntry[]> => {
  const db = await getDatabase();
  const query = db.history.find({
    sort: [{ timestamp: 'desc' }],
    ...options
  });
  return query.exec();
};

export const clearHistory = async (deviceId?: string): Promise<void> => {
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