/**
 * Handle transition and animation endings for different browsers.
 *
 * Based on bootstrap's transitions: http://getbootstrap.com/javascript/#transitions
 */
module.exports = {
    transEndEventNames: {
        'WebkitTransition': 'webkitTransitionEnd',
        'MozTransition':    'transitionend',
        'OTransition':      'oTransitionEnd otransitionend',
        'transition':       'transitionend'
    },

    animEndEventNames: {
        'WebkitAnimation': 'webkitAnimationEnd',
        'MozAnimation':    'animationend',
        'MsAnimation':     'MSAnimationEnd',
        'OAnimation':      'oanimationend',
        'animation':       'animationend'
    },

    /**
     * Emulate the end event when it is time.
     */
    _emulateEnd: function($element, eventName, duration) {
        var called = false;

        $element.one(eventName, function() {
            called = true;
        });

        setTimeout(function() {
            if (!called) $element.trigger(eventName);
        }, duration);

        return this;
    },

    /**
     * Check support and retrieve the right event name.
     */
    supportTransitionEnd: function() {
        return this.transEndEventNames[Modernizr.prefixed('transition')];
    },

    supportAnimationEnd: function() {
        return this.animEndEventNames[Modernizr.prefixed('animation')];
    },

    /**
     * Emulate the transition end.
     */
    emulateTransitionEnd: function ($element, duration) {
        return this._emulateEnd($element, this.supportTransitionEnd(), duration);
    },

    emulateAnimationEnd: function ($element, duration) {
        return this._emulateEnd($element, this.supportAnimationEnd(), duration);
    },

    /**
     * On complete handler.
     */
    transitionComplete: function($element, callback) {
        if (this.supportTransitionEnd()) {
            $element.one(this.supportTransitionEnd(), function() {
                callback();
            });

            this.emulateTransitionEnd($element, $element.css('transition-duration').slice(0, -1) * 1000);
        } else {
            callback();
        }
    },

    animationComplete: function($element, callback) {
        if (this.supportAnimationEnd()) {
            $element.one(this.supportAnimationEnd(), function() {
                callback();
            });

            this.emulateAnimationEnd($element, $element.css('animation-duration').slice(0, -1) * 1000);
        } else {
            callback();
        }
    }
};
