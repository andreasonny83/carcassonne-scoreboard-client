/**
 * carcassonne-scoreboard-client
 *
 * @author    Andrea Sonny <andreasonny83@gmail.com>
 * @license   MIT
 *
 * https://andreasonny.mit-license.org/
 *
 */
(function() {
  'use strict';

  angular.module('app')
    .directive('pageHeader', pageHeader);

  function pageHeader() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/page-header/page-header.html'
    }
  }
}());
