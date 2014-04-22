define([
    'require.text!template/prompt-defn.html',
    'view/prompt/Prompt'
], function(templateDefn, Prompt) {
    /**
     * @class Defn
     */
    var Defn = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateDefn);
            Prompt.prototype.render.call(this);
            this.$('#prompt-text').hammer().on('click', _.bind(this.handleTap, this));
            this.resize();
            this.show();
            return this;
        },
        /**
         * @method handleTap
         * @param {Object} event
         */
        handleTap: function(event) {
            if (this.review.get('finished')) {
                Prompt.gradingButtons.trigger('selected');
            } else {
                this.showAnswer();
            }
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            this.$('#prompt-text').hammer().off();
            Prompt.prototype.remove.call(this);
        },
        /**
         * @method resize
         */
        resize: function() {
            Prompt.prototype.resize.call(this);
            var canvasSize = skritter.settings.canvasSize();
            var contentHeight = skritter.settings.contentHeight();
            var contentWidth = skritter.settings.contentWidth();
            if (skritter.settings.isPortrait()) {
                this.$('.prompt-container').addClass('portrait');
                this.$('.prompt-container').removeClass('landscape');
                this.$('.prompt-container').css('height', '');
                this.$('#info-section').height('');
                this.$('#input-section').css('left', (contentWidth - canvasSize) / 2);
                this.$('#input-section').height(contentHeight - this.$('#info-section').height() - 30);
            } else {
                this.$('.prompt-container').addClass('landscape');
                this.$('.prompt-container').removeClass('portrait');
                this.$('.prompt-container').css('height', canvasSize);
                this.$('#info-section').css('height', canvasSize);
                this.$('#input-section').css('left', '');
                if (window.cordova) {
                    this.$('#input-section').height(contentHeight);
                } else {
                    this.$('#input-section').height(canvasSize);
                }
            }
            this.$('#input-section').width(canvasSize);
            this.$('#prompt-writing').fitText(0.65, {maxFontSize: '128px'});
        },
        /**
         * @method show
         * @returns {Backbone.View}
         */
        show: function() {
            skritter.timer.start();
            this.review.set('finished', false);
            this.$('#answer').hide();
            this.$('#prompt-definition').html(this.review.getBaseVocab().getDefinition());
            this.$('#prompt-reading').html(this.review.getBaseVocab().getReading());
            this.$('#prompt-sentence').html(this.review.getBaseVocab().getSentenceWriting());
            this.$('#prompt-style').html(this.review.getBaseVocab().getStyle());
            this.$('#prompt-writing').html(this.review.getBaseVocab().get('writing'));
            return this;
        },
        /**
         * @method showAnswer
         * @returns {Backbone.View}
         */
        showAnswer: function() {
            skritter.timer.stop();
            this.review.set('finished', true);
            this.$('#question').hide();
            this.$('#answer').show('fade', 200);
            this.$('#question-text').html('Definition:');
            Prompt.gradingButtons.show().select(this.review.getReviewAt().score).expand();
            return this;
        }
    });

    return Defn;
});