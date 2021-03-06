var SkritterCollection = require('base/skritter-collection');
var Reviews = require('collections/reviews');
var Vocabs = require('collections/vocabs');
var Item = require('models/item');

/**
 * @class Items
 * @extends {SkritterCollection}
 */
module.exports = SkritterCollection.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function(models, options) {
    options = options || {};
    
    this.cursor = null;
    this.sorted = null;
    this.reviews = new Reviews(null, {items: this});
    this.vocabs = new Vocabs(options.vocabs || null, {items: this});
  },
  /**
   * @property model
   * @type {Item}
   */
  model: Item,
  /**
   * @property url
   * @type {String}
   */
  url: 'items',
  /**
   * @method addItems
   * @param {Object} [options]
   * @param {Function} callback
   */
  addItems: function(options, callback) {
    var self = this;
    options = options || {};
    async.waterfall([
      function(callback) {
        self.fetch({
          remove: false,
          sort: false,
          type: 'POST',
          url: app.getApiUrl() + 'items/add?lists=' + (options.lists || ''),
          error: function(error) {
            callback(error);
          },
          success: function(items, result) {
            callback(null, result);
          }
        });
      },
      function(result, callback) {
        self.fetch({
          data: {
            ids: _.map(result.Items, 'id').join('|'),
            include_contained: true
          },
          remove: false,
          sort: false,
          error: function(error) {
            callback(error);
          },
          success: function() {
            callback(null, result);
          }
        });
      }
    ], function(error, result) {
      if (error) {
        console.error('ITEM ADD ERROR:', error);
        callback(error)
      } else {
        callback(null, result);
      }
    });
  },
  /**
   * @method comparator
   * @param {Item} item
   * @returns {Number}
   */
  comparator: function(item) {
    return -item.getReadiness();
  },
  /**
   * @method parse
   * @param {Object} response
   * @returns {Object}
   */
  parse: function(response) {
    this.cursor = response.cursor;
    this.vocabs.add(response.Vocabs);
    this.vocabs.decomps.add(response.Decomps);
    this.vocabs.sentences.add(response.Sentences);
    this.vocabs.strokes.add(response.Strokes);
    return response.Items.concat(response.ContainedItems || []);
  },
  /**
   * @method reset
   * @returns {Items}
   */
  reset: function() {
    this.vocabs.reset();
    return SkritterCollection.prototype.reset.call(this);
  },
  /**
   * @method sort
   * @returns {Items}
   */
  sort: function() {
    this.sorted = moment().unix();
    return SkritterCollection.prototype.sort.call(this);
  }
});
