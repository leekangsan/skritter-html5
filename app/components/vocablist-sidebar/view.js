var GelatoComponent = require('gelato/component');

/**
 * @class VocablistSideBar
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistSideBar}
     */
    render: function() {
        this.renderTemplate();
        this.$('[data-toggle="tooltip"]').tooltip();
        $.each(this.$('.options a'), function(i, el) {
            if ($(el).attr('href') === document.location.pathname) {
                $(el).addClass('active');
            }
        });
    }
});