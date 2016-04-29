var GelatoComponent = require('gelato/component');

var VocabViewerLookup = require('dialogs1/vocab-viewer/lookup/view');

/**
 * @class VocabViewerContent
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @param {Object} [options]
   * @constructor
   */
  initialize: function(options) {
    this.lookup = new VocabViewerLookup();
    this.items = [];
    this.vocabs = null;
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click .item-ban': 'handleClickItemBan',
    'click .item-unban': 'handleClickItemUnban'
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {VocabViewerContent}
   */
  render: function() {
    this.renderTemplate();
    this.lookup.setElement('#lookup-container').render();
    return this;
  },
  /**
   * @method handleClickItemBan
   * @param {Event} event
     */
  handleClickItemBan: function(event) {
    event.preventDefault();
    var vocab = this.vocabs.at(0);
    var $row = this.$(event.target).closest('tr');
    vocab.banPart($row.data('part')).save();
    this.render();
  },
  /**
   * @method handleClickItemUnban
   * @param {Event} event
   */
  handleClickItemUnban: function(event) {
    event.preventDefault();
    var vocab = this.vocabs.at(0);
    var $row = this.$(event.target).closest('tr');
    vocab.unbanPart($row.data('part')).save();
    this.render();
  },
  /**
   * @method set
   * @param {Vocabs} vocabs
   * @param {Array} items
   * @returns {VocabViewerContent}
   */
  set: function(vocabs, items) {
    this.items = items || [];
    this.vocabs = vocabs || null;
    this.lookup.set(vocabs);
    return this.render();
  }
});
