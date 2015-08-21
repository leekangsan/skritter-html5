var GelatoPage = require('gelato/page');
var VocablistTable = require('components/vocablist-mine-table/view');
var NavbarLoggedIn = require('components/navbar-logged-in/view');
var VocablistSidebar = require('components/vocablist-sidebar/view');

/**
 * @class VocablistMine
 * @extends {GelatoPage}
 */
module.exports = GelatoPage.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        this.vocablistTable = new VocablistTable();
        this.navbar = new NavbarLoggedIn();
        this.sidebar = new VocablistSidebar();
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('pages/vocablist-mine/template'),
    /**
     * @property title
     * @type {String}
     */
    title: 'My Lists - Skritter',
    /**
     * @method render
     * @returns {VocablistBrowse}
     */
    render: function() {
        this.renderTemplate();
        this.vocablistTable.setElement('#vocablist-container').render();
        this.navbar.setElement('#navbar-container').render();
        this.sidebar.setElement('#vocablist-sidebar-container').render();
        return this;
    },
    /**
     * @method remove
     * @returns {VocablistBrowse}
     */
    remove: function() {
        this.vocablistTable.remove();
        this.navbar.remove();
        this.sidebar.remove();
        return GelatoPage.prototype.remove.call(this);
    }
});
