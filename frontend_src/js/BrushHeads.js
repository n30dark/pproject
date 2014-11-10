var $                = require('jquery');
var TweenMax         = require('tweenmax');
var Backbone         = require('backbone');
var AnalyticsTracker = require('./plugins/AnalyticsTracker');

module.exports = Backbone.View.extend({
    activeIndex: 0,
    snapPoints: [],
    currentCollection: null,
    currentBrushhead: null,
    currentPack: null,

    ui: {},

    events: {
        'click .brushhead-pack-btn': 'clickBrushHeadPack',
        'click .retailer': 'clickRetailer'
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

    clickRetailer: function(e) {
        var retailer = $(e.currentTarget);

        if (retailer.attr('data-id') === 'philips') {
            AnalyticsTracker.trackProduct('buy_at_philips', retailer.attr('data-ctn'));
        } else {
            AnalyticsTracker.trackProduct('buy_at_others', retailer.attr('data-ctn'), retailer.attr('data-id'));
        }
    },

    clickBrushHeadPack: function(e) {
        this.currentPack = $(e.currentTarget);
        var that = this;
        var brushPackCol = this.currentPack.closest('.brushhead');

        var brushpack = brushPackCol.find('.brushpack[data-id="' + that.currentPack.attr('data-id') + '"]');

        if (brushpack.hasClass('active')) return;
        brushpack.addClass('active');

        AnalyticsTracker.trackConversion('interaction', this.currentPack.attr('data-name').replace('-', '_') + '_' + this.currentPack.attr('data-pack'));
        AnalyticsTracker.trackAjax('retail_store_results_' + this.currentPack.attr('data-ctn'));

        if (brushPackCol.hasClass('active')) {
            this.currentBrushhead = brushPackCol;
            this.switchBrushHeadPack(brushpack);
        } else {
            TweenMax.to(this.currentBrushhead.find('.brushpack-collection'), 0.5, {
                height: 0
            });

            TweenMax.to(brushPackCol.find('.brushpack-collection'), 0.5, {
                height: brushPackCol.find('.brushpack-collection')[0].scrollHeight,
                onComplete: function() {
                    brushPackCol.find('.brushpack-collection').height('auto');
                    that.currentBrushhead = brushPackCol;

                    that.switchBrushHeadPack(brushpack);
                }
            });
        }
    },

    switchBrushHeadPack: function(brushpack) {
        this.ui.brushHeadPackBtns.removeClass('active');
        this.currentPack.addClass('active');

        this.ui.brushHeads.removeClass('active');
        this.currentBrushhead.addClass('active');

        this.ui.brushHeadPacks.removeClass('active');
        brushpack.addClass('active');

        this.positionArrow();
    },

    positionArrow: function(duration) {
        if (!this.currentPack.length) return;
        TweenMax.to(this.ui.arrow, (duration !== undefined) ? duration : 0.5, {
            x: this.currentPack.offset().left - this.currentBrushhead.offset().left + this.currentPack.outerWidth() /
                2,
            force3D: true
        });
    },

    selectBrush: function(id) {
        var that = this;
        var el = this.$('#brushheads-' + id);
        TweenMax.to(el, 0, {
            opacity: 0,
            force3D: true
        });

        TweenMax.to(this.currentCollection, 0.5, {
            opacity: 0,
            force3D: true,
            onComplete: function() {
                that.currentCollection.removeClass('active');
                el.addClass('active');

                TweenMax.to(el, 0.5, {
                    opacity: 1,
                    force3D: true,
                    onComplete: function() {
                        that.init();
                    }
                });
            }
        });
    }
});
