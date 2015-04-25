/**
 * @module Application
 * @submodule Models
 */
define([
    'core/modules/GelatoModel'
], function(GelatoModel) {

    /**
     * @class UserSubscription
     * @extends GelatoModel
     */
    var UserSubscription = GelatoModel.extend({
        /**
         * @method initialize
         * @param {Object} [attributes]
         * @param {Object} [options]
         * @constructor
         */
        initialize: function(attributes, options) {
            options = options || {};
            this.app = options.app;
            this.on('change', this.cache);
        },
        /**
         * @property defaults
         * @type Object
         */
        defaults: {},
        /**
         * @method cache
         * @returns {UserSubscription}
         */
        cache: function() {
            localStorage.setItem(this.app.user.getCachePath('subscription', false), JSON.stringify(this.toJSON()));
            return this;
        },
        /**
         * @method fetch
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         */
        fetch: function(callbackSuccess, callbackError) {
            var self = this;
            this.app.api.fetchSubscription(this.app.user.id, null, function(data) {
                self.set(data);
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess();
                }
            }, function(error) {
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
        },
        /**
         * @method load
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         * @returns {UserSubscription}
         */
        load: function(callbackSuccess, callbackError) {
            var self = this;
            Async.series([
                function(callback) {
                    var cachedItem = localStorage.getItem(self.app.user.getCachePath('settings', false));
                    if (cachedItem) {
                        self.set(JSON.parse(cachedItem), {silent: true});
                    }
                    callback();
                },
                function(callback) {
                    self.fetch();
                    callback();
                }
            ], function(error) {
                if (error) {
                    if (typeof callbackError === 'function') {
                        callbackError(error);
                    }
                } else {
                    if (typeof callbackSuccess === 'function') {
                        callbackSuccess();
                    }
                }
            });
            return this;
        },
        /**
         * @method save
         * @param {Function} [callbackSuccess]
         * @param {Function} [callbackError]
         * @returns {UserSubscription}
         */
        save: function(callbackSuccess, callbackError) {
            var self = this;
            this.app.api.putSubscription(this.app.user.id, this.toJSON(), function(result) {
                self.set(result, {silent: true});
                self.cache();
                if (typeof callbackSuccess === 'function') {
                    callbackSuccess(self);
                }
            }, function(error) {
                self.cache();
                if (typeof callbackError === 'function') {
                    callbackError(error);
                }
            });
            return this;
        }
    });

    return UserSubscription;

});