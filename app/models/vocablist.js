var SkritterModel = require('base/skritter-model');

/**
 * @class Vocablist
 * @extends {SkritterModel}
 */
module.exports = SkritterModel.extend({
    /**
     * @property idAttribute
     * @type {String}
     */
    idAttribute: 'id',
    /**
     * @method getPopularity
     * @returns {Number}
     */
    getPopularity: function() {
        var peopleStudying = this.get('peopleStudying');
        if (peopleStudying === 0) {
            return 0;
        } else if (peopleStudying > 2000) {
            return 1;
        } else {
           return Math.pow(peopleStudying / 2000, 0.3)
        }
    },
    /**
     * @method getProgress
     * @returns {Number}
     */
    getProgress: function() {
        var added = 0;
        var passed = false;
        var total = 0;
        var sections = this.get('sections');
        if (this.get('studyingMode') === 'finished') {
            return 100;
        } else if (sections) {
            var currentIndex = this.get('currentIndex') || 0;
            var currentSection = this.get('currentSection') || sections[0].id;
            var sectionsSkipping = this.get('sectionsSkipping');
            for (var i = 0, length = sections.length; i < length; i++) {
                var section = sections[i];
                if (section.id === currentSection) {
                    added += currentIndex;
                    passed = true;
                }
                if (sectionsSkipping.indexOf(section.id) > -1) {
                    continue;
                }
                if (!passed) {
                    added += section.rows.length;
                }
                total += section.rows.length;
            }
            return total ? Math.round(100 * added / total) : 0;
        } else {
            return 0;
        }
    },
    /**
     * @method getSectionById
     * @param {String} sectionId
     * @returns {Object}
     */
    getSectionById: function(sectionId) {
        return _.find(this.get('sections'), {id: sectionId});
    },
    /**
     * @method getWordCount
     * @returns {Number}
     */
    getWordCount: function() {
        var count = 0;
        var rows = _.pluck(this.get('sections'), 'rows');
        for (var i = 0, length = rows.length; i < length; i++) {
            count += rows[i].length;
        }
        return count;
    },
    /**
     * @method isChinese
     * @returns {Boolean}
     */
    isChinese: function() {
        return this.get('lang') === 'zh';
    },
    /**
     * @method isJapanese
     * @returns {Boolean}
     */
    isJapanese: function() {
        return this.get('lang') === 'ja';
    },
    /**
     * @property urlRoot
     */
    urlRoot: 'vocablists',
    /**
     * @method parse
     * @returns {Object}
     */
    parse: function(response) {
        return response.VocabList || response;
    },
    /**
     * @method publishable
     * @returns {Boolean}
     */
    publishable: function() {
        return _.all([
            !this.get('disabled'),
            !this.get('published'),
            this.get('sort') === 'custom',
            this.get('user') === app.user.id,
            (this.get('sections') || []).length
        ]);
    },
    /**
     * @method deletable
     * @returns {Boolean}
     */
    deletable: function() {
        return _.all([
            !this.get('disabled'),
            !this.get('published'),
            this.get('sort') === 'custom',
            this.get('user') === app.user.id
        ]);
    },
    /**
     * @method copyable
     * @returns {Boolean}
     */
    copyable: function() {
        return _.all([
            !this.get('disabled'),
            this.get('sort') !== 'chinesepod-lesson'
        ]);
    },
    /**
     * @method editable
     * @returns {Boolean}
     */
    editable: function() {
        if (app.user.get('isAdmin')) {
            return true;
        }

        return _.all([
            !this.get('disabled'),
            this.get('sort') === 'custom',
            _.any([
                this.get('user') === app.user.id,
                _.contains(this.get('editors'), app.user.id),
                this.get('public')
            ])
        ]);
    },
    /**
     * @method getImageUrl
     * @returns {String}
     */
    getImageUrl: function() {
        return app.getApiUrl() + 'vocablists/' + this.id + '/image';
    }
});
