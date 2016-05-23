'use strict';

/**
 * @ngdoc directive
 * @name angularTabs.directive:atLink
 * @description
 * # atLink
 */
angular.module('angularTabs')
    .directive('atLink', ['atTabManager', function (atTabManager) {
        return {
            restrict: 'EA',
            scope: {
                title: '@title',
                template: '@template',
                tabGroup: '@tabGroup',
                args: '=args'
            },
            link: function (scope, elem, attrs) {
                elem.bind('click', function () {
                    var tabGroup = atTabManager.getTabGroup(scope.tabGroup);
                    var tab = {
                        title: scope.title,
                        template: scope.template,
                        args: scope.args
                    };
                    try {
                        tabGroup.addTabAndActivate(tab);
                    }catch(err){
                        //Does nothing
                    }
                });
            }
        };
    }]);