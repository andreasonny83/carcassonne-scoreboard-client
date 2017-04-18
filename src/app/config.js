/**
 * carcassonne-scoreboard-client
 *
 * @author    Andrea Sonny <andreasonny83@gmail.com>
 * @license   MIT
 *
 * https://andreasonny.mit-license.org/
 *
 */
(function() {
  'use strict';

  var env = {};

  // Import variables if present (from env.js)
  if ('__env' in window) {
    env = JSON.parse(JSON.stringify(window.__env));
  }

  angular
    .module('app')
    .constant('serverApp', env);
})();
