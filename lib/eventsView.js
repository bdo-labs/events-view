angular.module('eventsView').directive('eventsView', [
	'indicatorService', '$filter',
	function (indicatorService, $filter) {

		return {
			scope: {
				indicatorId: '='
			},
			link: function (scope, element, attributes) {
				var events = scope.events = [],
					limit = 5, //Default number of events to display
					orderFilter = $filter('orderBy'),
					humanDateFilter = $filter('humanDate');


				/**
				 * Loads more items (5 by default).
				 */
				scope.loadMore =
				function loadMore(amount) {
					limit += amount || 5;
					updateEvents();
				}


				scope.indicator = indicatorService.get(
					scope.indicatorId
				);

				/**
				 * Generates data for view:
				 *  - A new events array containing data for table
				 *  - A showLoadMoreLink to control the display of the link
				 */
				function updateEvents() {
					var indicatorEvents = scope.indicator.events;

					scope.showLoadMoreLink =
						indicatorEvents && indicatorEvents.length > limit;

					events.slice(0, events.length);

					if (!indicatorEvents) {
						return;
					}


					var lastWithDate = -1;

					events = scope.events = indicatorEvents
						.sort(function (a, b) {
							return b.date - a.date;
						})
						.slice(0, Math.min(limit, indicatorEvents.length))
						.map(function (originalEvent) {
							return {
								description: originalEvent.description,
								type: originalEvent.type,
								createdBy: originalEvent.createdBy,
								humanDate: humanDateFilter(originalEvent.date, 'dd.MM'),
								rows: 0
							}
						});

					events.forEach(function (value, i) {
							if (lastWithDate > -1 &&
									events[i].humanDate === events[lastWithDate].humanDate) {

								events[i].humanDate = null;
								events[lastWithDate + 1].rows++;

							} else {
								lastWithDate = i;
							}
						});

				}

				scope.$watchCollection('indicator.events', updateEvents);
			},
			template: require('./events.html')
		};
	}
]);

