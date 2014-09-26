var rAF = require('./plugins/rAF.js');
var $ = require('jquery');
var _ = require('underscore');
var Backbone = require('backbone');

var BrushesView = require('./Brushes');
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

    new BrushesView({
        el: $('.brushes')
    });

    new FooterView({
        el: $('.footer')
    });
});