'use strict';

/**
 * @ngdoc service
 * @name angularTabs.atTabManager
 * @description
 * # atTabManager
 * Service in the angularTabs.
 */
angular.module('angularTabs')
    .service('atTabManager', ['atTabGroupFactory', '$rootScope', function (atTabGroupFactory, $rootScope) {

        //Tab groups group tags by name
        var tabGroups = {};

        /**
         *
         */
        var tabGroupExists = function (tabGroupName) {
            return tabGroupName in tabGroups;
        };

        var errorMessage = function (tabGroupName, message) {
            return "Tab group " + tabGroupName + " " + message;
        };

        /**
         *
         */
        var initializeTabGroup = function (tabGroupName, tabInitParam) {
            if (tabGroupExists(tabGroupName)) {
                throw "Tab group " + tabGroupName + " already exists";
            }
            tabGroups[tabGroupName] = atTabGroupFactory.createTabGroup(tabGroupName);

            if (angular.isArray(tabInitParam['dynamicTabs'])) {
                tabGroups[tabGroupName].addTabs(tabInitParam['dynamicTabs']);
                tabGroups[tabGroupName].activateTab(tabInitParam['dynamicTabs'][0]);
            }

            if (angular.isArray(tabInitParam['staticTabs'])) {
                tabGroups[tabGroupName].addStaticTabs(tabInitParam['staticTabs']);
                tabGroups[tabGroupName].activateTab(tabInitParam['staticTabs'][0]);
            }
        };

        /**
         *
         */
        var getTabGroup = function (tabGroupName) {
            if (!tabGroupExists(tabGroupName)) {
                throw errorMessage(tabGroupName, "does not exist");
            }

            return tabGroups[tabGroupName];
        };

        return {
            initializeTabGroup: initializeTabGroup,
            getTabGroup: getTabGroup
        };

    }]);