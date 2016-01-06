(function() {
    'use strict';

    angular
        .module('app')
        .controller('GameController', GameController);

    GameController.$inject = ['$scope', '$location', '$routeParams', '$mdToast', '$mdDialog', 'gameType', 'socket'];

    /* @ngInject */
    function GameController($scope, $location, $routeParams, $mdToast, $mdDialog, gameType, socket) {
      $scope.gameId = null;
      var new_game = {
            name: 'New game',
            players: [],
            meeples: ['red', 'green', 'blue', 'yellow', 'black', 'gray'],
            meeple_available: ['red', 'green', 'blue', 'yellow', 'black', 'gray'],
            max_players: 6
          };

      if (gameType === 'new') {
        newGame();
      }
      else if (gameType === 'setup') {
        initSetup();
      }
      else if (gameType === 'play') {
        initPlay();
      }

      // Socket listeners
      // ================
      socket.on('game:score_updated', function (logs) {
        // var game = gameService.getGame();
        // game.logs = logs;
        // updateScore();
      });

      socket.on('game:get', function (game) {
        console.log(game);
        console.log('received: game:get');
        $scope.game = Object.create(game);
      });

      function newGame() {
        // new game created
        console.log('newGame');
        $scope.game = Object.create(new_game);
      }

      function initSetup() {
        console.log('initSetup');
        $scope.gameId = $routeParams.gameID || null;
        socket.emit('game:get', $scope.gameId);
      }

      function initPlay() {
        console.log('initPlay');
        $scope.gameId = $routeParams.gameID || null;
        socket.emit('game:get', $scope.gameId);
      }

      function addPlayer() {
        if ( $scope.game.players.length >= $scope.game.max_players ) {
          $mdToast.showSimple('Maximum players reached.');
          return false;
        }

        $scope.game.players.push({
          name: 'Player',
          email: null,
          // color: assignRndMeeple(),
          color: 'red',
          // gravatar: "https://secure.gravatar.com/avatar/" + md5.createHash( "" + Math.random() ) + "?d=identicon&s=150",
          gravatar: null,
          score: 0
        });
      }

      function removePlayer(key) {
        if ( $scope.game.players.length > 0 ) {
          $scope.game.players.splice(key, 1);
        }
      }

      function editPlayer(key) {
        $scope.game.players[key].email_buffer = $scope.game.players[key].email;
        $scope.game.players[key].name_buffer = $scope.game.players[key].name;
        $scope.game.players[key].color_buffer = $scope.game.players[key].color;

        $scope.game.players[key].editMode = true;
      }

      function saveEdit(key) {
        if ( $scope.game.players[key].email !== $scope.game.players[key].email_buffer ) {
          // $scope.game.players[key].gravatar = gameService.getGravatar($scope.game.players[key].email_buffer);
        }
        $scope.game.players[key].email = $scope.game.players[key].email_buffer;
        $scope.game.players[key].name = $scope.game.players[key].name_buffer;
        $scope.game.players[key].color = $scope.game.players[key].color_buffer;

        $scope.game.players[key].editMode = false;
      }

      function cancelEdit(key) {
         $scope.game.players[key].editMode = false;
      }

      function gameReady() {
        socket.emit('game:ready', {players: $scope.game.players, name: $scope.game.name, game_id: $scope.gameId});
      }

      function addPoints() {
        showDialog();
      }

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

      function updateScore() {
        var game = $scope.game,
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

      function showDialog() {
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
          controller: DialogController,
          onComplete: function(scope, element, options) {
            document.getElementById('input_points').focus();
            scope.ready = true;
          }
        });
      }

      DialogController.$inject = ['$scope', '$mdDialog'];

      function DialogController( $scope, $mdDialog ) {
        // var game = gameService.getGame();

        $scope.cancel = function() {
          $mdDialog.hide();
        }

        $scope.addPoints = function(points) {
          if ( ! $scope.ready ) return;
          $scope.ready = false;

          // socket.emit('game:score', {game: game, points:points});

          $mdDialog.hide();
        }
      }

      function playerSelected() {
        var i;

        for ( i = 0; i < $scope.game.players.length; i++ ) {
          if ( $scope.game.players[i].selected ) {
            return i;
          }
        }

        return -1;
      }

      function nextPlayer() {
        var player = playerSelected();

        $scope.game.players[player].selected = false;

        if ( player < $scope.game.players.length - 1 ) {
          $scope.game.players[player+1].selected = true;
        }
        else {
          $scope.game.players[0].selected = true;
        }
      }

      function manualEdit() {
        console.log('manualEdit');
      }

      function deleteGame() {
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

      var vm = {
        // getGravatar: gameService.getGravatar,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        editPlayer: editPlayer,
        saveEdit: saveEdit,
        cancelEdit: cancelEdit,
        gameReady: gameReady,
        deleteGame: deleteGame,
        addPoints: addPoints,
        nextPlayer: nextPlayer,
        manualEdit: manualEdit
      };

      Object.assign(this, vm);
    }
})();
