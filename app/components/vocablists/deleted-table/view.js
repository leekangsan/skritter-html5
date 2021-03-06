var GelatoComponent = require('gelato/component');
var Vocablists = require('collections/vocablists');

/**
 * @class VocablistDeletedTable
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.vocablists = new Vocablists();
    this.listenTo(this.vocablists, 'state', this.render);
    this.vocablists.fetch({
      data: {
        limit: 10,
        sort: 'deleted',
        lang: app.getLanguage()
      }
    });
  },
  /**
   * @property events
   * @typeof {Object}
   */
  events: {
    'click #load-more-btn': 'handleClickLoadMoreButton',
    'click .restore-link': 'handleClickRestoreLink'
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {VocablistDeletedTable}
   */
  render: function() {
    this.renderTemplate();
    return this;
  },
  /**
   * @method handleClickRestoreLink
   * @param {Event} event
   */
  handleClickRestoreLink: function(event) {
    event.preventDefault();
    var listID = $(event.target).closest('.restore-link').data('vocablist-id');
    var vocablist = this.vocablists.get(listID);
    vocablist.set({disabled: false, studyingMode: 'not studying'});
    vocablist.save(null, {patch: true});
    this.render();
  },
  /**
   * @method handleClickLoadMoreButton
   * @param {Event} event
   */
  handleClickLoadMoreButton: function(event) {
    event.preventDefault();
    if (!this.vocablists.cursor) {
      return;
    }
    this.vocablists.fetch({
      data: {
        cursor: this.vocablists.cursor,
        limit: 10,
        sort: 'custom',
        lang: app.getLanguage()
      },
      remove: false
    });
    this.render();
  }
});
