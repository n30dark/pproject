var rAF = require('./plugins/rAF.js');
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var FooterView = require('./Footer');

rAF.init();

window.app = _.extend({}, Backbone.Events);

var $window = $(window);

$window.scroll(function() {
    window.requestAnimationFrame(function() {
        app.trigger('scroll', $window.scrollTop());
    });
});

$window.resize(function() {
    window.requestAnimationFrame(function() {
        app.trigger('resize', {
            width: $window.width(),
            height: $window.height()
        });
    });
});

$(document).click(function() {
    app.trigger('document:click');
});

new FooterView({
    el: $('.footer')
});