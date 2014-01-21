/**
 * @module Skritter
 * @param templateDefn
 * @param LeapController
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-defn.html',
    'models/LeapController',
    'views/prompts/Prompt'
], function(templateDefn, LeapController, Prompt) {
    /**
     * @class PromptDefn
     */
    var Defn = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
            skritter.timer.setReviewLimit(30);
            skritter.timer.setThinkingLimit(15);
            Defn.leap = new LeapController();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateDefn);
            hammer(this.$('#prompt-text')[0]).on('tap', this.handleTap);
            Prompt.prototype.render.call(this);
            return this;
        },
        /**
         * @method handleGradeSelected
         * @param {Number} grade
         */
        handleGradeSelected: function(grade) {
            this.updateColor();
        },
        /**
         * @method handleTap
         */
        handleTap: function() {
            if (Prompt.dataItem.isFinished()) {
                Prompt.this.next();
            } else {
                skritter.timer.stopThinking();
                Prompt.dataItem.set('finished', true);
                Prompt.this.load();
            }
        },
        /**
         * @method load
         */
        load: function() {
            Prompt.prototype.load.call(this);
            Prompt.data.show.reading();
            Prompt.data.show.style();
            Prompt.data.show.tip("What's the definition?");
            Prompt.data.show.writing();
            if (Prompt.dataItem.isFinished()) {
                skritter.timer.stop();
                this.updateColor();
                Prompt.data.hide.tip();
                Prompt.data.show.definition();
                Prompt.gradingButtons.show();
            } else {
                skritter.timer.start();
            }
        },
        /**
         * Updates the prompt color based on the current selected grade value.
         * 
         * @method updateColor
         */
        updateColor: function() {
            Prompt.this.$('.prompt-definition').removeClass(function(index, css) {
                return (css.match(/\bgrade\S+/g) || []).join(' ');
            });
            Prompt.this.$('.prompt-definition').addClass('grade' + Prompt.gradingButtons.grade());
        }
    });

    return Defn;
});