/**
 * @module Application
 */
define([
    'framework/BaseCollection',
    'models/data/DataItem'
], function(BaseCollection, DataItem) {
    /**
     * @class DataItems
     * @extend BaseCollection
     */
    var DataItems = BaseCollection.extend({
        /**
         * @property model
         * @type DataItem
         */
        model: DataItem,
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            var self = this;
            app.storage.getAll('items', function(data) {
                self.reset();
                self.lazyAdd(data, callback);
            });
        }
    });

    return DataItems;
});