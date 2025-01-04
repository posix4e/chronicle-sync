import { ChronicleDatabase } from './database';
import { HistoryItem } from './schema';
import { RxCollection } from 'rxdb';

export interface SyncConfig {
  serverUrl: string;
  deviceId: string;
  syncInterval?: number;
}

export class SyncManager {
  private replicationState?: RxCollection<HistoryItem>;
  private syncInterval?: NodeJS.Timeout;

  constructor(
    private db: ChronicleDatabase,
    private config: SyncConfig
  ) {}

  async start() {
    // Set up live replication
    this.replicationState = this.db.history;

    // Set up periodic sync
    await this.sync();

    // Set up periodic sync if interval is specified
    if (this.config.syncInterval) {
      this.syncInterval = setInterval(
        () => this.sync(),
        this.config.syncInterval
      );
    }

    return this.replicationState;
  }

  async stop() {
    // Nothing to cancel since we're using manual sync
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }

  private async sync() {
    try {
      // Get all local changes
      const localDocs = await this.db.history.find().exec();

      // Push changes to server
      await fetch(this.config.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          docs: localDocs.map(doc => ({
            ...doc.toJSON(),
            deviceId: this.config.deviceId,
            syncedAt: Date.now()
          }))
        })
      });

      // Pull changes from server
      const response = await fetch(this.config.serverUrl);
      const remoteDocs = await response.json();

      // Update local database
      for (const doc of remoteDocs) {
        await this.db.history.upsert({
          ...doc,
          _deleted: false
        });
      }
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}