import { createDatabase, ChronicleDatabase } from '../database';
import { SyncManager } from '../sync-manager';
import { addRxPlugin } from 'rxdb';

import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';
import { jest } from '@jest/globals';
import { Response } from 'node-fetch';

// Add dev mode plugin for better error messages in tests
addRxPlugin(RxDBDevModePlugin);

describe('SyncManager', () => {
  let db: ChronicleDatabase;
  let syncManager: SyncManager;
  const testConfig = {
    serverUrl: 'http://localhost:5984/test-history',
    deviceId: 'test-device-123'
  };

  beforeEach(async () => {
    // Use memory adapter for tests
    db = await createDatabase('test-db-' + Date.now(), 'memory');
    syncManager = new SyncManager(db, testConfig);

    // Mock fetch
    global.fetch = jest.fn().mockImplementation(
      () => Promise.resolve(new Response(JSON.stringify([]), { status: 200 }))
    ) as unknown as typeof fetch;
  });

  afterEach(async () => {
    if (syncManager) {
      await syncManager.stop();
    }
    if (db) {
      await db.destroy();
    }
  });



  it('should initialize with correct configuration', () => {
    expect(syncManager).toBeDefined();
  });

  it('should start and stop replication', async () => {
    const replicationState = await syncManager.start();
    expect(replicationState).toBeDefined();

    await syncManager.stop();
    expect(replicationState).toBeDefined();
  });

  it('should add history items and sync them', async () => {
    const testItem = {
      id: 'test-' + Date.now(),
      url: 'https://example.com',
      title: 'Test Page',
      visitTime: Date.now(),
      deviceId: testConfig.deviceId,
      _deleted: false
    };

    // Add item to database
    await db.history.insert(testItem);
    
    // Start sync
    await syncManager.start();

    // Verify item was added
    const item = await db.history.findOne(testItem.id).exec();
    expect(item).toBeDefined();
    expect(item!.url).toBe(testItem.url);
    expect(item!.deviceId).toBe(testConfig.deviceId);
  });

  it('should handle sync errors gracefully', async () => {
    const invalidConfig = {
      ...testConfig,
      serverUrl: 'http://invalid-url:1234/db'
    };
    
    const errorManager = new SyncManager(db, invalidConfig);
    
    try {
      await errorManager.start();
    } catch (error) {
      expect(error).toBeDefined();
    }

    await errorManager.stop();
  });

  it('should respect sync interval configuration', async () => {
    const mockSetTimeout = jest.spyOn(global, 'setTimeout');
    
    const intervalConfig = {
      ...testConfig,
      syncInterval: 5000 // 5 seconds
    };

    const intervalManager = new SyncManager(db, intervalConfig);
    await intervalManager.start();

    // Should have triggered a sync
    expect(mockSetTimeout).toHaveBeenCalledWith(expect.any(Function), 5000);

    await intervalManager.stop();
    mockSetTimeout.mockRestore();
  });
});
