;(function() {
  'use strict';

  angular.module('app')
    .directive('pageFooter', pageFooter);

  function pageFooter() {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'app/page-footer/page-footer.html'
    }
  }
}());
