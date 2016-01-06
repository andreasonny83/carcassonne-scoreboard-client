(function() {
  'use strict';

  angular
      .module('guidService', [])
      .factory('guid', Service);

  /* @ngInject */
  function Service() {

    return function guid() {
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000 | 0)
          .toString(16)
          .substring(1);
      }

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
    }
  }
})();
