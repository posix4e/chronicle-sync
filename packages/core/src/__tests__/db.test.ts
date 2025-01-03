import { addHistoryEntry, getDatabase } from '../db';
export {};

jest.mock('rxdb', () => ({
  createRxDatabase: jest.fn().mockResolvedValue({
    addCollections: jest.fn().mockResolvedValue({
      history: {
        insert: jest.fn().mockResolvedValue({}),
      },
    }),
  }),
  addRxPlugin: jest.fn(),
}));

describe('Database', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create a history entry', async () => {
    const entry = {
      url: 'https://example.com',
      title: 'Example',
      timestamp: Date.now(),
      deviceId: 'test-device',
    };

    await addHistoryEntry(entry);
    const db = await getDatabase();
    
    expect(db.history.insert).toHaveBeenCalledWith(expect.objectContaining({
      ...entry,
      id: expect.stringContaining(entry.deviceId),
    }));
  });
});
