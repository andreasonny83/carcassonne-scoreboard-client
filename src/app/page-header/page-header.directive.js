;(function() {
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
