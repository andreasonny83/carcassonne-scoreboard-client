const express = require('express');
const morgan = require('morgan');
const port = process.env.PORT || 5000;
const app = express();

// Get our API routes
const api = require('./server/api');

// set the static files location
if (!!process.env.PORT) {
  app.use(express.static(__dirname + '/dist'));
} else {
  app.use(express.static(__dirname + '/client')); // for development when running `npm start`
}

if (process.env.DEBUG === 'true') {
  app.use(morgan('dev')); // log every request to the console in Debug mode

  console.log('App running in debug mode.');
}

// Set our api routes
app.use('/', api);
app.set('port', port);

app.listen(port, () => console.log(`Server listening on port ${port}`));
