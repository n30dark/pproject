var $                = require('jquery');
var Backbone         = require('backbone');
var AnalyticsTracker = require('./plugins/AnalyticsTracker');

module.exports = Backbone.View.extend({
    events: {
        'click .footer-selectsite .footer-title': 'toggleSelectSite',
        'click .footer-share a': 'clickShare'
    },

    ui: {},

    initialize: function() {
        this.ui.selectSite = this.$('.footer-selectsite');

        this.listenTo(app, 'document:click', this.closeSelectSite);
    },

    toggleSelectSite: function(e) {
        e.stopPropagation();
        this.ui.selectSite.toggleClass('active');
    },

    closeSelectSite: function() {
        this.ui.selectSite.removeClass('active');
    },

    clickShare: function(e) {
        AnalyticsTracker.trackService('follow_us', $(e.currentTarget).attr('data-name'));
    }
});
