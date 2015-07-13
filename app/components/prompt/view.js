var GelatoComponent = require('gelato/modules/component');
var PromptCanvas = require('components/prompt-canvas/view');
var PromptDetails = require('components/prompt-details/view');
var PromptGrading = require('components/prompt-grading/view');
var PromptToolbar = require('components/prompt-toolbar/view');

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
        this.canvas = new PromptCanvas({prompt: this});
        this.details = new PromptDetails({prompt: this});
        this.grading = new PromptGrading({prompt: this});
        this.toolbar = new PromptToolbar({prompt: this});
        this.review = null;
        this.reviews = null;
        this.listenTo(this.canvas, 'canvas:click', this.handleCanvasClick);
        this.listenTo(this.canvas, 'input:up', this.handleCanvasInputUp);
        this.listenTo(this.canvas, 'navigate:left', this.handleNavigateLeft);
        this.listenTo(this.canvas, 'navigate:right', this.handleNavigateRight);
        this.listenTo(this.grading, 'mousedown', this.handleHighlightGrading);
        this.listenTo(this.grading, 'select', this.handleSelectGrading);
        this.on('resize', this.resize);
    },
    /**
     * @property template
     * @type {Function}
     */
    template: require('components/prompt/template'),
    /**
     * @method render
     * @returns {Prompt}
     */
    render: function() {
        this.renderTemplate();
        this.canvas.setElement('#prompt-canvas-container').render();
        this.details.setElement('#prompt-details-container').render();
        this.grading.setElement('#prompt-grading-container').render();
        this.toolbar.setElement('#prompt-toolbar-container').render();
        this.resize();
        return this;
    },
    /**
     * @method renderPrompt
     * @returns {Prompt}
     */
    renderPrompt: function() {
        this.review = this.reviews.active();
        switch (this.reviews.part) {
            case 'defn':
                this.renderPromptDefn();
                break;
            case 'rdng':
                this.renderPromptRdng();
                break;
            case 'rune':
                this.renderPromptRune();
                break;
            case 'tone':
                this.renderPromptTone();
                break;
        }
        if (this.reviews.isFirst()) {
            this.$('#navigate-left').hide();
        } else {
            this.$('#navigate-left').show();
        }
        return this;
    },
    /**
     * @method renderPromptComplete
     * @returns {Prompt}
     */
    renderPromptComplete: function() {
        this.review = this.reviews.active();
        switch (this.reviews.part) {
            case 'defn':
                this.renderPromptDefnComplete();
                break;
            case 'rdng':
                this.renderPromptRdngComplete();
                break;
            case 'rune':
                this.renderPromptRuneComplete();
                break;
            case 'tone':
                this.renderPromptToneComplete();
                break;
        }
        this.grading.select(this.review.get('score'));
        this.grading.show();
        return this;
    },
    /**
     * @method renderPromptLoad
     * @returns {Prompt}
     */
    renderPromptLoad: function() {
        this.reset();
        this.review = this.reviews.active();
        this.canvas.renderFields();
        this.details.renderFields();
        switch (this.reviews.part) {
            case 'defn':
                this.renderPromptDefnLoad();
                break;
            case 'rdng':
                this.renderPromptRdngLoad();
                break;
            case 'rune':
                this.renderPromptRuneLoad();
                break;
            case 'tone':
                this.renderPromptToneLoad();
                break;
        }
        return this;
    },

    
    /**
     * @method renderPromptDefn
     * @returns {Prompt}
     */
    renderPromptDefn: function() {
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        } else {
            this.review.start();
        }
        return this;
    },
    /**
     * @method renderPromptDefnComplete
     * @returns {Prompt}
     */
    renderPromptDefnComplete: function() {
        this.review.stop();
        this.review.set('complete', true);
        this.canvas.showDefinitionAnswer();
        this.details.showDefinition();
        this.details.showMnemonic();
        this.details.showSentence();
        return this;
    },
    /**
     * @method renderPromptDefnLoad
     * @returns {Prompt}
     */
    renderPromptDefnLoad: function() {
        this.canvas.disableGrid();
        this.canvas.disableInput();
        this.canvas.showDefinitionQuestion();
        this.details.hideDefinition();
        this.details.showReading();
        this.details.showReadingTone();
        this.details.showWriting();
        this.grading.hide();
        this.toolbar.disableErase();
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        return this;
    },

    
    /**
     * @method renderPromptRdng
     * @returns {Prompt}
     */
    renderPromptRdng: function() {
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        } else {
            this.review.start();
        }
        return this;
    },
    /**
     * @method renderPromptRdngComplete
     * @returns {Prompt}
     */
    renderPromptRdngComplete: function() {
        this.review.stop();
        this.review.set('complete', true);
        this.canvas.showReadingAnswer();
        this.details.showReading();
        this.details.showReadingTone();
        this.details.showMnemonic();
        this.details.showSentence();
        return this;
    },
    /**
     * @method renderPromptRdngLoad
     * @returns {Prompt}
     */
    renderPromptRdngLoad: function() {
        this.canvas.disableGrid();
        this.canvas.disableInput();
        this.canvas.showReadingQuestion();
        this.details.hideReading();
        this.details.showWriting();
        this.grading.hide();
        this.toolbar.disableErase();
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        return this;
    },


    /**
     * @method renderPromptRune
     * @returns {Prompt}
     */
    renderPromptRune: function() {
        this.canvas.reset();
        this.canvas.drawShape('surface', this.review.character.getUserShape());
        this.details.selectWriting(this.reviews.position);
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        } else {
            this.review.start();
            this.canvas.enableInput();
        }
        return this;
    },
    /**
     * @method renderPromptRuneComplete
     * @returns {Prompt}
     */
    renderPromptRuneComplete: function() {
        this.review.stop();
        this.canvas.disableInput();
        this.canvas.injectLayerColor('surface', this.review.getGradingColor());
        this.details.showWriting(this.reviews.position);
        this.details.showMnemonic();
        this.details.showSentence();
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        return this;
    },
    /**
     * @method renderPromptRuneLoad
     * @returns {Prompt}
     */
    renderPromptRuneLoad: function() {
        this.canvas.enableGrid();
        this.details.showDefinition();
        this.details.showReading();
        this.details.showReadingTone();
        this.grading.show();
        return this;
    },
    /**
     * @method handlePromptRuneRecognize
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    handlePromptRuneRecognize: function(points, shape) {
        var stroke = this.review.character.recognize(points, shape);
        if (stroke) {
            var targetShape = stroke.getTargetShape();
            var userShape = stroke.getUserShape();
            this.canvas.tweenShape('surface', userShape, targetShape);
            if (this.review.isComplete()) {
                this.renderPromptComplete();
            }
        }
    },


    /**
     * @method renderPromptTone
     * @returns {Prompt}
     */
    renderPromptTone: function() {
        this.canvas.reset();
        this.canvas.drawCharacter(
            'surface-background2',
            this.review.vocab.get('writing'),
            {
                color: '#e8ded2',
                font: this.review.vocab.getFontName()
            }
        );
        this.canvas.drawShape(
            'surface',
            this.review.character.getUserShape()
        );
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        } else {
            this.review.start();
            this.canvas.enableInput();
        }
        return this;
    },
    /**
     * @method renderPromptToneComplete
     * @returns {Prompt}
     */
    renderPromptToneComplete: function() {
        this.review.stop();
        this.canvas.disableInput();
        this.canvas.injectLayerColor('surface', this.review.getGradingColor());
        this.details.showReading(this.reviews.position);
        this.details.showReadingTone(this.reviews.position);
        this.details.showMnemonic();
        this.details.showSentence();
        this.grading.select(this.review.get('score'));
        return this;
    },
    /**
     * @method renderPromptToneLoad
     * @returns {Prompt}
     */
    renderPromptToneLoad: function() {
        this.canvas.disableGrid();
        this.details.showDefinition();
        this.details.showReading();
        this.details.showWriting();
        this.toolbar.disableErase();
        this.toolbar.disableShow();
        this.toolbar.disableStrokeOrder();
        return this;
    },
    /**
     * @method handlePromptToneRecognize
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    handlePromptToneRecognize: function(points, shape) {
        var character = this.review.character;
        var stroke = character.recognize(points, shape);
        var possibleTones = this.reviews.getToneNumbers();
        var expectedTone = character.getTone(possibleTones[0]);
        if (stroke && app.fn.getLength(points) > 30) {
            var targetShape = stroke.getTargetShape();
            var userShape = stroke.getUserShape();
            if (possibleTones.indexOf(stroke.get('tone')) > -1) {
                this.canvas.tweenShape('surface', userShape, targetShape);
                this.review.set('score', 3);
            } else {
                character.reset();
                character.add(expectedTone);
                this.canvas.drawShape('surface', expectedTone.getTargetShape());
                this.review.set('score', 1);
            }
        } else {
            character.add(expectedTone);
            if (possibleTones.indexOf(5) > -1) {
                this.canvas.drawShape('surface', character.getTargetShape());
                this.review.set('score', 3);
            } else {
                this.canvas.drawShape('surface', expectedTone.getTargetShape());
                this.review.set('score', 1);
            }
        }
        if (this.review.isComplete()) {
            this.renderPromptComplete();
        }
    },
    /**
     * @method handleCanvasClick
     */
    handleCanvasClick: function() {
        if (this.review.isComplete()) {
            this.next();
        } else if (this.reviews.part === 'defn') {
            this.renderPromptComplete();
        } else if (this.reviews.part === 'rdng') {
            this.renderPromptComplete();
        } else if (this.reviews.part === 'rune') {
            this.review.stopThinking();
        } else if (this.reviews.part === 'tone') {
            this.review.stopThinking();
        }
    },
    /**
     * @method handleCanvasInputUp
     * @param {Array} points
     * @param {createjs.Shape} shape
     */
    handleCanvasInputUp: function(points, shape) {
        switch (this.reviews.part) {
            case 'rune':
                this.handlePromptRuneRecognize(points, shape);
                break;
            case 'tone':
                this.handlePromptToneRecognize(points, shape);
                break;
        }
    },
    /**
     * @method handleNavigateLeft
     */
    handleNavigateLeft: function() {
        this.review.stop();
        this.previous();
    },
    /**
     * @method handleNavigateRight
     */
    handleNavigateRight: function() {
        this.review.stop();
        this.next();
    },
    /**
     * @method handleHighlightGrading
     * @param {Number} score
     */
    handleHighlightGrading: function(score) {
        if (this.review.isComplete()) {
            var gradingColor = app.user.settings.get('gradingColors')[score];
            this.canvas.injectLayerColor('surface', gradingColor);
        }
    },
    /**
     * @method handleSelectGrading
     * @param {Number} score
     */
    handleSelectGrading: function(score) {
        this.review.set('score', score);
        if (this.review.isComplete()) {
            this.next();
        }
    },
    /**
     * @method next
     */
    next: function() {
        if (this.reviews.next()) {
            this.reset().renderPrompt();
        } else {
            this.trigger('complete', this.reviews);
        }
    },
    /**
     * @method previous
     */
    previous: function() {
        if (this.reviews.previous()) {
            this.reset().renderPrompt();
        } else {
            this.trigger('previous', this.reviews);
        }
    },
    /**
     * @method remove
     * @returns {GelatoView}
     */
    remove: function() {
        this.canvas.remove();
        this.details.remove();
        this.grading.remove();
        this.toolbar.remove();
        return GelatoComponent.prototype.remove.call(this);
    },
    /**
     * @method resize
     * @returns {Prompt}
     */
    resize: function() {
        if (app.getWidth() < 1280) {
            this.canvas.resize(400);
        } else {
            this.canvas.resize(450);
        }
        if (this.review) {
            this.renderPrompt();
        }
        return this;
    },
    /**
     * @method reset
     * @returns {Prompt}
     */
    reset: function() {
        this.canvas.reset();
        this.grading.unselect();
        this.toolbar.enable();
        return this;
    },
    /**
     * @method set
     * @param {PromptReviews} reviews
     * @returns {Prompt}
     */
    set: function(reviews) {
        console.info('PROMPT:', reviews.item.id, reviews);
        this.reviews = reviews;
        this.renderPromptLoad();
        this.renderPrompt();
        return this;
    }
});