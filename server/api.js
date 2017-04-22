const express = require('express');
const router = express.Router();
const port = process.env.PORT || 5000;

/* GET api listing. */
router.get('/status', (req, res) => {
    res.send('Carcassonne Online Scoreboard');
});

// dynamic config vars are fetched from global environment variables, if any
router.get('/env.js', function(req, res) {
  res.send(`
    (function (window) {
      window.__env = window.__env || {};

      // API url
      window.__env.server = "${process.env.API_URL || 'http://localhost'}";

      // API port number
      window.__env.port = ${process.env.API_PORT || 5005};

      // Whether or not to enable debug mode
      // Setting this to false will disable console output
      window.__env.enableDebug = ${process.env.DEBUG || false};
    }(this));
  `);
});

module.exports = router;
