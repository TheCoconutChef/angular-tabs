'use strict';

describe('Directive: atTabList', function () {

    var TAB_GROUP_NAME = 'A';
    var TEMPLATE_URL = 'test/res/attablist.html';
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
        var elem = angular.element('<at-tab-list at-tab-group="' + TAB_GROUP_NAME + '" template-url="' + TEMPLATE_URL + '"></at-tab-list>');
        element = $($compile(elem)(scope));
        scope.$digest();
    }));

    it('correctly mark as activated that tab which is activated', function () {
        expect(element.find('#at-tab-staticTab').hasClass('at-tab-active')).toBeTruthy();
    });

    it('correctly close a tab', function () {
        element.find('#at-tab-tab1 .at-tab-close').triggerHandler('click');
        scope.$digest();
        expect(mockTabGroup.removeTab).toHaveBeenCalled();
        expect(element.find('.at-tab-dynamic').length).toBe(1);
    });

    it('changes the activation status on click', function () {
        element.find('#at-tab-tab1').triggerHandler('click');
        scope.$digest();
        expect(element.find('#at-tab-staticTab').hasClass('at-tab-active')).toBe(false);
        expect(element.find('#at-tab-tab1').hasClass('at-tab-active')).toBeTruthy();
    });
});