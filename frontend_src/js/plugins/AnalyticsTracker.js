/* global ga */

var _ = require('underscore');

var AnalyticsTracker = function() {

};

_.extend(AnalyticsTracker.prototype, {
    /**
     * Track the page.
     * @param {string} url
     * @param {string} title
     */
    trackPageview: function (url, title) {
        if (typeof ga === 'undefined') return;

        ga('send', 'pageview', {
            'page':  url,
            'title': title || null
        });
    },

    /**
     * Track the event.
     * @param {string} category
     * @param {string} action
     * @param {string} label
     * @param {int} value
     */
    trackEvent: function (callback, category, action, label, value) {
        if (typeof ga === 'undefined') {
            if (callback) callback();
            return;
        }

        ga('send', 'event', {
            eventCategory: category,
            eventAction:   action,
            eventLabel:    label || null,
            eventValue:    value || null,
            hitCallback:   (callback) ? callback : null
        });
    }
});

module.exports = new AnalyticsTracker();
