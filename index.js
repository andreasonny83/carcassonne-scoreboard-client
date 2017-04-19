const express = require('express');
const http = require('http');
const port = process.env.PORT || 5000;
const app = express();

// Get our API routes
const api = require('./server/api');

// set the static files location
if (process.env.PORT) {
  app.use(express.static(__dirname + '/dist'));
} else {
  app.use(express.static(__dirname + '/client')); // for development when running `npm start`
}

// Set our api routes
app.use('/', api);
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

app.listen(port, () => console.log(`API running on http://localhost:${port}`));
