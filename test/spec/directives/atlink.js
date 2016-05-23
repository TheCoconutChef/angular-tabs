'use strict';

describe('Directive: atTabList', function () {

    var element, scope;
    var mockTabManager, mockTabGroup;

    // load the directive's module
    beforeEach(module('angularTabs'));
    beforeEach(module('my.templates'));

    beforeEach(function () {
        //Mock configuration
        mockTabGroup = {
            addTabAndActivate: jasmine.createSpy('addTabAndActivation').and.callFake(function(tab){})
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
        var elem = angular.element('<at-link at-tab-group="a" title="some_title" template="url" args="{}"></at-link>');
        element = $($compile(elem)(scope));
        scope.$digest();
    }));

    it('sends the tab to its tab group once clicked', function () {
        element.triggerHandler('click');
        scope.$digest();
        expect(mockTabGroup.addTabAndActivate).toHaveBeenCalled();
    });
});