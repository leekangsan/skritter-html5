var GelatoDialog = require('gelato/bootstrap/dialog');

/**
 * @class VocablistSectionsEdit
 * @extends {GelatoDialog}
 */
module.exports = GelatoDialog.extend({
    /**
     * @method initialize
     * @param {Object} options
     */
    initialize: function(options) {
        this.vocablist = options.vocablist;
        if (!this.vocablist) {
            throw new Error('VocablistSectionsEdit requires a vocablist passed in!')
        }
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {VocablistSectionsEdit}
     */
    render: function() {
        this.renderTemplate();

        // jquery-ui doesn't hook into this.$, so use global $ instead
        $(this.el).find('.list-group').sortable({
            handle:'.glyphicon-option-vertical'
        });
        return this;
    },
    /**
     * @property events
     * @type {Object}
     */
    events: {
        'vclick #confirm-btn': 'handleClickConfirmButton',
        'vclick #cancel-btn': 'handleClickCancelButton',
        'vclick .glyphicon-remove': 'handleClickRemoveLink',
        'vclick #add-section-btn': 'handleClickAddSectionButton'
    },
    /**
     * @method handleClickCloseButton
     * @param {Event} e
     */
    handleClickCancelButton: function(e) {
        this.close();
    },
    /**
     * @method handleClickSaveButton
     * @param {Event} e
     */
    handleClickConfirmButton: function() {
        var sections = [];
        $.each(this.$('.list-group-item'), function (i, el)  {
            var id = ($(el).data('section-id') || '').toString();

            var section = {
                name: $(el).find('input').val(),
                deleted: $(el).hasClass('hide')
            };

            if (id) {
                section.id = id;
            }

            sections.push(section);
        });
        this.vocablist.save({sections: sections}, {patch: true, method: 'PUT'});
        this.close();
    },
    /**
     * @method handleClickRemoveLink
     * @param {Event} e
     */
    handleClickRemoveLink: function (e) {
        $(e.target).closest('.list-group-item').addClass('hide');
    },
    /**
     * @method handleClickAddSectionButton
     */
    handleClickAddSectionButton: function() {
        var newRow = this.$('#new-section-template').clone().removeClass('hide');
        this.$('.list-group').append(newRow);
    }
});
