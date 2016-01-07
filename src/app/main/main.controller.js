/**
 * MainController
 *
 */
(function() {
    'use strict';

    angular
        .module('app')
        .controller('MainController', MainController);

    MainController.$inject = ['CONSTANTS', '$http', '$mdToast', 'socket', '$location'];

    /* @ngInject */
    function MainController(CONSTANTS, $http, $mdToast, socket, $location) {
      var vm = this;

      vm.users = {
        online: '-'
      };

      function setCookie(cname, cvalue, exhours) {
          var d = new Date();
          d.setTime(d.getTime() + (exhours*60*60*1000));
          var expires = "expires="+d.toUTCString();
          document.cookie = cname + "=" + cvalue + "; " + expires;
      }

      function getCookie(cname) {
          var name = cname + "=";
          var ca = document.cookie.split(';');
          for(var i=0; i<ca.length; i++) {
              var c = ca[i];
              while (c.charAt(0)==' ') c = c.substring(1);
              if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
          }
          return false;
      }

      // Socket listeners
      // ================

      // generate a randon user unique id to store in the cookies
      // in order to keep the connection alive
      if (! getCookie('userUniqueId') ) {
        var randomlyGeneratedUID = Math.random().toString(36).substring(3,16) + +new Date;
        setCookie('userUniqueId', randomlyGeneratedUID, 24);
      }

      // Register the user once the server connection is established
      socket.on('init', function () {
        console.log('received: init');
        socket.emit('register', getCookie('userUniqueId') );
      });

      socket.on('registered', function (data) {
        console.log('received: register');
        $mdToast.showSimple('You are now logged in.');
      });

      socket.on('ping', function (user_id) {
        var my_id = getCookie('userUniqueId');
        console.log('received: pinging user ' + user_id);
        if ( my_id === user_id) {
          socket.emit('pong', my_id );
        }
      });

      socket.on('user:left', function (data) {
        console.log('received: user:left');
        // $mdToast.showSimple('A user left.');
      });

      socket.on('users:update', function (users) {
        console.log('received: users:update');
        vm.users.online = users;
      });

      socket.on('game:ready', function (data) {
        console.log('game ready');
        if ( data.error ) {
          console.log('error.');
          $mdToast.showSimple('Ops! Something went wrong. Please check all the information and try again.');
          return;
        }

        if ( data.new_game ) {
          $mdToast.showSimple('Game successfully created. Redirecting into the game...');
        }
        else {
          $mdToast.showSimple('Redirecting into the game...');
        }

        $location.path('/game/play/' + data.game_id);
      });
    }
})();
