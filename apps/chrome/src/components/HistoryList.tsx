import React, { useState, useEffect } from 'react';
import { getDatabase } from '@chronicle-sync/core';
import type { HistoryEntry } from '@chronicle-sync/core';

export function HistoryList() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEntries() {
      try {
        const db = await getDatabase();
        const result = await db.history.find().exec();
        setEntries(result.sort((a, b) => b.timestamp - a.timestamp));
      } catch (error) {
        console.error('Failed to load history:', error);
      } finally {
        setLoading(false);
      }
    }

    loadEntries();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="history-list">
      <h2>Browsing History</h2>
      {entries.length === 0 ? (
        <p>No history entries yet</p>
      ) : (
        <ul>
          {entries.map((entry) => (
            <li key={entry.id} className="history-item">
              <a href={entry.url} target="_blank" rel="noopener noreferrer">
                {entry.title || entry.url}
              </a>
              <div className="history-meta">
                <span className="device-id">Device: {entry.deviceId}</span>
                <time dateTime={new Date(entry.timestamp).toISOString()}>
                  {new Date(entry.timestamp).toLocaleString()}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}