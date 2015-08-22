var GelatoDialog = require('gelato/dialog');

/**
 * @class ConfirmDialog
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
    /**
     * @method initialize
     * @param {Object} options
     */
    initialize: function(options) {
        this.title = options.title;
        this.body = options.body;
        this.okText = options.okText;
        this.onConfirm = options.onConfirm || 'close'; // or 'show-spinner' or function
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {ConfirmDialog}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #button-cancel': 'handleClickButtonCancel',
        'vclick #button-confirm': 'handleClickButtonConfirm'
    },
    /**
     * @method handleClickButtonCancel
     * @param {Event} event
     */
    handleClickButtonCancel: function(event) {
        event.preventDefault();
        this.close();
    },
    /**
     * @method handleClickButtonConfirm
     * @param {Event} event
     */
    handleClickButtonConfirm: function(event) {
        event.preventDefault();
        this.trigger('confirm');
        if (this.onConfirm === 'close') {
            this.close();
        }
        else if (this.onConfirm === 'show-spinner') {
            this.$('#buttons').hide();
            this.$('#spinner-p').removeClass('hide');
        }
        else if (_.isFunction(this.onConfirm)) {
            this.onConfirm();
        }
    }
});
