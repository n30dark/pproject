/* global Cubic */

var $ = require('jquery');
var TweenMax = require('tweenmax');
var Backbone = require('backbone');
var AnalyticsTracker = require('./plugins/AnalyticsTracker');

module.exports = Backbone.View.extend({
    activeIndex: 0,
    snapPoints: [],

    ui: {},

    events: {
        'click .brush': 'clickBrush',
        'click .btn-prev': 'clickNavPrev',
        'click .btn-next': 'clickNavNext',
        'click .brush-indicator': 'clickIndicator'
    },

    initialize: function() {
        this.ui.nav = this.$('.brushes-list');
        this.ui.navItems = this.$('.brush');
        this.ui.indicators = this.$('.brush-indicator');
        this.ui.navPrev = this.$('.btn-prev');
        this.ui.navNext = this.$('.btn-next');

        this.activeIndex = this.ui.navItems.index(this.$('.brushes-list .active'));
        this.calcSnapPoints();
        this.positionNavItems(0, 0);

        this.listenTo(app, 'resize', this.onResize);
    },

    /**
     * Listen to the resize event.
     */
    onResize: function() {
        this.calcSnapPoints();
        this.positionNavItems(0, 0);
    },

    clickBrush: function(e) {
        var item = $(e.currentTarget);

        AnalyticsTracker.trackConversion('interaction', 'image_' + item.attr('data-name').replace('-', '_'));
        AnalyticsTracker.trackAjax(item.attr('data-name').replace('-', '_'));

        this.toggleItem(item);
    },

    clickIndicator: function(e) {
        var item    = $(e.currentTarget),
            index   = this.ui.indicators.index(item),
            navItem = this.ui.navItems.eq(index),
            number  = index + 1;

        AnalyticsTracker.trackConversion('interaction', 'carrousel_' + number + '_' + navItem.attr('data-name').replace('-', '_'));
        AnalyticsTracker.trackAjax('homepage:' + navItem.attr('data-name').replace('-', '_'));

        this.toggleItem(navItem);
    },

    /**
     * Go to the previous link.
     */
    clickNavPrev: function(e) {
        e.preventDefault();

        var prev = this.$('.brushes-list .active').prev();

        AnalyticsTracker.trackConversion('interaction', 'navigation_left_' + prev.attr('data-name').replace('-', '_'));
        AnalyticsTracker.trackAjax('homepage:' + prev.attr('data-name').replace('-', '_'));

        if (prev.length) this.toggleItem(prev);
    },

    /**
     * Go to the next link.
     */
    clickNavNext: function(e) {
        e.preventDefault();

        var next = this.$('.brushes-list .active').next();

        AnalyticsTracker.trackConversion('interaction', 'navigation_right_' + next.attr('data-name').replace('-', '_'));
        AnalyticsTracker.trackAjax('homepage:' + next.attr('data-name').replace('-', '_'));

        if (next.length) this.toggleItem(next);
    },

    toggleItem: function(item) {
        this.activeIndex = this.ui.navItems.index(item);

        app.trigger('select:brush', item.attr('data-id'));

        // Handle nav buttons.
        this.ui.navPrev.toggleClass('disabled', this.activeIndex === 0);
        this.ui.navNext.toggleClass('disabled', this.activeIndex === this.ui.navItems.length - 1);

        // Toggle the active links.
        this.ui.navItems.removeClass('active');
        item.addClass('active');

        this.ui.indicators.removeClass('active');
        this.ui.indicators.eq(this.activeIndex).addClass('active');

        this.positionNavItems();
    },

    calcSnapPoints: function() {
        var firstItem = this.ui.navItems.first();
        this.snapPoints = [];

        for (var i = 0; i < this.ui.navItems.length; i++) {
            this.snapPoints.push(this.calcNavItemOffset(firstItem, i));
        }
    },

    /**
     * Calculate the nav item's location relative to the active index.
     */
    calcNavOffset: function(item, activeIndex) {
        var index = this.ui.navItems.index(item),
            step = (app.size.width < 768) ? this.$el.outerWidth() / 3 : 160;

        return (index - activeIndex) * step;
    },

    calcNavItemOffset: function(item, activeIndex) {
        return this.calcNavOffset(item, activeIndex) - (item.outerWidth() / 2);
    },

    /**
     * Position all the navigation items.
     */
    positionNavItems: function(offset, duration) {
        var that = this;
        offset = (!offset) ? 0 : offset;
        duration = (undefined === duration) ? 0.5 : duration;

        this.ui.navItems.each(function() {
            TweenMax.to(this, duration, {
                x: that.calcNavItemOffset($(this), that.activeIndex) + offset,
                ease: Cubic.easeOut,
                force3D: true
            });
        });
    }
});
