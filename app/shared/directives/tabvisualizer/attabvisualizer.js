'use strict';

/**
 * @ngdoc directive
 * @name angularTabs.directive:atLink
 * @description
 * # atLink
 */
angular.module('angularTabs')
    .directive('atTabVisualizer', ['atTabManager', function (atTabManager) {
        return {
            restrict: 'E',
            scope: {
                tabGroupName: '@tabGroupName',
            },
            controller: ['$scope', function ($scope) {
                $scope.tabGroup = atTabManager.getTabGroup($scope.tabGroupName);
                $scope.tabs = $scope.tabGroup.getTabs();
                $scope.staticTabs = $scope.tabGroup.getStaticTabs();
            }],
            link: function ($scope, elem, attrs) {},
            templateUrl: 'shared/directives/tabvisualizer/attabvisualizer.html'
        };
    }]);