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
        vm.sharebuttonOpen = true;
        vm.player_selected = 0;
        vm.new_game        = true;
        vm.gameLeader      = 0;
        vm.undoDisabled    = vm.game && vm.game.logs && vm.game.logs.length > 0 ? false : true;

        switch (gameType) {
          case 'new':
            console.log('newGame');
            vm.game = new_game;
            break;
          case 'setup':
            console.log('initSetup');
            vm.game_id   = $routeParams.gameID || null;
            vm.game_id_r = vm.game_id;
            vm.new_game  = false;

            socket.emit('game:get', vm.game_id);
            break;
          case 'play':
            console.log('initPlay');
            vm.game_id   = $routeParams.gameID || null;
            vm.game_id_r = vm.game_id;
            vm.new_game  = false;

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
          color: assignRndMeeple(),
          score: 0
        });
      }

      vm.removePlayer = function(key) {
        if ( vm.game.players.length > 0 ) {
          vm.game.players.splice(key, 1);
        }
      }

      vm.startGame = function() {
        var game_id = vm.game_id || $routeParams.gameID;

        console.log('start game. game: ' + vm.game);
        socket.emit('game:start', {game_id: game_id, game: vm.game});
      }

      vm.nextPlayer = function() {
        if ( vm.player_selected < vm.game.players.length - 1 ) {
          vm.player_selected += 1;
        }
        else {
          vm.player_selected = 0;
        }
      }

      vm.undo = function() {
        var game_id = vm.game_id || $routeParams.gameID;

        console.log('undo');
        socket.emit('game:undo', {game_id: game_id});
      }

      vm.deleteGame = function() {
        var alert = $mdDialog.confirm({
            title: 'Delete current game',
            textContent: 'Are you sure you want to delete this game?',
            ok: 'Yes',
            cancel: 'No'
          });

        $mdDialog.show( alert ).then(function() {
          $location.path('/');
        });
      }

      vm.goTo = function(path) {
        $location.path(path);
      }

      vm.selectID = function($event) {
        $event.target.setSelectionRange(0, $event.target.value.length);
      }

      vm.share = function() {
        var game_id = vm.game_id || $routeParams.gameID;

        $mdDialog.show({
          templateUrl: 'app/dialogs/share.html',
          locals: {
            _game_id: game_id
          },
          controller: 'ShareDialogController',
          controllerAs: 'shareCtrl',
          onComplete: function(scope, element, options) {
            document.getElementById('input_email').focus();
            scope.ready = true;
          }
        });
      }

      vm.addPoints = function() {
        var game_id = vm.game_id || $routeParams.gameID;

        $mdDialog.show({
          templateUrl: 'app/dialogs/points.html',
          locals: {
            _game_id: game_id,
            _game: vm.game,
            _player_selected: vm.player_selected
          },
          controller: 'PointsController',
          controllerAs: 'pointsCtrl',
          onComplete: function(scope, element, options) {
            document.getElementById('input_points').focus();
            scope.ready = true;
          }
        });
      }

      /**
       * tableClick
       *
       * Switch player clicking on the table
       */
      vm.tableClick = function(index) {
        vm.player_selected = index;
      }

      /**
       * add the scroll to the table when the log is too long
       * fix the table to make it responsive
       * scroll the table to the bottom to display the last log
       *
       * @param  [Object] game
       */
      function fixTable(game) {
        var table_body = document.getElementById("table-body");

        if ( ! table_body ) return;

        if ( game.logs.length < 6 && table_body.className.indexOf('scrollfix') ) {
          if ( game.logs.length < 2 ) {
            console.log('removing all scrollfix');
            table_body.className = 'table-body';
          }
          else {
            table_body.className = 'table-body mobile-scrollfix';
          }
        }

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
       * Update the player's scores based on the game log
       */
      function updateScore() {
        var game = vm.game,
            re = /^\+([0-9]+)/,
            game_leader = null,
            game_leader_score = 0;

        for (var i = 0; i < game.players.length; i++) {
          game.players[i].score = 0;

          for (var j = 0; j < game.logs.length; j++) {
            if ( ! game.logs[j][i+1] ) continue;

            if ( re.test( game.logs[j][i+1].toString() ) ) {
              game.players[i].score += parseInt(game.logs[j][i+1].toString());
            }
          }

          if ( game.players[i].score > game_leader_score ) {
            game_leader = i;
            game_leader_score = game.players[i].score;
          }
        }

        vm.gameLeader = game_leader;
        console.log('game leader: ' + vm.gameLeader);

        setTimeout(fixTable, 100, game);
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
      socket.on('game:get', function(data) {
        console.log('received: game:get');

        if ( data.error || ! data.game ) {
          $mdToast.showSimple('The game you\'re trying to reach is missing. Redirecting to the home page...');
          setTimeout(function(){
            $location.path('/');
          }, 1500);
        }

        vm.game = data.game;
        vm.undoDisabled = vm.game.logs.length > 0 ? false : true;
        updateScore();
      });

      socket.on('game:ready', function (data) {
        console.log('received: game:ready');

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

      socket.on('game:update', function (data) {
        console.log('received: game:update on: ' + data.game_id);
        console.log('user game id: ' + game_id);

        var game_id = vm.game_id || $routeParams.gameID;

        if (data.error) {
          console.log('game:update error');
          $mdToast.showSimple('Cannot update the current game. Please try again.');
          return;
        }

        if ( data.game_id === game_id ) {
          var game_id = game_id || $routeParams.gameID;
          $mdToast.showSimple('Game information updated.');

          vm.game = data.game;
          updateScore();
        }

        vm.undoDisabled = vm.game.logs.length > 0 ? false : true;
      });
    }
})();
