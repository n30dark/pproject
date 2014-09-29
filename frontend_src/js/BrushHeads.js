var $ = require('jquery');
var TweenMax = require('tweenmax');
var Backbone = require('backbone');

module.exports = Backbone.View.extend({
    activeIndex: 0,
    snapPoints: [],
    currentCollection: null,
    currentBrushhead: null,
    currentPack: null,

    ui: {},

    events: {
        'click .brushhead-pack-btn': 'clickBrushHeadPack'
    },

    initialize: function() {
        this.ui.brushHeadCollection = this.$('.brushhead-collection');

        this.init();
    },

    init: function() {
        this.ui.arrow = this.ui.brushHeadCollection.find('.brushpack-arrow');

        this.currentCollection = this.$('.brushhead-collection.active');
        this.currentBrushhead = this.currentCollection.find('.brushhead.active');
        this.currentPack = this.currentCollection.find('.brushhead-pack-btn.active');

        this.ui.brushHeadPackBtns = this.currentCollection.find('.brushhead-pack-btn');
        this.ui.brushHeadPacks = this.currentCollection.find('.brushpack');
        this.ui.brushHeads = this.currentCollection.find('.brushhead');

        this.listenTo(app, 'resize', this.onResize);
        this.listenTo(app, 'select:brush', this.selectBrush);

        this.positionArrow(0);
    },

    /**
     * Listen to the resize event.
     */
    onResize: function() {
        this.positionArrow();
    },

    clickBrushHeadPack: function(e) {
        this.currentPack = $(e.currentTarget);
        this.currentBrushhead = this.currentPack.closest('.brushhead');

        this.ui.brushHeadPackBtns.removeClass('active');
        this.currentPack.addClass('active');

        this.ui.brushHeads.removeClass('active');
        this.currentBrushhead.addClass('active');

        this.ui.brushHeadPacks.removeClass('active');
        this.currentBrushhead.find('.brushpack[data-id="' + this.currentPack.attr('data-id') + '"]')
            .addClass('active');

        this.positionArrow();
    },

    positionArrow: function(duration) {
        TweenMax.to(this.ui.arrow, (duration !== undefined) ? duration : 0.5, {
            x: this.currentPack.offset().left - this.currentBrushhead.offset().left + this.currentPack.outerWidth() /
                2,
            force3D: true
        });
    },

    selectBrush: function(id) {
        this.ui.brushHeadCollection.removeClass('active');
        this.$('#brushheads-' + id).addClass('active');

        this.init();
    }
});