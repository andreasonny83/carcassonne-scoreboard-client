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

      // function removeAllListeners() {
      //   for(var i = 0; i < socket.listeners.length; i++) {
      //     var details = socket.listeners[i];
      //     socket.removeListener(details.event, details.fn);
      // }

      return {
        on: on,
        emit: emit
        // removeAllListeners: removeAllListeners
      };
    }
})();
