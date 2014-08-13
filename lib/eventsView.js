/*global angular*/

/**
 * This directive displays a list of events. The events are gathered from the
 * events service and filtered by the given filtering object.
 *
 * @attr {expression} filter Object used as query filter for the event service.
 */
angular.module('eventsView').directive('eventsView', [
	'eventService', '$filter',
	function (eventService, $filter) {

		return {
			scope: {
				indicatorId: '='
			},
			link: function (scope, element, attributes) {
				var events = scope.events = [],
					limit = 5, //Default number of events to display
					orderFilter = $filter('orderBy'),
					humanDateFilter = $filter('humanDate'),
					filterExpression = attributes.filter,
					query;

				/**
				 * Generates data for view:
				 *  - A new events array containing data for table
				 *  - A showLoadMoreLink to control the display of the link
				 */
				function updateEvents() {

					scope.showLoadMoreLink =
						query && query.length > limit;

					if (!query) {
						scope.events = [];
						return;
					}


					var lastWithDate = -1,
						events;

					// Let's create copies with the correct properties
					events = scope.events = query
						.slice(0, limit)
						.map(function (originalEvent) {
							return {
								description: originalEvent.description,
								type: originalEvent.type,
								createdBy: originalEvent.createdBy,
								humanDate: humanDateFilter(originalEvent.date, 'dd.MM'),
								rows: 0
							};
						});

					// Now we have to count rows and remove "in between" dates
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

				// The service might have updated the query
				scope.$watchCollection(
					function () {
						return query;
					},
					updateEvents
				);

				// New filter expression?
				scope.$watchCollection(filterExpression, function (filter) {
					query = eventService.query(filter);
				});


				/**
				 * Loads more items (5 by default).
				 */
				scope.loadMore = function (amount) {
					limit += amount || 5;
					updateEvents();
				};


			},
			template: require('./events.html')
		};
	}
]);

