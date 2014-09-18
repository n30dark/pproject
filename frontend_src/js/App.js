var rAF = require('./plugins/rAF.js');
var $   = require('jquery');

rAF.init();

var $window = $(window);

$window.scroll(function() {
    window.requestAnimationFrame(function() {
        console.log($window.scrollTop());
    });
});

$window.resize(function() {
    window.requestAnimationFrame(function() {
        console.log({
            width: $window.width(),
            height: $window.height()
        });
    });
});
