(function() {
  'use strict';

  angular
    .module('gameService', [])
    .factory('gameService', factory);

  factory.$inject = ['md5', 'socket'];

  /* @ngInject */
  function factory(md5, socket) {
    var new_game = {
          name: 'New game',
          players: [],
          meeples: ['red', 'green', 'blue', 'yellow', 'black', 'gray'],
          meeple_available: ['red', 'green', 'blue', 'yellow', 'black', 'gray'],
          max_players: 6
        },
        game = null;

    function getGravatar(email) {
      if ( email === null || email === '' ) {
        var url = "https://secure.gravatar.com/avatar/" + md5.createHash( "" + Math.random() ) + "?d=identicon&s=150";
        return url;
      }

      return 'http://www.gravatar.com/avatar/' + md5.createHash(email) + '?s=150';
    }

    function addPlayer() {
      if ( game.players.length >= game.max_players ) {
        return false;
      }

      game.players.push({
        name: 'Player',
        email: null,
        color: assignRndMeeple(),
        gravatar: "https://secure.gravatar.com/avatar/" + md5.createHash( "" + Math.random() ) + "?d=identicon&s=150",
        score: 0
      });

      return true;
    }

    function assignRndMeeple() {
      var index = Math.floor( Math.random() * game.meeple_available.length );

      var color = game.meeple_available[index];
      game.meeple_available.splice(index, 1);

      return color;
    }

    return {
      getGame: getGame,
      getGravatar: getGravatar,
      addPlayer: addPlayer
    };
  }
})();
