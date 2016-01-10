(function() {
    'use strict';

    angular
        .module('socket', [])
        .factory('socket', factory);

    factory.$inject = ['$rootScope', 'serverApp'];

    /* @ngInject */
    function factory($rootScope, serverApp) {
      // server url
      var socket = io(serverApp.server + ':' + serverApp.port);

      function on(eventName, callback) {
        // prevent creating multiple listeners
        if ( socket._callbacks['$'+eventName] ) {
          socket._callbacks['$'+eventName] = [];
        }

        socket.on(eventName, function () {
          var args = arguments;

          $rootScope.$apply(function () {
            callback.apply(socket, args);
          });
        });
      }

      function emit(eventName, data, callback) {
        // prevent creating multiple listeners
        if ( socket._callbacks['$'+eventName] ) {
          socket._callbacks['$'+eventName] = [];
        }

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
