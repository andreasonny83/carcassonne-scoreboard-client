(function() {
  'use strict';
  angular.module('contentEditable',[]);
})();

(function() {
  'use strict';
  angular.module('contentEditable')
    .directive('contentEditable', function () {
      return {
        restrict: 'A',
        transclude: true,
        scope: {
          player: '=player'
        },
        template: '<div ng-transclude></div>',
        link: function (scope, element, attrs) {
          console.log(scope.player);
        }
      }
    });
})();

// (function () {
//   'use strict';
//   angular.module('contentEditable')
//     .directive('contentEditable', function () {
//       return {
//         scope: {
          // editableText: '=',
          // editMode: '=',
          // placeholder: '@',
          // onChange: '&'
        // },
        // transclude: true,
        // template: '<span ng-class="{\'is-placeholder\': placeholder && !editingValue}">' +
        // '<input ng-show="isEditing" ng-blur="isEditing=false;" ng-keypress="($event.which === 13) && (isEditing = false)" ng-model="editingValue" placeholder="{{placeholder}}"/>' +
        // '<span ng-hide="isEditing || isWorking" class="original-text" tabindex="0" ng-click="isEditing=true" ng-focus="isEditing=true;">{{placeholder ? (editingValue ? editingValue : placeholder) : editingValue}}</span>' +
        // '<span ng-hide="isEditing" ng-transclude></span>' +
        // '<span ng-show="isWorking" class=""></span>' +
        // '</span>',
        // link: function (scope, elem, attrs) {
          // var input = elem.find('input'),
          //   lastValue;
          //
          // scope.isEditing = !!scope.editMode;
          //
          // scope.editingValue = scope.editableText;
          //
          // elem.addClass('gg-editable-text');
          //
          // scope.$watch('isEditing', function (val, oldVal) {
          //   var editPromise, inputElm = input[0];
          //   if (attrs.editMode !== undefined) {
          //     scope.editMode = val;
          //   }
          //   elem[val ? 'addClass' : 'removeClass']('editing');
          //   if (val) {
          //     inputElm.focus();
          //     inputElm.selectionStart = inputElm.selectionEnd = scope.editingValue ? scope.editingValue.length : 0;
          //     //fix for FF
          //   }
          //   else {
          //     if (attrs.onChange && val !== oldVal && scope.editingValue != lastValue) {
          //       //accept promise, or plain function..
          //       editPromise = scope.onChange({value: scope.editingValue});
          //       if (editPromise && editPromise.then) {
          //         scope.isWorking = true;
          //         editPromise.then(function (value) {
          //           scope.editableText = scope.editingValue = value;
          //           scope.isWorking = false;
          //         }, function () {
          //           scope.editingValue = scope.editableText;
          //           scope.isWorking = false;
          //         });
          //       }
          //       else if (editPromise) scope.editableText = scope.editingValue = editPromise;
          //       else scope.editingValue = scope.editableText;
          //     }
          //     else scope.editableText = scope.editingValue;
          //   }
          // });
          //
          // scope.$watch('editMode', function (val) {
          //   scope.isEditing = !!val;
          // });
          //
          // scope.$watch('editableText', function (newVal) {
          //   lastValue = newVal;
          //   scope.editingValue = newVal;
          // });
    //     }
    //   }
    // });
// })();
