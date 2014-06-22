define([
    'model/data/Item'
], function(Item) {
    /**
     * @class DataItems
     */
    var Items = Backbone.Collection.extend({
        /**
         * @method initialize
         */
        initialize: function() {
        },
        /**
         * @property {Backbone.Model} model
         */
        model: Item,
        /**
         * @method cache
         * @param {Function} callback
         */
        cache: function(callback) {
            skritter.storage.put('items', this.toJSON(), function() {
                if (typeof callback === 'function') {
                    callback();
                }
            });
        },
        /**
         * @method addItems
         * @param {Function} callback
         * @param {Number} limit
         */
        addItems: function(callback, limit) {
            var now = skritter.fn.getUnixTime();
            var offset = this.get('addItemOffset');
            var requests = {
                path: 'api/v' + skritter.api.version + '/items/add',
                method: 'POST',
                params: {
                    lang: skritter.user.getLanguageCode(),
                    limit: limit,
                    offset: offset,
                    fields: 'id'
                }
            };
            this.active.addItems = true;
            async.waterfall([
                function(callback) {
                    skritter.api.requestBatch(requests, function(batch, status) {
                        if (status === 200) {
                            callback(null, batch);
                        } else {
                            callback(batch);
                        }
                    });
                },
                function(batch, callback) {
                    var itemIds = [];
                    var request = function() {
                        skritter.api.getBatch(batch.id, function(result, status) {
                            if (result && status === 200) {
                                if (result.Items) {
                                    itemIds = itemIds.concat(_.pluck(result.Items, 'id'));
                                }
                                window.setTimeout(request, 500);
                            } else {
                                callback(null, itemIds);
                            }
                        });
                    };
                    request();
                },
                function(itemIds, callback) {
                    console.log('added items', itemIds);
                    skritter.user.sync.changedItems(function() {
                        callback(null, itemIds);
                    }, now, true);
                }
            ], _.bind(function(error, itemIds) {
                skritter.user.scheduler.sort();
                this.active.addItems = false;
                if (typeof callback === 'function') {
                    callback(itemIds);
                }
            }, this));
        },
        /**
         * @method fetchById
         * @param {Array|String} itemIds
         * @param {Function} callback
         */
        fetchById: function(itemIds, callback) {
            skritter.api.getItems(itemIds, _.bind(function(items, status) {
                if (status === 200) {
                    this.insert(items, callback);
                    callback(null);
                } else {
                    callback(items);
                }
            }, this));
        },
        /**
         * @method fetchChanged         
         * @param {Function} callback
         * @param {Number} offset
         * @param {Boolean} includeResources
         */
        fetchChanged: function(callback, offset, includeResources) {
            offset = offset ? offset : skritter.user.sync.get('lastItemSync');
            skritter.user.sync.processBatch([
                {
                    path: 'api/v' + skritter.api.version + '/items',
                    method: 'GET',
                    params: {
                        lang: skritter.user.getLanguageCode(),
                        sort: 'changed',
                        offset: offset,
                        include_vocabs: includeResources ? 'true' : 'false',
                        include_strokes: includeResources ? 'true' : 'false',
                        include_sentences: 'false',
                        include_heisigs: includeResources ? 'true' : 'false',
                        include_top_mnemonics: includeResources ? 'true' : 'false',
                        include_decomps: includeResources ? 'true' : 'false'
                    },
                    spawner: true
                }
            ], function() {
                callback();
            });
        },
        /**
         * @method insert
         * @param {Array|Object} items
         * @param {Function} callback
         */
        insert: function(items, callback) {
            skritter.storage.put('items', items, callback);
        },
        /**
         * @method loadAll
         * @param {Function} callback
         */
        loadAll: function(callback) {
            skritter.storage.getAll('items', _.bind(function(items) {
                this.add(items, {merge: true, silent: true, sort: false});
                callback();
            }, this));
        }
    });

    return Items;
});