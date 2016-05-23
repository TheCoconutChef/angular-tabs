'use strict';

/**
 * @ngdoc directive
 * @name angularTabs.directive:atLink
 * @description
 * # atLink
 */
angular.module('angularTabs')
    .directive('atTabList', ['atTabManager', function (atTabManager) {
        return {
            restrict: 'E',
            scope: {
                tabGroupName: '@tabGroupName',
            },
            controller: ['$scope', function ($scope) {
                $scope.tabGroup = atTabManager.getTabGroup($scope.tabGroupName);
                $scope.staticTabs = $scope.tabGroup.getStaticTabs();
                $scope.tabs = $scope.tabGroup.getTabs();

                /**
                 *
                 */
                $scope.activate = function (tab) {
                    $scope.tabGroup.activateTab(tab);
                };

                /**
                 *
                 */
                $scope.close = function (tab) {
                    $scope.tabGroup.removeTab(tab);
                };
            }],
            link: function ($scope, elem, attrs) {},
            templateUrl: 'shared/directives/tablist/attablist.html'
        };
    }]);