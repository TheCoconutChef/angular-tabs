'use strict';

describe('Directive: atTabList', function () {

    var TAB_GROUP_NAME = 'A';
    var element, scope;
    var mockTabManager, mockTabGroup;

    // load the directive's module
    beforeEach(module('angularTabs'));
    beforeEach(module('my.templates'));

    beforeEach(function () {
        //Mock configuration
        var staticTabs = [
            {
                title: 'staticTab'
            }
        ];

        var tabs = [
            {
                title: 'tab1'
            },
            {
                title: 'tab2'
            }
        ];

        mockTabGroup = {
            tabGroupName: TAB_GROUP_NAME,
            currentActiveTab: staticTabs[0],
            tabs: tabs,
            staticTabs: staticTabs,
            getTabs: jasmine.createSpy('getTabs').and.callFake(function () {
                return this.tabs;
            }),
            getStaticTabs: jasmine.createSpy('getStaticTabs').and.callFake(function () {
                return this.staticTabs;
            }),
            activateTab: jasmine.createSpy('addTab').and.callFake(function (tab) {
                this.currentActiveTab = tab;
            }),
            addStaticTab: jasmine.createSpy('addStaticTab').and.callFake(function (tab) {}),
            removeTab: jasmine.createSpy('removeTab').and.callFake(function (tab) {
                if (tab.title === 'tab1') {
                    this.tabs.splice(0, 1);
                }
            }),
            addTabs: jasmine.createSpy('addTabs').and.callFake(function (tabs) {}),
            addStaticTabs: jasmine.createSpy('addStaticTabs').and.callFake(function (tabs) {}),
            isTabActive: jasmine.createSpy('isTabActive').and.callFake(function (tab) {
                return tab === this.currentActiveTab;
            })
        };

        mockTabManager = {
            getTabGroup: jasmine.createSpy('getTabGroup').and.callFake(function (tabGroupName) {
                return mockTabGroup;
            })
        };

        module(function ($provide) {
            $provide.value('atTabManager', mockTabManager);
        });

    });

    beforeEach(inject(function ($rootScope, $compile) {
        scope = $rootScope.$new();
        var elem = angular.element('<at-tab-visualizer at-tab-group="' + TAB_GROUP_NAME + '"></at-tab-list>');
        element = $($compile(elem)(scope));
        scope.$digest();
    }));

    it('correctly display the activated tab on initialization', function () {
        expect(element.find('#at-tab-content-staticTab').hasClass('ng-hide')).toBe(false);
    });

    it('correctly changes the tab to be shown when changed', function () {
        mockTabGroup.currentActiveTab = {
            title: 'tab2'
        };
        scope.$digest();
        expect(element.find('#at-tab-content-staticTab').hasClass('ng-hide')).toBeTruthy();
        expect(element.find('#at-tab-content-tab2').hasClass('ng-hide')).toBeTruthy();
    });
});