'use strict';

/**
 * @ngdoc overview
 * @name angularTabs
 * @description
 * # angularTabs
 *
 * Main module of the application.
 */
angular
  .module('angularTabs', []);

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
                templateUrl: '@templateUrl'
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
            template: '<ng-include src="templateUrl"></ng-include>'
        };
    }]);
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
'use strict'

/**
 * @ngdoc service
 * @name angularTabs.atTabGroupFactory
 * @description
 * # atTabGroupFactory
 * Service in the angularTabs.
 */
angular.module('angularTabs')
    .factory('atTabGroupFactory', function () {
        /**
         *
         */
        function TabGroup(tabGroupName) {
            var STATIC = 0;
            var DYNAMIC = 1;

            var tabGroupName = tabGroupName;

            var currentActiveTab = '';
            //Stores actual tab and maintain order
            var tabs = [];
            //Static tabs are tabs which cannot be closed
            var staticTabs = [];
            //For quick lookup
            var staticTabTitles = {};
            var tabTitles = {};

            /**
             *
             */
            function tabExists(tabTitle) {
                return tabTitle in tabTitles || tabTitle in staticTabTitles;
            };

            /**
             *
             */
            function indexOfTab(tabTitle) {
                var i;
                for (i = 0; i < tabs.length; i++) {
                    if (tabTitle === tabs[i].title) {
                        break;
                    }
                }
                return i;
            };

            /**
             *
             */
            function addTab(tab, tabType) {
                if (tabExists(tab.title)) {
                    throw "Tab " + tab.title + " already exists in " + tabGroupName;
                }
                if (tabType == STATIC) {
                    staticTabs.push(tab);
                    staticTabTitles[tab.title] = '';
                } else {
                    tabs.push(tab);
                    tabTitles[tab.title] = '';
                }
            };

            /**
             *
             */
            function addTabs(m_tabs, tabType) {
                for (var i = 0; i < m_tabs.length; i++) {
                    if (tabExists(m_tabs[i].title)) {
                        throw "Tab " + m_tabs[i].title + " already exists in " + tabGroupName;
                    }
                }
                
                if(tabType == STATIC){
                    for (var i = 0; i < m_tabs.length; i++) {
                        staticTabs.push(m_tabs[i]);
                        staticTabTitles[m_tabs[i].title] = '';
                    }
                }else{
                    for(var i = 0; i < m_tabs.length; i++){
                        tabs.push(m_tabs[i]);
                        tabTitles[m_tabs[i].title] = '';
                    }
                }
            };

            /**
             *
             */
            this.getTabGroupName = function () {
                return tabGroupName;
            };

            /**
             *
             */
            this.addTab = function (tab) {
                addTab(tab, DYNAMIC);
            };
            
            /**
            *
            */
            this.addTabAndActivate = function(tab){
                addTab(tab, DYNAMIC);
                currentActiveTab = tab;
            };

            /**
             *
             */
            this.addTabs = function (m_tabs) {
                addTabs(m_tabs, DYNAMIC);
            };

            /**
             *
             */
            this.addStaticTab = function (staticTab) {
                addTab(staticTab, STATIC);
            };

            /**
             *
             */
            this.addStaticTabs = function (m_tabs) {
                addTabs(m_tabs, STATIC);
            };

            /**
             *
             */
            this.removeTab = function (tab) {
                if (!tabExists(tab.title)) {
                    throw "Tab " + tab.tit.e + " does not exist in " + tabGroupName;
                }
                if (tab.title in staticTabTitles) {
                    throw "Tab " + tab.title + " cannot be remove in " + tabGroupName + " because it is static";
                }

                var i = indexOfTab(tab.title);

                tabs.splice(i, 1);

                delete tabTitles[tab.title];

                if (tab.title === currentActiveTab.title) {
                    if (i == 0) {
                        if (staticTabs.length > 0) {
                            currentActiveTab = staticTabs[staticTabs.length - 1];
                        } else {
                            currentActiveTab = tabs[0];
                        }
                    } else {
                        currentActiveTab = tabs[i - 1];
                    }
                }
            };


            /**
             *
             */
            this.getTabs = function () {
                return tabs;
            };

            /**
             *
             */
            this.getStaticTabs = function () {
                return staticTabs;
            };

            /**
             *
             */
            this.activateTab = function (tab) {
                if (!tabExists(tab.title)) {
                    throw "Tab " + tab.title + " does not exist in " + tabGroupName;
                }

                currentActiveTab = tab;
            };

            /**
             *
             */
            this.isTabActive = function (tab) {
                return currentActiveTab.title === tab.title;
            };

            /**
             *
             */
            this.getCurrentActiveTab = function () {
                return currentActiveTab;
            };
        };

        var createTabGroup = function (tabGroupName) {
            return new TabGroup(tabGroupName);
        };

        return {
            createTabGroup: createTabGroup
        };
    });
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