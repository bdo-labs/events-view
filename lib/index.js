
/**
 * Module dependencies.
 */
require('angular');
require('services');
require('filters');

/**
 * Expose indicator-events.
 */
module.exports = angular.module('indicatorEvents', ['services', 'filters']);

require('./indicatorEvents.js');
