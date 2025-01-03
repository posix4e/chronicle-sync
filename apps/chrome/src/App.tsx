import React from 'react';
import { HistoryList } from './components/HistoryList';

const App: React.FC = () => {
  return (
    <div className="chronicle-sync-app">
      <header>
        <h1>Chronicle Sync</h1>
        <p>Your synchronized browsing history</p>
      </header>
      <main>
        <HistoryList />
      </main>
    </div>
  );
};

export default App;
