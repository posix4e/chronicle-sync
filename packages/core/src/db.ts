export interface HistoryEntry {
  id: string;
  url: string;
  title: string;
  timestamp: number;
  deviceId: string;
  lastModified: number;
  deleted?: boolean;
}

export { getDatabase, setupSync, addHistoryEntry, getHistoryEntries, clearHistory } from './sync';