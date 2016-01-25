/**
 * Angular boilerplate
 *
 * @author    Andrea Zornada <andreasonny83@gmail.com>
 * @license   MIT
 *
 */
(function() {

  angular
    .module('app', [
      'ngRoute',
      'ngAnimate',
      'ngMaterial',
      'socket'
    ])
    .config(config)
    .run(run);

  config.$inject = ['$locationProvider', '$routeProvider'];

  /**
   * App routing
   *
   * You can leave it here in the config section or take it out
   * into separate file
   *
   */
  function config($locationProvider, $routeProvider) {
    // $locationProvider.html5Mode(false).hashPrefix('!');

    // routes
    $routeProvider
      .when( '/', {
        templateUrl: 'app/home/home.html',
        controller: 'HomeController',
        controllerAs: 'homeCtrl'
      })
      .when( '/game/setup/:gameID', {
        templateUrl: 'app/game/game.html',
        controller: 'GameController',
        controllerAs: 'gameCtrl',
        resolve: {
          gameType:  function() {
            return 'setup';
          }
        }
      })
      .when( '/game/new/', {
        templateUrl: 'app/game/game.html',
        controller: 'GameController',
        controllerAs: 'gameCtrl',
        resolve: {
          gameType:  function() {
            return 'new';
          }
        }
      })
      .when( '/game/play/:gameID', {
        templateUrl: 'app/game/game-play.html',
        controller: 'GameController',
        controllerAs: 'gameCtrl',
        resolve: {
          gameType:  function() {
            return 'play';
          }
        }
      })
      .when( '/privacy-policy', {
        templateUrl: 'app/privacy/privacy.html'
      })
      .otherwise({
        redirectTo: '/'
      });
  }

  function run() {
    console.log('App ready.');
  }
})();
