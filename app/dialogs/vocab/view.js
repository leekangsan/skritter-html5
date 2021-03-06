var BootstrapDialog = require('base/bootstrap-dialog');
var VocabViewer = require('components/vocab-viewer/view');

/**
 * @class VocabDialog
 * @extends {BootstrapDialog}
 */
module.exports = BootstrapDialog.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.viewer = new VocabViewer();
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method remove
   * @returns {VocabDialog}
   */
  remove: function() {
    this.viewer.remove();
    return BootstrapDialog.prototype.remove.call(this);
  },
  /**
   * @method render
   * @returns {VocabDialog}
   */
  render: function() {
    this.renderTemplate();
    this.viewer.setElement('#vocab-container').render();
    return this;
  },
  /**
   * @property events
   * @type {Object}
   */
  events: {
    'click #button-close': 'handleClickButtonClose'
  },
  /**
   * @method handleClickButtonClose
   * @param {Event} event
   */
  handleClickButtonClose: function(event) {
    event.preventDefault();
    this.close();
  },
  /**
   * @method handleLoadVocab
   */
  handleLoadVocab: function() {
    this.$('#loading-spinner').hide();
  },
  /**
   * @method set
   * @param {String} [vocabId]
   */
  load: function(vocabId) {
    this.$('#loading-spinner').show();
    this.listenToOnce(this.viewer, 'load', this.handleLoadVocab);
    this.viewer.load(vocabId);
  }
});
