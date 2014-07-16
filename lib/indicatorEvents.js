angular.module('indicatorEvents').directive('indicatorEventsModule', [
	'indicatorService', '$filter',
	function (indicatorService, $filter) {

		return {
			scope: {
				indicatorId: '='
			},
			link: function (scope, element, attributes) {
				var events = scope.events = [],
					orderFilter = $filter('orderBy'),
					humanDateFilter = $filter('humanDate');

				scope.indicator = indicatorService.get(
					scope.indicatorId
				);

				// We need to remove date from some of the events and add a
				// count for the number of rows the empty ones span across
				scope.$watchCollection('indicator.events', function () {

					events.slice(0, events.length);

					if (!scope.indicator.events) {
						return;
					}


					var originalEvents = orderFilter(scope.indicator.events, '-date'),
						lastWithDate = -1;

					for (var i = 0; i < originalEvents.length; i++) {
						var oe = originalEvents[i],
							humanDate = humanDateFilter(oe.date, 'dd.MM');

						// Make a copy - we don't want to change the model
						events[i] = {
							description: oe.description,
							type: oe.type,
							createdBy: oe.createdBy,
							humanDate: humanDate,
							rows: 1
						};

						if (lastWithDate > -1 && humanDate === events[lastWithDate].humanDate) {
							events[i].humanDate = null;
							events[lastWithDate + 1].rows++;
						} else {
							lastWithDate = i;
						}
					}

				});
			},
			template: require('./indicatorEvents.html')
		};
	}
]);

