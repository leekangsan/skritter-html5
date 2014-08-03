/**
 * @module Application
 */
define([
    "framework/GelatoPage",
    "requirejs.text!templates/home.html"
], function(GelatoPage, template) {
    return GelatoPage.extend({
        /**
         * @class ViewHome
         * @extends GelatoView
         * @constructor
         */
        initialize: function() {},
        /**
         * @property title
         * @type String
         */
        title: "Home",
        /**
         * @method render
         * @returns {GelatoPage}
         */
        render: function() {
            this.$el.html(this.compile(template));
            return this;
        }
    });
});
