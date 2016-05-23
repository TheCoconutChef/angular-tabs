'use strict';

describe('Service: atTabManager', function () {

    var atTabManager;
    var TAB_GROUP_NAME = 'a';

    // load the service's module
    beforeEach(module('angularTabs'));

    // mock tab group factory
    var mockTabGroupFactory, mockTabGroup;
    beforeEach(function () {

        mockTabGroup = {
            tabGroupName: '',
            activateTab: jasmine.createSpy('activateTab').and.callFake(function (tab) {}),
            addTab: jasmine.createSpy('addTab').and.callFake(function (tab) {}),
            addStaticTab: jasmine.createSpy('addStaticTab').and.callFake(function (tab) {}),
            removeTab: jasmine.createSpy('removeTab').and.callFake(function (tab) {}),
            addTabs: jasmine.createSpy('addTabs').and.callFake(function (tabs) {}),
            addStaticTabs: jasmine.createSpy('addStaticTabs').and.callFake(function (tabs) {})
        };

        mockTabGroupFactory = {
            createTabGroup: jasmine.createSpy('createTabGroup').and.callFake(function (tabGroupName) {
                mockTabGroup.tabGroupName = tabGroupName;
                return mockTabGroup;
            }),
        };


        module(function ($provide) {
            $provide.value('atTabGroupFactory', mockTabGroupFactory);
        });
    });

    // instantiate service
    beforeEach(inject(function (_atTabManager_) {
        atTabManager = _atTabManager_;
    }));

    it('initialize a tab group with no tab', function () {
        atTabManager.initializeTabGroup(TAB_GROUP_NAME, {});

        expect(mockTabGroupFactory.createTabGroup).toHaveBeenCalled();

        expect(function () {
            atTabManager.getTabGroup(TAB_GROUP_NAME);
        }).not.toThrow();
    });


    it('initialize a tab group with dynamic tab', function () {
        var firstTab = {
            title: 'tab',
            template: 'url',
            args: {}
        };

        var tabInitParam = {
            staticTabs: [],
            dynamicTabs: [
                firstTab,
                {
                    title: 'other tab',
                    template: 'other url',
                    args: {
                        arg1: 'a'
                    }
                }
            ]
        };

        atTabManager.initializeTabGroup(TAB_GROUP_NAME, tabInitParam);

        expect(mockTabGroupFactory.createTabGroup).toHaveBeenCalledWith(TAB_GROUP_NAME);
        expect(mockTabGroup.addTabs).toHaveBeenCalled();
        expect(mockTabGroup.activateTab).toHaveBeenCalledWith(firstTab);
    });

    it('initialize a tab group with static tab', function () {
        var firstStaticTab = {
            title: 'staticTab',
            template: 'url',
            args: {}
        };

        var tabInitParam = {
            staticTabs: [
                firstStaticTab,
                {
                    title: 'second tab',
                    template: 'url',
                    args: {}
                }
            ]
        };

        atTabManager.initializeTabGroup(TAB_GROUP_NAME, tabInitParam);

        expect(mockTabGroupFactory.createTabGroup).toHaveBeenCalledWith(TAB_GROUP_NAME);
        expect(mockTabGroup.addStaticTabs).toHaveBeenCalled();
        expect(mockTabGroup.activateTab).toHaveBeenCalledWith(firstStaticTab);
    });

    it('initialize a tab group with static and dynamic tab', function () {
        var firstStaticTab = {
            title: 'staticTab',
            template: 'url',
            args: {}
        };

        var tabInitParam = {
            staticTabs: [firstStaticTab],
            dynamicTabs: [
                {
                    title: 'tab',
                    template: 'url',
                    args: {}
                }
            ]
        };

        atTabManager.initializeTabGroup(TAB_GROUP_NAME, tabInitParam);
        
        expect(mockTabGroupFactory.createTabGroup).toHaveBeenCalledWith(TAB_GROUP_NAME);
        expect(mockTabGroup.addStaticTabs).toHaveBeenCalled();
        expect(mockTabGroup.addTabs).toHaveBeenCalled();
        expect(mockTabGroup.activateTab).toHaveBeenCalledWith(firstStaticTab);
    });

    it('throws an error if it tries to initialize a tab group with a name that already exists', function () {
        atTabManager.initializeTabGroup(TAB_GROUP_NAME, {});
        expect(function () {
            atTabManager.initializeTabGroup(TAB_GROUP_NAME, {});
        }).toThrow();
    });

    it('throws an error if it tries to get a tab group that does not exist', function () {
        expect(function(){atTabManager.getTabGroup(TAB_GROUP_NAME);}).toThrow();
    });
});