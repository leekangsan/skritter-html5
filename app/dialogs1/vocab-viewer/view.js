var GelatoDialog = require('gelato/dialog');

var Vocabs = require('collections/vocabs');
var Content = require('dialogs1/vocab-viewer/content/view');

/**
 * @class VocabViewer
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
  /**
   * @method initialize
   * @constructor
   */
  initialize: function() {
    this.content = new Content({dialog: this});
    this.items = [];
    this.vocabs = new Vocabs();
    this.vocabsContaining = new Vocabs();
  },
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {VocabViewer}
   */
  render: function() {
    this.renderTemplate();
    this.content.setElement('#content-container').render();
    return this;
  },
  /**
   * @method load
   * @param {String} vocabId
   * @returns {VocabViewer}
   */
  load: function(vocabId) {
    var self = this;
    var wordItems = null;
    var wordVocabs = null;
    var wordVocabsContaining = null;
    async.parallel(
      [
        function(callback) {
          async.waterfall(
            [
              function(callback) {
                self.vocabs.fetch({
                  data: {
                    include_decomps: true,
                    include_heisigs: true,
                    include_sentences: true,
                    include_top_mnemonics: true,
                    ids: vocabId
                  },
                  error: function(error) {
                    callback(error);
                  },
                  success: function(vocabs) {
                    wordVocabs = vocabs;
                    callback(null, vocabs);
                  }
                });
              },
              function(vocabs, callback) {
                if (vocabs.at(0).has('containedVocabIds')) {
                  self.vocabs.fetch({
                    data: {
                      ids: vocabs.at(0).get('containedVocabIds').join('|')
                    },
                    remove: false,
                    error: function(error) {
                      callback(error);
                    },
                    success: function(vocabs) {
                      wordVocabs = vocabs;
                      callback(null, vocabs);
                    }
                  });
                } else {
                  callback();
                }
              }
            ],
            callback
          )
        },
        function(callback) {
          self.vocabsContaining.fetch({
            data: {
              include_containing: true,
              q: vocabId
            },
            error: function(error) {
              callback(error);
            },
            success: function(vocabs) {
              wordVocabsContaining = vocabs;
              callback();
            }
          });
        },
        function(callback) {
          app.user.db.items
            .toArray()
            .then(function(items) {
              this.items = wordItems = _.filter(
                items,
                function(item) {
                  return _.includes(item.id, vocabId);
                }
              );
              callback();
            })
            .catch(function(error) {
              callback(error);
            });
        }
      ],
      function(error) {
        if (error) {
          console.error('WORD DIALOG LOAD ERROR:', error);
        } else {
          wordVocabsContaining.remove(wordVocabs.at(0).id);
          self.content.set(wordVocabs, wordVocabsContaining, wordItems);
        }
      }
    );
    return this;
  },
  /**
   * @method remove
   * @returns {VocabViewer}
   */
  remove: function() {
    this.content.remove();
    this.vocabs.reset();
    return GelatoDialog.prototype.remove.call(this);
  }
});
