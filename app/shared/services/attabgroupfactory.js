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
                            currentActiveTab = staticTabs[0];
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