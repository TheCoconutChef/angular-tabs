'use strict'

/**
 * @ngdoc directive
 * @name angularTabs.partial
 * @description 
 * # partial
 * A directive loading a template with arguments args
 */
angular.module('angularTabs')
    .directive('partial', function() {
        return {
            restrict: 'E',
            scope: {
                args: '=args',
                template: '@template'
            },
            replace: true,
            template: '<div ng-include="template"></div>',
        };
    });