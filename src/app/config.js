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

  angular
    .module('app')
    .constant('serverApp', {
      server : 'https://carcassonne-scoreboard.herokuapp.com', // server
      port   : 443
      // server : 'http://localhost',
      // port   : 5000
    });
})();
