/**
 * Test the directivë
 */

describe('Indicator events directive', function () {
	var indicatorEventsModuleDirective,
		$compile,
		scope,
		mockIndicatorService = {
			get: function (id) {
				return {id: id};
			}
		};

	function compileDirective(id) {
		var element = $compile(
				'<div indicator-events-module="" indicator-id="' + id + '"></div>'
			)(scope);

		scope.$digest();

		return element;
	}

	beforeEach(function () {

		module('indicatorEvents');

		module(function ($provide) {
			$provide.value('indicatorService', mockIndicatorService);
		});

		inject(function (_indicatorEventsModuleDirective_, _$compile_, $rootScope) {
			indicatorEventsModuleDirective = _indicatorEventsModuleDirective_;
			$compile = _$compile_;
			scope = $rootScope.$new();
		});

	});

	it('should exist', function () {
		expect(indicatorEventsModuleDirective).toBeTruthy();
	});

	it('should ask service for correct indicator', function () {
		spyOn(mockIndicatorService, 'get').andCallThrough();

		compileDirective(334)

		expect(mockIndicatorService.get).toHaveBeenCalledWith(334);
	});

	it('should add events array to its scope', function () {
		var events = compileDirective(334).isolateScope().$eval('events');

		expect(angular.isArray(events)).toBe(true);
	});

	it('should limit the number of items to 5 by default', function () {
		spyOn(mockIndicatorService, 'get').andReturn({
			events: [{},{},{},{},{},{},{},{},{},{},{},{},{}]
		});

		var events = compileDirective(334).isolateScope().$eval('events');

		expect(events.length).toBe(5);
	});
	
	it('should add more items when loadMore() is called', function () {
		spyOn(mockIndicatorService, 'get').andReturn({
			events: [{},{},{},{},{},{},{},{},{},{},{},{},{}]
		});

		var isolateScope = compileDirective(334).isolateScope(),
			events;

		isolateScope.loadMore();

		events = isolateScope.$eval('events');

		expect(events.length).toBeGreaterThan(5);
	});

	it('should update when the model changes', function () {
		var mockIndicator = {
			events: [{},{},{},{},{},{},{},{},{},{},{},{},{}]
		};
		
		spyOn(mockIndicatorService, 'get').andReturn(mockIndicator);

		var isolateScope = compileDirective(334).isolateScope(),
			events;

		mockIndicator.events.splice(0);
		scope.$digest();

		events = isolateScope.$eval('events');

		expect(events.length).toBe(0);
	});

	it('should sort, sum rows and remove dates correctly', function () {
		spyOn(mockIndicatorService, 'get').andReturn({
			events: [
				{date: new Date(2014, 9, 12)},
				{date: new Date(2014, 9, 12)},
				{date: new Date(2014, 4, 2)},
				{date: new Date(2014, 3, 24)},
				{date: new Date(2014, 9, 12)},
				{date: new Date(2014, 3, 24)},
				{date: new Date(2014, 3, 24)},
				{date: new Date(2014, 9, 12)},
				{date: new Date(2014, 4, 2)}
			]
		});

		var isolateScope = compileDirective(334).isolateScope(),
			events,
			numberOfDates = 0;

		isolateScope.loadMore();
		events = isolateScope.$eval('events');

		events.forEach(function (value) {
			numberOfDates += !!value.date;
		});

		expect(events[0].date).not.toBeNull();
		expect(events[4].date).not.toBeNull();
		expect(events[6].date).not.toBeNull();

		expect(numberOfDates).not.toBe(3);
		
		expect(events[1].rows).toBe(3);
		expect(events[5].rows).toBe(1);
		expect(events[7].rows).toBe(2);
	});
	
	
});
