(function() {
    'use strict';

    angular
        .module('socket', [])
        .factory('socket', factory);

    factory.$inject = ['$rootScope'];

    /* @ngInject */
    function factory($rootScope) {
      // server url
      var socket = io(serverApp.server + ':' + serverApp.port);

      function on(eventName, callback) {
        socket.on(eventName, function () {
          var args = arguments;

          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      }

      function emit(eventName, data, callback) {
        socket.emit(eventName, data, function () {
          var args = arguments;

          $rootScope.$apply(function () {
            if (callback) {
              callback.apply(socket, args);
            }
          });
        });
      }

      return {
        on: on,
        emit: emit
      };
    }
})();
