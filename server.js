const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the built web app
app.use(express.static(path.join(__dirname, 'apps/web/dist')));

// Handle client-side routing by serving index.html for all routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'apps/web/dist/index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
