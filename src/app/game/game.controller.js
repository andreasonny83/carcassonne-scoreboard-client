(function() {
    'use strict';

    angular
        .module('app')
        .controller('GameController', GameController);

    GameController.$inject = ['$scope', '$location', '$routeParams', '$mdToast', '$mdDialog', 'gameType', 'socket'];

    /* @ngInject */
    function GameController($scope, $location, $routeParams, $mdToast, $mdDialog, gameType, socket) {
      var vm = this,
          new_game = {
            name: 'New game',
            players: [],
            meeples: ['red', 'green', 'blue', 'yellow', 'black', 'gray'],
            max_players: 6
          };

      activate();

      function activate() {
        switch (gameType) {
          case 'new':
            console.log('newGame');
            vm.game = new_game;
            break;
          case 'setup':
            console.log('initSetup');
            vm.game_id = $routeParams.gameID || null;
            socket.emit('game:get', vm.game_id);
            break;
          case 'play':
            console.log('initPlay');
            vm.game_id = $routeParams.gameID || null;
            socket.emit('game:get', vm.game_id);
            break;
          default:
        }
      }

      vm.addPlayer = function() {
        if ( vm.game.players.length >= vm.game.max_players ) {
          $mdToast.showSimple('Maximum players reached.');
          return false;
        }

        vm.game.players.push({
          name: 'Player',
          email: null,
          color: assignRndMeeple(),
          gravatar: 'https://secure.gravatar.com/avatar/',
          score: 0
        });
      }

      vm.removePlayer = function(key) {
        if ( vm.game.players.length > 0 ) {
          vm.game.players.splice(key, 1);
        }
      }

      vm.editPlayer = function(key) {
        vm.game.players[key].email_buffer = vm.game.players[key].email;
        vm.game.players[key].name_buffer = vm.game.players[key].name;
        vm.game.players[key].color_buffer = vm.game.players[key].color;

        vm.game.players[key].editMode = true;
      }

      vm.saveEdit = function(key) {
        if ( vm.game.players[key].email !== vm.game.players[key].email_buffer ) {
          // vm.game.players[key].gravatar = gameService.getGravatar(vm.game.players[key].email_buffer);
        }
        vm.game.players[key].email = vm.game.players[key].email_buffer;
        vm.game.players[key].name = vm.game.players[key].name_buffer;
        vm.game.players[key].color = vm.game.players[key].color_buffer;

        vm.game.players[key].editMode = false;
      }

      vm.cancelEdit = function(key) {
       vm.game.players[key].editMode = false;
      }

      vm.startGame = function() {
        socket.emit('game:start', {game_id: vm.game_id, game: vm.game});
      }

      vm.addPoints = function() {
        $mdDialog.show({
          template:
            '<md-dialog id="add-points-dialog">' +
            '  <form ng-submit="addPoints(AddPoints.points)">' +
            '    <md-dialog-content>' +
            '      <h3>Add points</h3>' +
            '      <md-input-container>' +
            '        <label>points</label>' +
            '        <input id="input_points" ng-model="AddPoints.points" type="number" min="0" max="99" required>' +
            '      </md-input-container>' +
            '    </md-dialog-content>' +
            '    <md-dialog-actions>' +
            '      <md-button ng-click="cancel()" type="button">Cancel</md-button>' +
            '      <md-button type="submit" class="md-primary">Add</md-button>' +
            '    </md-dialog-actions>' +
            '  </form>' +
            '</md-dialog>',
          locals: {
            _game_id: vm.game_id,
            _game: vm.game
          },
          controller: DialogController,
          onComplete: function(scope, element, options) {
            document.getElementById('input_points').focus();
            scope.ready = true;
          }
        });
      }

      DialogController.$inject = ['$scope', '$mdDialog', '_game_id', '_game'];

      function DialogController( $scope, $mdDialog, _game_id, _game ) {
        $scope.cancel = function() {
          $mdDialog.hide();
        }

        $scope.addPoints = function( points ) {
          if ( ! $scope.ready ) return;
          $scope.ready = false;

          socket.emit('game:score', {
            game_id: _game_id,
            game: _game,
            points:points
          });
          $mdDialog.hide();
        }
      }

      vm.nextPlayer = function() {
        var player = playerSelected();

        vm.game.players[player].selected = false;

        if ( player < vm.game.players.length - 1 ) {
          vm.game.players[player+1].selected = true;
        }
        else {
          vm.game.players[0].selected = true;
        }
      }

      vm.manualEdit = function() {
        console.log('manualEdit');
      }

      vm.deleteGame = function() {
        var alert = $mdDialog.confirm({
            title: 'Delete current game',
            textContent: 'Are you sure you want to delete this game?',
            ok: 'Yes',
            cancel: 'No'
          });

        $mdDialog.show( alert ).then(function() {
          $location.path('#/');
        });
      }

      /**
       * add the scroll to the table when the log is too long
       * fix the table to make it responsive
       * scroll the table to the bottom to display the last log
       *
       * @param  [Object] game
       */
      function fixTable(game) {
        // add scrollfix class to the table-body in order to limit the logs in the table
        var table_body = document.getElementById("table-body");
        if ( game.logs.length >= 2 && table_body.className.indexOf('mobile-scrollfix') === -1 ) {
          table_body.className = table_body.className + " mobile-scrollfix";
        }
        if ( game.logs.length >= 6 && table_body.className.indexOf(' scrollfix') === -1 ) {
          table_body.className = table_body.className + " scrollfix";
        }

        // scroll the table-body to the last score
        table_body.querySelector('.scrollable').scrollTop = table_body.querySelector('.scrollable').scrollHeight;
      }

      /**
       * updateScore
       */
      function updateScore() {
        var game = vm.game,
            re = /^\+([0-9]+)/;

        for (var i = 0; i < game.players.length; i++) {
          game.players[i].score = 0;

          for (var j = 0; j < game.logs.length; j++) {
            if ( re.test( game.logs[j][i+1].toString() ) ) {
              game.players[i].score += parseInt(game.logs[j][i+1].toString());
            }
          }
        }

        setTimeout(fixTable, 100, game);
      }

      /**
       * Return the selected player
       */
      function playerSelected() {
        var i;

        for ( i = 0; i < vm.game.players.length; i++ ) {
          if ( vm.game.players[i].selected ) {
            return i;
          }
        }

        return -1;
      }

      /**
       * return a random meeple
       */
      function assignRndMeeple() {
        var index = Math.floor( Math.random() * vm.game.meeples.length ),
            color = vm.game.meeples[index];

        return color;
      }

      // Socket listeners
      // ================
      //
      // $scope.$on('$destroy', function (event) {
      //   console.log('listener destroyed');
      //   socket.removeAllListeners();
      // });

      socket.on('game:get', function (data) {
        console.log('received: game:get');
        if ( data.error || ! data.game ) {
          $mdToast.showSimple('The game you\'re trying to reach is missing. Redirecting to the home page...');
          setTimeout(function(){
            $location.path('#/');
          }, 1500);
        }
        vm.game = data.game;
        updateScore();
      });

      socket.on('game:update', function (data) {
        console.log('received: game:update on: ' + data.game_id);
        console.log('user game id: ' + vm.game_id);
        if ( data.game_id === vm.game_id ) {
          vm.game = data.game;
          $mdToast.showSimple('Game information updated.');
          updateScore();
        }
      });

      // ================
    }
})();
