angular.module('indicatorEvents').directive('indicatorEventsModule', [
	'indicatorService',
	function (indicatorService) {

		return {
			scope: {
				indicatorId: '='
			},
			link: function (scope, element, attributes) {
				scope.indicator = indicatorService.get(
					scope.indicatorId
				);
			},
			template: require('./indicatorEvents.html')
		};
	}
]);

