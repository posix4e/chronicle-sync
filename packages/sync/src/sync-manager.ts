import { ChronicleDatabase } from './database';
import { HistoryItem } from './schema';
import { RxReplicationState } from 'rxdb/plugins/replication';

export interface SyncConfig {
  serverUrl: string;
  deviceId: string;
  syncInterval?: number;
}

export class SyncManager {
  private replicationState?: RxReplicationState<HistoryItem, HistoryItem>;
  private syncInterval?: NodeJS.Timeout;

  constructor(
    private db: ChronicleDatabase,
    private config: SyncConfig
  ) {}

  async start() {
    // Set up live replication
    this.replicationState = replicateRxCollection({
      collection: this.db.history,
      replicationIdentifier: `sync-${this.config.deviceId}`,
      live: true,
      retryTime: 5000,
      waitForLeadership: true,
      push: {
        batchSize: 50,
        modifier: (doc) => ({
          ...doc,
          deviceId: this.config.deviceId,
          syncedAt: Date.now()
        })
      },
      pull: {
        batchSize: 50,
        modifier: (doc) => doc
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
      await replicateRxCollection({
        collection: this.db.history,
        replicationIdentifier: `sync-${this.config.deviceId}-${Date.now()}`,
        live: false,
        retryTime: 5000,
        waitForLeadership: true,
        push: {
          batchSize: 50,
          modifier: (doc) => ({
            ...doc,
            deviceId: this.config.deviceId,
            syncedAt: Date.now()
          })
        },
        pull: {
          batchSize: 50,
          modifier: (doc) => doc
        }
      });
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
}