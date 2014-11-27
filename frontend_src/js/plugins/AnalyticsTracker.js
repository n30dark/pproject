/* global philips */

var _ = require('underscore');

var AnalyticsTracker = function() {

};

_.extend(AnalyticsTracker.prototype, {
    /**
     * Track the conversion.
     * @param {string} name
     * @param {string} description
     */
    trackConversion: function (name, description) {
        if (typeof philips === 'undefined') return;

        philips.analytics.trackConversion({
            name: name,
            descripton: description
        });
    },

    /**
     * Track the product conversion.
     * @param {string} name
     * @param {string} products
     */
    trackProduct: function (name, products, shopname) {
        if (typeof philips === 'undefined') return;

        var options = {
            name: name,
            products: products
        };

        if (shopname) {
            options.shopname = shopname;
        }

        philips.analytics.trackConversion(options);
    },

    /**
     * Track the service conversion.
     * @param {string} name
     * @param {string} servicename
     */
    trackService: function (name, servicename) {
        if (typeof philips === 'undefined') return;

        philips.analytics.trackConversion({
            name: name,
            servicename: servicename
        });
    },

    /**
     * Track the ajax.
     * @param {string} pagename
     */
    trackAjax: function (pagename) {
        if (typeof philips === 'undefined') return;

        philips.analytics.trackAjax({
            pagename: pagename,
            type: 'o'
        });
    }
});

module.exports = new AnalyticsTracker();
