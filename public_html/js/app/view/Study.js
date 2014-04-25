define([
    'require.text!template/study.html',
    'view/prompt/Defn',
    'view/prompt/Rdng',
    'view/prompt/Rune',
    'view/prompt/Tone'
], function(templateStudy, Defn, Rdng, Rune, Tone) {
    /**
     * @class Study
     */
    var Study = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.prompt = null;
            this.listenTo(skritter.user.scheduler, 'schedule:sorted', _.bind(this.updateDueCount, this));
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateStudy);
            skritter.timer.setElement(this.$('#timer')).render();
            skritter.user.scheduler.sort();
            this.nextPrompt();
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click #view-study .button-add-items': 'showAddItemsModal',
            'click #view-study .button-audio': 'playAudio',
            'click #view-study .button-study-settings': 'navigateStudySettings'
        },
        /**
         * @method loadPrompt
         * @param {Backbone.Model} review
         */
        loadPrompt: function(review) {
            if (this.prompt) {
                this.prompt.remove();
                this.prompt = null;
            }
            switch (review.get('part')) {
                case 'defn':
                    this.prompt = new Defn();
                    break;
                case 'rdng':
                    this.prompt = new Rdng();
                    break;
                case 'rune':
                    this.prompt = new Rune();
                    break;
                case 'tone':
                    this.prompt = new Tone();
                    break;
            }
            this.prompt.set(review);
            this.prompt.setElement(this.$('#content-container')).render();
            this.listenToOnce(this.prompt, 'prompt:finished', _.bind(this.nextPrompt, this));
            this.updateAudioButtonState();
            this.updateDueCount();
        },
        /**
         * @method navigateStudySettings
         * @param {Object} event
         */
        navigateStudySettings: function(event) {
            skritter.router.navigate('study/settings', {trigger: true});
            event.preventDefault();
        },
        /**
         * @method nextPrompt
         */
        nextPrompt: function() {
            skritter.timer.reset();
            var scheduledItem = skritter.user.scheduler.getNext();
            skritter.user.data.items.loadItem(scheduledItem.id, _.bind(function(item) {
                this.loadPrompt(item.createReview());
            }, this));
        },
        /**
         * @method playAudio
         * @param {Object} event
         */
        playAudio: function(event) {
            this.prompt.review.getBaseVocab().playAudio();
            event.preventDefault();
        },
        /**
         * @method previousPrompt
         */
        previousPrompt: function() {
            //TODO: add in the ability to move backwards a few prompts
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method showAddItemsModal
         * @param {Object} event
         */
        showAddItemsModal: function(event) {
            skritter.modal.show('add-items');
            skritter.modal.$('#add-items .button-add').on('vclick', function() {
                var limit = skritter.modal.$('#add-items .item-limit').val();
                if (limit >= 1 && limit <= 100) {
                    skritter.modal.$('#add-items :input').prop('disabled', true);
                    skritter.modal.$('#add-items .message').addClass('text-info');
                    skritter.modal.$('#add-items .message').html("<i class='fa fa-spin fa-spinner'></i> Adding Items");
                    skritter.user.sync.addItems(limit, function() {
                        skritter.modal.hide();
                    });
                } else {
                    skritter.modal.$('#add-items .message').addClass('text-danger');
                    skritter.modal.$('#add-items .message').text('Must be between 1 and 100.');
                }
            });
            event.preventDefault();
        },
        /**
         * @method updateAudioButtonState
         */
        updateAudioButtonState: function() {
            if (this.prompt && this.prompt.review.getBaseVocab().has('audio')) {
                this.$('.button-audio span').removeClass('fa fa-volume-off');
                this.$('.button-audio span').addClass('fa fa-volume-up');
            } else {
                this.$('.button-audio span').removeClass('fa fa-volume-up');
                this.$('.button-audio span').addClass('fa fa-volume-off');
            }
        },
        /**
         * @method updateDueCount
         */
        updateDueCount: function() {
            this.$('#items-due').html(skritter.user.scheduler.getDueCount());
        }
    });
    
    return Study;
});