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
            restrict: 'EA',
            scope: {
                tabGroupName: '@tabGroupName',
                templateUrl: '@templateUrl'
            },
            controller: ['$scope', function ($scope) {
                $scope.tabGroup = atTabManager.getTabGroup($scope.tabGroupName);
                $scope.tabs = $scope.tabGroup.getTabs();
                $scope.staticTabs = $scope.tabGroup.getStaticTabs();
            }],
            template: '<ng-include src="templateUrl"></ng-include>'
        };
    }]);