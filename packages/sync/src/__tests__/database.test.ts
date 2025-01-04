import { createDatabase, ChronicleDatabase } from '../database';
import { HistoryItem } from '../schema';
import { addRxPlugin } from 'rxdb';
import { RxDBDevModePlugin } from 'rxdb/plugins/dev-mode';

// Add dev mode plugin for better error messages in tests
addRxPlugin(RxDBDevModePlugin);

describe('Database', () => {
  let db: ChronicleDatabase;

  beforeAll(async () => {
    db = await createDatabase('test-db-' + Date.now(), 'memory');
  });

  afterAll(async () => {
    if (db) {
      await db.destroy();
    }
  });

  it('should create database with history collection', () => {
    expect(db).toBeDefined();
    expect(db.history).toBeDefined();
  });

  it('should insert and retrieve history items', async () => {
    const testItem: HistoryItem = {
      id: 'test-' + Date.now(),
      url: 'https://example.com',
      title: 'Test Page',
      visitTime: Date.now(),
      deviceId: 'test-device'
    };

    // Insert item
    await db.history.insert(testItem);

    // Retrieve item
    const item = await db.history.findOne(testItem.id).exec();
    expect(item).toBeDefined();
    expect(item!.url).toBe(testItem.url);
    expect(item!.title).toBe(testItem.title);
  });

  it('should enforce schema validation', async () => {
    const invalidItem = {
      id: 'test-invalid',
      // Missing required url field
      title: 'Test Page',
      visitTime: Date.now(),
      deviceId: 'test-device'
    };

    // Attempt to insert invalid item
    await expect(
      // @ts-ignore - Testing runtime validation
      db.history.insert(invalidItem)
    ).rejects.toThrow();
  });

  it('should query items by indexes', async () => {
    const now = Date.now();
    const items: HistoryItem[] = [
      {
        id: 'test-1',
        url: 'https://example1.com',
        visitTime: now - 1000,
        deviceId: 'device-1'
      },
      {
        id: 'test-2',
        url: 'https://example2.com',
        visitTime: now,
        deviceId: 'device-1'
      },
      {
        id: 'test-3',
        url: 'https://example3.com',
        visitTime: now + 1000,
        deviceId: 'device-2'
      }
    ];

    // Insert test items
    await Promise.all(items.map(item => db.history.insert(item)));

    // Query by deviceId
    const device1Items = await db.history.find({
      selector: { deviceId: 'device-1' }
    }).exec();
    expect(device1Items.length).toBe(2);

    // Query by visitTime range
    const recentItems = await db.history.find({
      selector: {
        visitTime: {
          $gte: now
        }
      }
    }).exec();
    expect(recentItems.length).toBe(2);
  });

  it('should handle updates correctly', async () => {
    const testItem: HistoryItem = {
      id: 'test-update',
      url: 'https://example.com',
      title: 'Original Title',
      visitTime: Date.now(),
      deviceId: 'test-device'
    };

    // Insert item
    await db.history.insert(testItem);

    // Update item
    const doc = await db.history.findOne(testItem.id).exec();
    await doc!.patch({ title: 'Updated Title' });

    // Verify update
    const updated = await db.history.findOne(testItem.id).exec();
    expect(updated!.title).toBe('Updated Title');
  });
});