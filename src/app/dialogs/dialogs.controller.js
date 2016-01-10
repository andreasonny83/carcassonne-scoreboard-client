(function() {
  'use strict';

  angular
    .module('app')
    .controller('JoinDialogController', JoinDialogController)
    .controller('ShareDialogController', ShareDialogController)
    .controller('PointsController', PointsController);

  JoinDialogController.$inject = [ '$location', '$mdDialog'];

  ////////////////////////
  // JhareDialogController
  //
  function JoinDialogController( $location, $mdDialog) {
    var vm = this;

    vm.cancel = function() {
      $mdDialog.hide();
    }

    vm.joinGame = function( game_id ) {
      $location.path('/game/play/' + game_id);
      $mdDialog.hide();
    }
  }

  ShareDialogController.$inject = ['$mdDialog', '$mdToast', '_game_id'];

  ////////////////////////
  // ShareDialogController
  //
  function ShareDialogController( $mdDialog, $mdToast, _game_id ) {
    var vm = this;
    vm.shareDialogEmail = null;

    vm.cancel = function() {
      $mdDialog.hide();
    }

    vm.shareLink = function(email) {
      vm.disable_elements = true;

      emailjs.send("gmail", "carcassonne_scoreboard", {
        email: email,
        carcassonneLink: "http://carcassonne.sonnywebdesign.com/#/game/play/" + _game_id,
        gameId: _game_id
      })
      .then(function(response) {
        $mdToast.showSimple('Email correctly sent.');
        $mdDialog.hide();
      }, function(err) {
        $mdToast.showSimple('An error occurred. Please check the email recipient and try again.');
        $mdDialog.hide();
      });
    }
  }

  PointsController.$inject = ['$scope', '$mdDialog', '_game_id', '_game', '_player_selected', 'socket'];

  ////////////////////////
  // PointsController
  //
  function PointsController( $scope, $mdDialog, _game_id, _game, _player_selected, socket ) {
    var vm = this;

    for (var i = 0; i < _game.players.length; i++) {
      if ( i === _player_selected ) {
        vm.player_name = _game.players[i].name;
      }
    }

    vm.cancel = function() {
      $mdDialog.hide();
    }

    vm.addPoints = function( points ) {
      if ( ! $scope.ready ) return;
      $scope.ready = false;

      if ( ! _game_id || ! _game ) {
        // no game available
        $mdToast.showSimple('Cannot find any data for updating this game.');
        $mdDialog.hide();
        return;
      }

      // send a requewst to the server side to update the player score
      socket.emit('game:score', {
        game_id: _game_id,
        game: _game,
        points: points,
        player_selected: _player_selected
      });

      $mdDialog.hide();
    }
  }

})();
