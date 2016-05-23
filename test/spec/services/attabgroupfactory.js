'use strict';

describe('Service: atTabManager', function () {

    // load the service's module
    beforeEach(module('angularTabs'));

    // instantiate service
    var atTabGroupFactory, tabGroup;
    beforeEach(inject(function (_atTabGroupFactory_) {
        atTabGroupFactory = _atTabGroupFactory_;
    }));

    beforeEach(function () {
        tabGroup = atTabGroupFactory.createTabGroup('tabGroup');
    });

    it('creates a tab group with the proper name', function () {
        var tabGroupName = 'a name';
        var tabGroup = atTabGroupFactory.createTabGroup(tabGroupName);
        expect(tabGroup.getTabGroupName()).toEqual(tabGroupName);
    });

    it('adds a tab', function () {
        var tab = {
            title: 'title',
            template: 'some template'
        };
        tabGroup.addTab(tab);
        expect(tabGroup.getTabs()[0]).toEqual(tab);
    });

    it('adds tab in bulk', function () {
        var tabs = [
            {
                title: 'tab_1'
            },
            {
                title: 'tab_2'
            }
        ];

        tabGroup.addTabs(tabs);

        expect(tabGroup.getTabs().length).toEqual(2);
    });

    it('throws an error if tries to add tab with the same title', function () {
        var tab = {
            title: 'tab'
        };

        tabGroup.addTab(tab);

        expect(function () {
            tabGroup.addTab(tab);
        }).toThrow();
    });

    it('removes a tab', function () {
        var tab = {
            title: 'tab'
        };

        tabGroup.addTab(tab);
        tabGroup.removeTab(tab);

        expect(tabGroup.getTabs.length).toBe(0);
    });

    it('throws an error if it tries to remove a tab which does not exists', function () {
        var nonExistantTab = {
            title: 'tab'
        };

        expect(function () {
            tabGroup.removeTab(nonExistantTab);
        }).toThrow();
    });

    it('activate a tab', function () {
        var tab = {
            title: 'tab'
        };

        var nonActivatedTab = {
            title: 'non activated'
        };

        tabGroup.addTab(tab);
        tabGroup.addTab(nonActivatedTab);
        tabGroup.activateTab(tab);

        expect(tabGroup.isTabActive(tab)).toBeTruthy();
        expect(tabGroup.isTabActive(nonActivatedTab)).not.toBeTruthy();
    });

    it('activate previous tab upon closing of a tab', function () {
        var firstTab = {
            title: 'firstTab'
        };
        var secondTab = {
            title: 'secondTab'
        };
        tabGroup.addTab(firstTab);
        tabGroup.addTab(secondTab);
        tabGroup.activateTab(secondTab);
        tabGroup.removeTab(secondTab);

        expect(tabGroup.isTabActive(firstTab)).toBeTruthy();
    });

    it('activate right most static tab upon closing of left most dynamic tab', function () {
        var leftMostDynamicTab = {
            title: 'tab'
        };
        var staticTab = {
            title: 'staticTab'
        };

        tabGroup.addStaticTab(staticTab);
        tabGroup.addTab(leftMostDynamicTab);
        tabGroup.activateTab(leftMostDynamicTab);
        tabGroup.removeTab(leftMostDynamicTab);

        expect(tabGroup.isTabActive(staticTab)).toBeTruthy();
    });

    it('adds static tab', function () {
        var staticTab = {
            title: 'staticTab'
        };
        tabGroup.addStaticTab(staticTab);

        expect(tabGroup.getStaticTabs()[0]).toEqual(staticTab);
    });

    it('adds static tab in bulk', function () {
        var tabs = [
            {
                title: 'tab_1'
            },
            {
                title: 'tab_2'
            }
        ];

        tabGroup.addStaticTabs(tabs);

        expect(tabGroup.getStaticTabs().length).toEqual(2);
    });

    it('throws an error if it tries to add a static tab with the same name', function () {
        var staticTab = {
            title: 'staticTab'
        };

        tabGroup.addStaticTab(staticTab);
        expect(function () {
            tabGroup.addStaticTab(staticTab);
        }).toThrow();
    });

    it('throws an error if it tries to remove a static tab', function () {
        var staticTab = {
            title: 'staticTab'
        };

        tabGroup.addStaticTab(staticTab);

        expect(function () {
            tabGroup.removeTab(staticTab);
        }).toThrow();
    });
});