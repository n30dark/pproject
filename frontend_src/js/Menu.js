// /* global Cubic */
//
// var $ = require('jquery');
// var _ = require('underscore');
// var Hammer = require('hammerjs');
// var TweenMax = require('tweenmax');
// var Marionette = require('backbone.marionette');
// var AppEvent = require('../../events/AppEvent');
// var AnalyticsTracker = require('../../AnalyticsTracker');
//
// module.exports = Marionette.ItemView.extend({
//     isOpened: false,
//     isOpaque: false,
//     hammer: null,
//     activeIndex: 0,
//     snapPoints: [],
//
//     ui: {
//         nav: '.nav',
//         navItems: '.nav li',
//         button: '.navbar-toggle',
//         backLink: '.navbar-breadcrumb-back',
//         currentLabel: '.navbar-breadcrumb-current-label',
//         navPrev: '.navbar-prev',
//         navNext: '.navbar-next',
//         navbarCount: '.navbar-count'
//     },
//
//     events: {
//         'click @ui.button':    'clickToggleMenu',
//         'click .navbar-brand': 'clickBrand',
//         'click .contents-btn': 'clickContents',
//         'click .features-btn': 'clickFeatures',
//         'click .packages-btn': 'clickPackages',
//         'click .editions-btn': 'clickEditions',
//         'click .about-btn':    'clickAbout',
//         'click @ui.navPrev':   'clickNavPrev',
//         'click @ui.navNext':   'clickNavNext'
//     },
//
//     initialize: function() {
//         this.isOpened = this.$el.hasClass('navbar-open');
//         this.isOpaque = this.$el.hasClass('navbar-opaque');
//
//         this.listenTo(app.vent, AppEvent.SCROLL, this.onScroll);
//         this.listenTo(app.state, 'change:viewportSize', this.onResize);
//         this.listenTo(app.state, 'change:currentPage', this.updateActive);
//         this.listenTo(app.state, 'change:showingMenuContent', this.toggleNav);
//         this.listenTo(app.state, 'change:showingSubMenuContent', this.toggleSubNav);
//     },
//
//     onShow: function() {
//         this.activeIndex = this.ui.navItems.index(this.$('.nav .active'));
//
//         if (app.state.get('viewportSize').width < 768) {
//             this.setupMobile();
//         }
//     },
//
//     /**
//      * Listen to the scroll event.
//      */
//     onScroll: function(scrollTop) {
//         this.$el.toggleClass('navbar-compact', (scrollTop > 50));
//         this.$el.toggleClass('navbar-opaque', (this.isOpaque && scrollTop <= 50));
//     },
//
//     /**
//      * Listen to the resize event.
//      */
//     onResize: function() {
//         if (app.state.get('viewportSize').width < 768) {
//             this.setupMobile();
//         } else {
//             this.ui.navItems.each(function() {
//                 TweenMax.to(this, 0.5, {
//                     x: 0,
//                     force3D: true
//                 });
//             });
//         }
//     },
//
//     /**
//      * Setup the mobile navigation.
//      */
//     setupMobile: function() {
//         this.calcSnapPoints();
//         this.positionNavItems(0, 0);
//
//         if (this.hammer !== null) return;
//
//         this.hammer = new Hammer(this.ui.nav.get(0), {
//             pan: Hammer.DIRECTION_HORIZONTAL
//         });
//
//         this.hammer.on('drag', _.bind(this.panNav, this));
//         this.hammer.on('dragend', _.bind(this.panEndNav, this));
//     },
//
//     /**
//      * Force toggling the menu when a user clicks.
//      */
//     clickToggleMenu: function(e) {
//         e.preventDefault();
//         var url = app.edition.spreads.first().url();
//
//         this.isOpened = !this.isOpened;
//
//         if (this.isOpened) {
//             url = this.$('.nav li:first-child a').attr('href');
//             this.$el.toggleClass('navbar-open', true);
//
//             AnalyticsTracker.trackEvent(function() {
//                 app.router.navigate(url, {
//                     trigger: true
//                 });
//             }, 'interface', 'openMenu');
//         } else {
//             this.$el.toggleClass('navbar-open', false);
//
//             AnalyticsTracker.trackEvent(function() {
//                 app.router.navigate(url, {
//                     trigger: true
//                 });
//             }, 'interface', 'terugNaarMagazine');
//         }
//     },
//
//     /**
//      * Handle link clicks.
//      */
//     clickLink: function(e) {
//         e.preventDefault();
//
//         app.router.navigate($(e.currentTarget).attr('href'), {
//             trigger: true
//         });
//     },
//
//     clickBrand: function(e) {
//         var that = this;
//         AnalyticsTracker.trackEvent(function() {
//             that.clickLink(e);
//         }, 'menu', 'terugNaarCover');
//     },
//
//     clickContents: function(e) {
//         var that = this;
//         AnalyticsTracker.trackEvent(function() {
//             that.clickLink(e);
//         }, 'menu', 'toInhoud');
//     },
//
//     clickFeatures: function(e) {
//         var that = this;
//         AnalyticsTracker.trackEvent(function() {
//             that.clickLink(e);
//         }, 'menu', 'toDiensten');
//     },
//
//     clickPackages: function(e) {
//         var that = this;
//         AnalyticsTracker.trackEvent(function() {
//             that.clickLink(e);
//         }, 'menu', 'toPakketten');
//     },
//
//     clickEditions: function(e) {
//         var that = this;
//         AnalyticsTracker.trackEvent(function() {
//             that.clickLink(e);
//         }, 'menu', 'toEdities');
//     },
//
//     clickAbout: function(e) {
//         var that = this;
//         AnalyticsTracker.trackEvent(function() {
//             that.clickLink(e);
//         }, 'menu', 'toOver');
//     },
//
//     /**
//      * Go to the previous link.
//      */
//     clickNavPrev: function() {
//         var pageModel = app.state.get('currentPage');
//         if (pageModel.isFirst()) return;
//
//         var previous = pageModel.collection.getPrevious(pageModel);
//
//         AnalyticsTracker.trackEvent(function() {
//             app.router.navigate(previous.url(), {
//                 trigger: true
//             });
//         }, 'menu', 'previous');
//     },
//
//     /**
//      * Go to the next link.
//      */
//     clickNavNext: function() {
//         var pageModel = app.state.get('currentPage');
//         if (pageModel.isLast()) return;
//
//         var previous = pageModel.collection.getNext(pageModel);
//
//         AnalyticsTracker.trackEvent(function() {
//             app.router.navigate(previous.url(), {
//                 trigger: true
//             });
//         }, 'menu', 'next');
//     },
//
//     /**
//      * Handle touch panning.
//      */
//     panNav: function(e) {
//         this.positionNavItems(e.gesture.deltaX);
//     },
//
//     /**
//      * Handle the touch panning end.
//      */
//     panEndNav: function(e) {
//         var velocity = this.$el.width() * 0.04 * e.gesture.velocityX,
//             currentIndex = 0,
//             currentItem = this.ui.navItems.first(),
//             currentOffset = this.calcNavItemOffset(currentItem, this.activeIndex),
//             newOffset;
//
//         if (e.gesture.deltaX > 0) {
//             newOffset = currentOffset + e.gesture.deltaX + velocity;
//         } else {
//             newOffset = currentOffset + e.gesture.deltaX - velocity;
//         }
//
//         _.each(this.snapPoints, function(val, key) {
//             if (val >= newOffset) {
//                 currentIndex = key;
//                 currentItem = this.ui.navItems.eq(key);
//             }
//         }, this);
//
//         this.activeIndex = currentIndex;
//         this.ui.navItems.removeClass('active');
//         currentItem.addClass('active');
//         this.positionNavItems();
//
//         app.router.navigate(currentItem.find('a').attr('href'), {
//             trigger: true
//         });
//     },
//
//     calcSnapPoints: function() {
//         var firstItem = this.ui.navItems.first();
//         this.snapPoints = [];
//
//         for (var i = 0; i < this.ui.navItems.length; i++) {
//             this.snapPoints.push(this.calcNavItemOffset(firstItem, i));
//         }
//     },
//
//     /**
//      * Calculate the nav item's location relative to the active index.
//      */
//     calcNavOffset: function(item, activeIndex) {
//         var index = this.ui.navItems.index(item),
//             step = this.$el.outerWidth() / 2.5;
//
//         return (index - activeIndex) * step;
//     },
//
//     calcNavItemOffset: function(item, activeIndex) {
//         return this.calcNavOffset(item, activeIndex) - (item.outerWidth() / 2);
//     },
//
//     /**
//      * Position all the navigation items.
//      */
//     positionNavItems: function(offset, duration) {
//         var that = this;
//         offset = (!offset) ? 0 : offset;
//         duration = (undefined === duration) ? 0.5 : duration;
//
//         this.ui.navItems.each(function() {
//             TweenMax.to(this, duration, {
//                 x: that.calcNavItemOffset($(this), that.activeIndex) + offset,
//                 ease: Cubic.easeOut,
//                 force3D: true
//             });
//         });
//     },
//
//     /**
//      * Toggle the navigation.
//      */
//     toggleNav: function() {
//         this.isOpened = app.state.get('showingMenuContent') === true;
//         this.$el.toggleClass('navbar-open', this.isOpened);
//     },
//
//     /**
//      * Toggle the subnavigation.
//      */
//     toggleSubNav: function() {
//         this.$el.toggleClass('navbar-open-sub', app.state.get('showingSubMenuContent') === true);
//     },
//
//     /**
//      * Update the menu with data of the active page.
//      */
//     updateActive: function() {
//         var that = this;
//         var pageModel = app.state.get('currentPage');
//         var url = pageModel.url();
//
//         // Handle spreads.
//         if (pageModel.collection) {
//             this.ui.navbarCount.text((pageModel.getIndex() + 1) + ' / ' + pageModel.collection.length);
//             this.ui.navPrev.toggleClass('disabled', pageModel.isFirst());
//             this.ui.navNext.toggleClass('disabled', pageModel.isLast());
//         }
//
//         // Cover has a transparent navbar.
//         this.isOpaque = pageModel.collection && pageModel.isFirst();
//         this.$el.toggleClass('navbar-opaque', this.isOpaque);
//
//         // Set the submenu when needed.
//         if (app.state.get('showingSubMenuContent') === true) {
//             this.ui.backLink
//                 .attr('href', '')
//                 .text('');
//             this.ui.currentLabel.text('');
//         }
//
//         // Toggle the active links.
//         this.$('.nav li').removeClass('active');
//         this.$('.nav li a').each(function() {
//             var el = $(this);
//
//             if (el.attr('href') === url) {
//                 var item = el.parent();
//                 that.activeIndex = that.ui.navItems.index(item);
//                 item.addClass('active');
//
//                 if (app.state.get('viewportSize').width < 768) {
//                     that.positionNavItems();
//                 }
//             }
//         });
//     }
// });
