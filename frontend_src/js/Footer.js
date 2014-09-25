var Backbone = require('backbone');

module.exports = Backbone.View.extend({
    events: {
        'click .footer-selectsite .footer-title': 'toggleSelectSite'
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
    }
});