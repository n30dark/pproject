var $ = require('jquery');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({
    events: {
        'click .p-small-nav': 'toggleNavbar',
        'click .p-left-bar': 'toggleNavbar',
        'click .p-topbar .p-search input': 'openSearch',
        'click .p-topbar .p-search button': 'openSearch'
    },

    ui: {},

    initialize: function() {
        this.ui.page = $('html');
        this.listenTo(app, 'document:click', this.closeSearch);
    },

    toggleNavbar: function(e) {
        e.stopPropagation();
        this.ui.page.toggleClass('p-show-sidebar');
    },

    openSearch: function(e) {
        e.stopPropagation();

        if (!this.$el.hasClass('p-show-search')) {
            e.preventDefault();
        }

        this.$el.toggleClass('p-show-search', true);
    },

    closeSearch: function() {
        this.$el.toggleClass('p-show-search', false);
    }
});