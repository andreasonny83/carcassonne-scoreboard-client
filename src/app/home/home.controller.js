(function() {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    HomeController.$inject = ['$location'];

    /* @ngInject */
    function HomeController($location) {
      var vm = this;

      vm.newGame = function() {
        $location.path('/game/new/');
      }
    }
})();
