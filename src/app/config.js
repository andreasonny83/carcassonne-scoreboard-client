(function() {
  'use strict';

  angular
    .module('app')
    .constant('serverApp', {
      server : 'http://localhost',
      port   : 5000
    });
})();
