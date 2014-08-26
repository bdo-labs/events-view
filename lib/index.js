
/**
 * Module dependencies.
 */
require('angular');
require('services');
require('filters');

/**
 * Expose indicator-events.
 */
module.exports = angular.module('eventsView', ['services', 'filters']);

require('./eventsView.js');

