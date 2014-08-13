/**
 * Test the directivë
 */

describe('events view', function () {
	var eventsViewModule,
		$compile,
		scope,
		mockEventService = {
			query: function () {
				return [];
			}
		};

	function compileDirective(filter) {
		var element = $compile(
				'<div events-view="" ' +
					(filter ? 'filter="' + filter + '"' : '') +
				'></div>'
			)(scope);

		scope.$digest();

		return element;
	}

	beforeEach(function () {

		module('eventsView');

		module(function ($provide) {
			$provide.value('eventService', mockEventService);
		});

		inject(function (_eventsViewDirective_, _$compile_, $rootScope) {
			eventsViewModule = _eventsViewDirective_;
			$compile = _$compile_;
			scope = $rootScope.$new();
		});

	});

	it('should exist', function () {
		expect(eventsViewModule).toBeTruthy();
	});

	it('should ask service for events', function () {
		spyOn(mockEventService, 'query').andCallThrough();

		compileDirective();

		expect(mockEventService.query).toHaveBeenCalled();
	});

	it('should add events array to its scope', function () {
		var events = compileDirective().isolateScope().$eval('events');

		expect(angular.isArray(events)).toBe(true);
	});

	it('should limit the number of items to 5 by default', function () {
		spyOn(mockEventService, 'query').andReturn(
			[{},{},{},{},{},{},{},{},{},{},{},{},{}]
		);

		var events = compileDirective().isolateScope().$eval('events');

		expect(events.length).toBe(5);
	});
	
	it('should add more items when loadMore() is called', function () {
		spyOn(mockEventService, 'query').andReturn(
			[{},{},{},{},{},{},{},{},{},{},{},{},{}]
		);

		var isolateScope = compileDirective().isolateScope(),
			events;

		isolateScope.loadMore();

		events = isolateScope.$eval('events');

		expect(events.length).toBeGreaterThan(5);
	});

	it('should update when the model changes', function () {
		var mockQuery = [{},{},{},{},{},{},{},{},{},{},{},{},{}];
		
		spyOn(mockEventService, 'query').andReturn(mockQuery);

		var isolateScope = compileDirective().isolateScope(),
			events;

		mockQuery.splice(0, mockQuery.length);
		scope.$digest();

		events = isolateScope.$eval('events');

		expect(events.length).toBe(0);
	});

	it('should sort, sum rows and remove dates correctly', function () {
		spyOn(mockEventService, 'query').andReturn([
			{date: new Date(2014, 9, 12)},
			{date: new Date(2014, 9, 12)},
			{date: new Date(2014, 9, 12)},
			{date: new Date(2014, 9, 12)},
			{date: new Date(2014, 4, 2)},
			{date: new Date(2014, 3, 24)},
			{date: new Date(2014, 3, 24)},
			{date: new Date(2014, 3, 24)}
		]);

		var isolateScope = compileDirective().isolateScope(),
			events,
			numberOfDates = 0;

		isolateScope.loadMore();
		events = isolateScope.$eval('events');

		events.forEach(function (value) {
			numberOfDates += !!value.humanDate;
		});

		expect(events[0].date).not.toBeNull();
		expect(events[4].date).not.toBeNull();
		expect(events[5].date).not.toBeNull();

		expect(numberOfDates).toBe(3);
		
		expect(events[1].rows).toBe(3);
		expect(events[6].rows).toBe(2);
	});
	
	
});
