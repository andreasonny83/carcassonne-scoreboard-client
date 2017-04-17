var express = require('express');
var app = express();

var port = process.env.PORT || 5000;

app.use(express.static(__dirname));

app.get('/', function(req, res) {
  res.sendFile('index.html');
});

// dynamic config vars are fetched from global environment variables, if any
app.get('/env.js', function(req, res) {
    res.send(`
      (function (window) {
        window.__env = window.__env || {};

        // API url
        window.__env.server = "${process.env.API_URL || 'http://localhost'}";

        // API port number
        window.__env.port = ${process.env.API_PORT || 5000};

        // Whether or not to enable debug mode
        // Setting this to false will disable console output
        window.__env.enableDebug = ${process.env.DEBUG || false};
      }(this));
    `);
});

app.listen(port, function() {
  console.log('Client app listening on port ' + port);
});
