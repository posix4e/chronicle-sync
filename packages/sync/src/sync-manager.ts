import { ChronicleDatabase } from './database';
import { HistoryItem } from './schema';
import { ReplicationState } from 'rxdb';

export interface SyncConfig {
  serverUrl: string;
  deviceId: string;
  syncInterval?: number;
}

export class SyncManager {
  private replicationState?: ReplicationState<HistoryItem, HistoryItem>;
  private syncInterval?: NodeJS.Timeout;

  constructor(
    private db: ChronicleDatabase,
    private config: SyncConfig
  ) {}

  async start() {
    // Set up live replication
    this.replicationState = this.db.history.syncCouchDB({
      remote: this.config.serverUrl,
      options: {
        live: true,
        retry: true
      },
      pull: {
        modifier: (doc) => doc
      },
      push: {
        modifier: (doc) => ({
          ...doc,
          deviceId: this.config.deviceId,
          syncedAt: Date.now()
        })
      }
    });

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
    if (this.replicationState) {
      await this.replicationState.cancel();
    }
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
  }

  private async sync() {
    try {
      await this.db.history.sync({
        remote: this.config.serverUrl,
        options: {
          live: false,
          retry: true
        }
      });
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}