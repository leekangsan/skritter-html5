var GelatoComponent = require('gelato/component');

var Prompt = require('components/prompt/view');
var PromptCanvas = require('components/prompt/canvas/view');
var PromptToolbarAction = require('components/prompt/toolbar-action/view');
var PromptToolbarGrading = require('components/prompt/toolbar-grading/view');
var PromptVocabDefinition = require('components/prompt/vocab-definition/view');
var PromptVocabMnemonic = require('components/prompt/vocab-mnemonic/view');
var PromptVocabReading = require('components/prompt/vocab-reading/view');
var PromptVocabSentence = require('components/prompt/vocab-sentence/view');
var PromptVocabStyle = require('components/prompt/vocab-style/view');
var PromptVocabWriting = require('components/prompt/vocab-writing/view');

/**
 * @class Prompt
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
    /**
     * @method initialize
     * @constructor
     */
    initialize: function() {
        //properties
        this.part = null;
        this.reviews = null;
        //components
        this.canvas = new PromptCanvas({prompt: this});
        this.toolbarAction = new PromptToolbarAction({prompt: this});
        this.toolbarGrading = new PromptToolbarGrading({prompt: this});
        this.vocabDefinition = new PromptVocabDefinition({prompt: this});
        this.vocabMnemonic = new PromptVocabMnemonic({prompt: this});
        this.vocabReading = new PromptVocabReading({prompt: this});
        this.vocabSentence = new PromptVocabSentence({prompt: this});
        this.vocabStyle = new PromptVocabStyle({prompt: this});
        this.vocabWriting = new PromptVocabWriting({prompt: this});
        //listeners
        this.listenTo(this.canvas, 'attempt:fail', this.handleCanvasAttemptFail);
        this.listenTo(this.canvas, 'attempt:success', this.handleCanvasAttemptSuccess);
        this.listenTo(this.canvas, 'click', this.handleCanvasClick);
        this.listenTo(this.canvas, 'complete', this.handleCanvasComplete);
        this.listenTo(this.canvas, 'input:up', this.handleCanvasInputUp);
        this.listenTo(this.canvas, 'navigate:next', this.handleCanvasNavigateNext);
        this.listenTo(this.canvas, 'navigate:previous', this.handleCanvasNavigatePrevious);
        this.listenTo(this.toolbarAction, 'click:correct', this.handleToolbarActionCorrect);
        this.listenTo(this.toolbarAction, 'click:erase', this.handleToolbarActionErase);
        this.listenTo(this.toolbarAction, 'click:show', this.handleToolbarActionShow);
        this.listenTo(this.toolbarAction, 'click:teach', this.handleToolbarActionTeach);
        this.listenTo(this.toolbarGrading, 'change', this.handleToolbarGradingChange);
        this.listenTo(this.toolbarGrading, 'mousedown', this.handleToolbarGradingMousedown);
        this.listenTo(this.toolbarGrading, 'select', this.handleToolbarGradingSelect);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('./template'),
    /**
     * @method render
     * @returns {Prompt}
     */
    render: function() {
        this.renderTemplate();
        return this;
    },
    /**
     * @method renderPrompt
     * @returns {Prompt}
     */
    renderPrompt: function() {
        this.reset();
        this.review = this.reviews.current();
        switch (this.part) {
            case 'defn':
                this.renderPromptPartDefn();
                break;
            case 'rdng':
                this.renderPromptPartRdng();
                break;
            case 'rune':
                this.renderPromptPartRune();
                break;
            case 'tone':
                this.renderPromptPartTone();
                break;
        }
        return this;
    },
    /**
     * @method renderPromptComplete
     * @returns {Prompt}
     */
    renderPromptComplete: function() {
        this.review = this.reviews.current();
        switch (this.part) {
            case 'defn':
                this.renderPromptPartDefnComplete();
                break;
            case 'rdng':
                this.renderPromptPartRdngComplete();
                break;
            case 'rune':
                this.renderPromptPartRuneComplete();
                break;
            case 'tone':
                this.renderPromptPartToneComplete();
                break;
        }
        return this;
    },
    /**
     * @method renderPromptLoad
     * @returns {Prompt}
     */
    renderPromptLoad: function() {
        this.render();
        this.canvas.setElement('#canvas-container').render();
        this.toolbarAction.setElement('#action-toolbar-container').render();
        this.toolbarGrading.setElement('#grading-toolbar-container').render();
        this.vocabDefinition.setElement('#vocab-definition-container').render();
        this.vocabMnemonic.setElement('#vocab-mnemonic-container').render();
        this.vocabReading.setElement('#vocab-reading-container').render();
        this.vocabSentence.setElement('#vocab-sentence-container').render();
        this.vocabStyle.setElement('#vocab-style-container').render();
        this.vocabWriting.setElement('#vocab-writing-container').render();
        return this;
    },
    /**
     * @method renderPromptPartDefn
     * @returns {Prompt}
     */
    renderPromptPartDefn: function() {
        if (this.review.isComplete()) {
            console.log('complete');
            this.renderPromptComplete();
        } else {
            console.log('no complete');
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = false;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            console.log(this.toolbarAction);
            this.vocabDefinition.render();
            this.review.start();
        }
        return this;
    },
    /**
     * @method renderPromptPartDefnComplete
     * @returns {Prompt}
     */
    renderPromptPartDefnComplete: function() {
        if (this.review.isComplete()) {
            this.review.stop();
            this.canvas.render();
            this.toolbarGrading.select(this.review.get('score'));
            this.vocabDefinition.render();
        } else {
            this.renderPromptPartRune();
        }
        return this;
    },
    /**
     * @method renderPromptPartRdng
     * @returns {Prompt}
     */
    renderPromptPartRdng: function() {
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        } else {
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = false;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.vocabReading.render();
            this.review.start();
        }
        return this;
    },
    /**
     * @method renderPromptPartRdngComplete
     * @returns {Prompt}
     */
    renderPromptPartRdngComplete: function() {
        if (this.review.isComplete()) {
            this.review.stop();
            this.canvas.render();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = false;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.toolbarGrading.select(this.review.get('score'));
            this.vocabReading.render();
        } else {
            this.renderPromptPartRune();
        }
        return this;
    },
    /**
     * @method renderPromptPartRune
     * @returns {Prompt}
     */
    renderPromptPartRune: function() {
        this.canvas.redrawCharacter();
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        } else {
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = true;
            this.toolbarAction.buttonShow = true;
            this.toolbarAction.buttonTeach = true;
            this.toolbarAction.render();
            this.vocabReading.render();
            this.vocabWriting.render();
            this.canvas.enableInput();
            this.review.start();
        }
        return this;
    },
    /**
     * @method renderPromptPartRuneComplete
     * @returns {Prompt}
     */
    renderPromptPartRuneComplete: function() {
        if (this.review.isComplete()) {
            this.review.stop();
            this.review.set('teach', false);
            this.canvas.disableInput();
            this.canvas.injectGradingColor();
            this.canvas.stopTeaching();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = true;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.toolbarGrading.select(this.review.get('score'));
            this.vocabReading.render();
            this.vocabWriting.render();
        } else {
            this.renderPromptPartRune();
        }
        return this;
    },
    /**
     * @method renderPromptPartTone
     * @returns {Prompt}
     */
    renderPromptPartTone: function() {
        this.canvas.redrawCharacter();
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        } else {
            this.canvas.showCharacterHint();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = true;
            this.toolbarAction.buttonShow = true;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.vocabReading.render();
            this.vocabWriting.render();
            this.canvas.enableInput();
            this.review.start();
        }
        return this;
    },
    /**
     * @method renderPromptPartToneComplete
     * @returns {Prompt}
     */
    renderPromptPartToneComplete: function() {
        if (this.review.isComplete()) {
            this.review.stop();
            this.review.set('teach', false);
            this.canvas.disableInput();
            this.canvas.injectGradingColor();
            this.canvas.showCharacterHint();
            this.canvas.stopTeaching();
            this.toolbarAction.buttonCorrect = true;
            this.toolbarAction.buttonErase = true;
            this.toolbarAction.buttonShow = false;
            this.toolbarAction.buttonTeach = false;
            this.toolbarAction.render();
            this.toolbarGrading.select(this.review.get('score'));
            this.vocabReading.render();
            this.vocabWriting.render();
        } else {
            this.renderPromptPartTone();
        }
        return this;
    },
    /**
     * @method handleCanvasAttemptFail
     */
    handleCanvasAttemptFail: function() {
        this.review.set('attempts', this.review.get('attempts') + 1);
        if (this.review.get('attempts') > 2) {
            this.canvas.showStrokeHint();
        }
    },
    /**
     * @method handleCanvasAttemptSuccess
     */
    handleCanvasAttemptSuccess: function() {
        this.review.set('attempts', 0);
        if (this.review.get('teach')) {
            this.canvas.startTeaching();
        }
    },
    /**
     * @method handleCanvasClick
     */
    handleCanvasClick: function() {
        if (this.review.isComplete()) {
            this.next();
        } else {
            switch (this.part) {
                case 'defn':
                    this.review.set('complete', true);
                    this.renderPromptComplete();
                    break;
                case 'rdng':
                    this.review.set('complete', true);
                    this.renderPromptComplete();
                    break;
            }
        }

    },
    /**
     * @method handleCanvasComplete
     */
    handleCanvasComplete: function() {
        this.review.set('complete', true);
        switch (this.part) {
            case 'defn':
                this.renderPromptPartDefnComplete();
                break;
            case 'rdng':
                this.renderPromptPartRdngComplete();
                break;
            case 'rune':
                this.renderPromptPartRuneComplete();
                break;
            case 'tone':
                this.renderPromptPartToneComplete();
                break;
        }
    },
    /**
     * @method handleCanvasInputUp
     */
    handleCanvasInputUp: function() {
        switch (this.part) {
            case 'rune':
                this.review.stopThinking();
                break;
            case 'tone':
                this.review.stopThinking();
                break;
        }
    },
    /**
     * @method handleCanvasNavigateNext
     */
    handleCanvasNavigateNext: function() {
        this.next();
    },
    /**
     * @method handleCanvasNavigatePrevious
     */
    handleCanvasNavigatePrevious: function() {
        this.previous();
    },
    /**
     * @method handleToolbarActionCorrect
     */
    handleToolbarActionCorrect: function() {
        this.review.set('score', this.review.get('score') > 1 ? 1 : 3);
        this.toolbarAction.render();
        if (this.review.isComplete()) {
            this.toolbarGrading.select(this.review.get('score'));
            this.canvas.injectGradingColor();
        }
    },
    /**
     * @method handleToolbarActionErase
     */
    handleToolbarActionErase: function() {
        switch (this.part) {
            case 'rune':
                this.review.set({complete: false, teach: false});
                this.review.character.reset();
                this.renderPrompt();
                break;
            case 'tone':
                this.review.set({complete: false, teach: false});
                this.review.character.reset();
                this.renderPrompt();
                break;
        }
    },
    /**
     * @method handleToolbarActionShow
     */
    handleToolbarActionShow: function() {
        switch (this.part) {
            case 'rune':
                this.review.set('score', 1);
                this.canvas.showCharacterHint();
                break;
        }
    },
    /**
     * @method handleToolbarActionTeach
     */
    handleToolbarActionTeach: function() {
        switch (this.part) {
            case 'rune':
                this.review.set({score: 1, teach: true});
                this.canvas.showCharacterHint();
                this.canvas.startTeaching();
                break;
        }
    },
    /**
     * @method handleToolbarGradingChange
     * @param {Number} value
     */
    handleToolbarGradingChange: function(value) {
        this.review.set('score', value);
    },
    /**
     * @method handleToolbarGradingMousedown
     * @param {Number} value
     */
    handleToolbarGradingMousedown: function(value) {
        if (this.review.isComplete()) {
            this.review.set('score', value);
            this.canvas.injectGradingColor();
        }
    },
    /**
     * @method handleToolbarGradingSelect
     * @param {Number} value
     */
    handleToolbarGradingSelect: function(value) {
        this.review.set('score', value);
        if (this.review.isComplete()) {
            this.next();
        }
    },
    /**
     * @method next
     */
    next: function() {
        if (this.reviews.next()) {
            this.renderPrompt()
        } else {
            this.trigger('next', this.reviews);
        }
    },
    /**
     * @method previous
     */
    previous: function() {
        if (this.reviews.previous()) {
            this.renderPrompt()
        } else {
            this.trigger('previous', this.reviews);
        }
    },
    /**
     * @method remove
     * @returns {Prompt}
     */
    remove: function() {
        this.canvas.remove();
        this.toolbarAction.remove();
        this.toolbarGrading.remove();
        this.vocabDefinition.remove();
        this.vocabMnemonic.remove();
        this.vocabReading.remove();
        this.vocabSentence.remove();
        this.vocabStyle.remove();
        this.vocabWriting.remove();
        return GelatoComponent.prototype.remove.call(this);
    },
    /**
     * @method reset
     * @returns {Prompt}
     */
    reset: function() {
        this.canvas.reset();
        return this;
    },
    /**
     * @method set
     * @param {PromptReviews} reviews
     * @returns {Prompt}
     */
    set: function(reviews) {
        console.info('PROMPT:', reviews.part, reviews.vocab.id, reviews);
        this.part = reviews.part;
        this.reviews = reviews;
        this.renderPromptLoad();
        this.renderPrompt();
        return this;
    }
});
