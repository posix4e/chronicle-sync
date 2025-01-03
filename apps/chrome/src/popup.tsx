import React from 'react';
import ReactDOM from 'react-dom';

const Popup = () => {
  return (
    <div>
      <h1>Chronicle Sync</h1>
      <p>Welcome to Chronicle Sync!</p>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById('root')
);
