var rAF = require('./plugins/rAF.js');
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var HeaderView = require('./Header');
var BrushesView = require('./Brushes');
var BrushHeadsView = require('./BrushHeads');
var FooterView = require('./Footer');

$(document).ready(function() {
    rAF.init();

    window.app = _.extend({}, Backbone.Events);

    var $window = $(window);

    $window.scroll(function() {
        window.requestAnimationFrame(function() {
            app.trigger('scroll', $window.scrollTop());
        });
    });

    app.size = {
        width: $window.width(),
        height: $window.height()
    };

    $window.resize(function() {
        window.requestAnimationFrame(function() {
            app.size = {
                width: $window.width(),
                height: $window.height()
            };

            app.trigger('resize', app.size);
        });
    });

    $(document).click(function() {
        app.trigger('document:click');
    });

    new HeaderView({
        el: $('.p-n01-header')
    });

    new BrushesView({
        el: $('.brushes')
    });

    new BrushHeadsView({
        el: $('.brushheads')
    });

    new FooterView({
        el: $('.footer')
    });
});