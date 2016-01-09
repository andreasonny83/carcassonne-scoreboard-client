(function() {
  'use strict';

  angular
    .module('app')
    .controller('HomeController', HomeController);

  HomeController.$inject = ['$location', '$mdDialog'];

  /* @ngInject */
  function HomeController($location, $mdDialog) {
    var vm = this;

    vm.newGame = function() {
      $location.path('/game/new/');
    }

    vm.joinGame = function() {
      $mdDialog.show({
        templateUrl: 'app/dialogs/join.html',
        controller: 'JoinDialogController',
        controllerAs: 'joinCtrl',
        onComplete: function(scope, element, options) {
          document.querySelector('#join_game_uid').focus();
          scope.ready = true;
        }
      });
    }
  }
})();
