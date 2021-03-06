var GelatoComponent = require('gelato/component');

/**
 * @class StudyPromptPartRune
 * @extends {GelatoComponent}
 */
module.exports = GelatoComponent.extend({
  /**
   * @method initialize
   * @param {Object} options
   * @constructor
   */
  initialize: function(options) {
    this.prompt = options.prompt;
    this.listenTo(this.prompt.canvas, 'click', this.handlePromptCanvasClick);
    this.listenTo(this.prompt.canvas, 'doubletap', this.handlePromptDoubleTap);
    this.listenTo(this.prompt.canvas, 'swipeup', this.handlePromptCanvasSwipeUp);
    this.listenTo(this.prompt.canvas, 'tap', this.handlePromptCanvasTap);
    this.listenTo(this.prompt.canvas, 'input:up', this.handlePromptCanvasInputUp);
    this.listenTo(this.prompt.toolbarAction, 'click:correct', this.handlePromptToolbarActionCorrect);
    this.listenTo(this.prompt.toolbarAction, 'click:erase', this.handlePromptToolbarActionErase);
    this.listenTo(this.prompt.toolbarAction, 'click:show', this.handlePromptToolbarActionShow);
    this.listenTo(this.prompt.toolbarAction, 'click:teach', this.handlePromptToolbarActionTeach);
    this.listenTo(this.prompt.toolbarGrading, 'mousedown', this.handlePromptToolbarGradingMousedown);
    this.listenTo(this.prompt.toolbarGrading, 'mouseup', this.handlePromptCanvasClick);
    this.on('attempt:fail', this.handleAttemptFail);
    this.on('attempt:success', this.handleAttemptSuccess);
    this.on('resize', this.render);
  },
  /**
   * @property el
   * @type {String}
   */
  el: '#review-container',
  /**
   * @property events
   * @type Object
   */
  events: {},
  /**
   * @property template
   * @type {Function}
   */
  template: require('./template'),
  /**
   * @method render
   * @returns {StudyPromptPartRune}
   */
  render: function() {
    this.prompt.review = this.prompt.reviews.current();
    this.prompt.canvas.grid = true;
    this.prompt.canvas.reset();
    this.prompt.shortcuts.tone.stop_listening();
    this.prompt.toolbarAction.buttonCorrect = true;
    this.prompt.toolbarAction.buttonErase = true;
    this.prompt.toolbarAction.buttonShow = true;
    this.prompt.toolbarAction.buttonTeach = true;
    if (app.user.get('squigs')) {
      this.prompt.canvas.drawShape(
        'character',
        this.prompt.review.character.getUserSquig()
      );
    } else {
      this.prompt.canvas.drawShape(
        'character',
        this.prompt.review.character.getUserShape()
      );
    }
    if (this.prompt.review.isComplete()) {
      this.renderComplete();
    } else {
      this.renderIncomplete();
    }
    return this;
  },
  /**
   * @method renderComplete
   * @returns {StudyPromptPartRune}
   */
  renderComplete: function() {
    this.prompt.review.stop();
    this.prompt.review.set('complete', true);
    this.prompt.canvas.clearLayer('character-teach');
    this.prompt.canvas.disableInput();
    if (!this.prompt.review.get('showTeaching')) {
      this.prompt.canvas.injectLayerColor(
        'character',
        this.prompt.review.getGradingColor()
      );
    } else {
      this.prompt.review.set('score', 1);
    }
    this.prompt.navigation.render();
    this.prompt.shortcuts.grading.listen();
    this.prompt.toolbarAction.render();
    this.prompt.toolbarGrading.render();
    this.prompt.toolbarGrading.select(this.prompt.review.get('score'));
    this.prompt.toolbarVocab.render();
    this.prompt.vocabContained.render();
    this.prompt.vocabDefinition.render();
    this.prompt.vocabMnemonic.render();
    this.prompt.vocabReading.render();
    this.prompt.vocabSentence.render();
    this.prompt.vocabStyle.render();
    this.prompt.vocabWriting.render();
    if (app.user.isAudioEnabled() &&
      app.user.get('hideReading') &&
      this.prompt.reviews.isLast()) {
      this.prompt.reviews.vocab.play();
    }
    if (app.user.get('squigs')) {
      this.prompt.canvas.drawShape(
        'character-reveal',
        this.prompt.review.character.getTargetShape(),
        {color: '#e8ded2'}
      );
    }
    this.prompt.trigger('character:complete');
    this.renderTemplate();
    return this;
  },
  /**
   * @method renderIncomplete
   * @returns {StudyPromptPartRune}
   */
  renderIncomplete: function() {
    this.prompt.review.start();
    this.prompt.review.set('complete', false);
    this.prompt.canvas.enableInput();
    this.prompt.navigation.render();
    this.prompt.shortcuts.grading.stop_listening();
    this.prompt.toolbarAction.render();
    this.prompt.toolbarGrading.render();
    this.prompt.toolbarVocab.render();
    this.prompt.vocabContained.render();
    this.prompt.vocabDefinition.render();
    this.prompt.vocabMnemonic.render();
    this.prompt.vocabReading.render();
    this.prompt.vocabSentence.render();
    this.prompt.vocabStyle.render();
    this.prompt.vocabWriting.render();
    if (app.user.isAudioEnabled() && !app.user.get('hideReading') &&
      this.prompt.reviews.isFirst()) {
      this.prompt.reviews.vocab.play();
    }
    if (this.prompt.reviews.isTeachable() || this.prompt.review.get('showTeaching')) {
      this.teachCharacter();
    }
    if (this.prompt.review.item && this.prompt.review.item.isLeech()) {
      this.prompt.$('#leech-ribbon').removeClass('hidden');
      this.prompt.review.item.consecutiveWrong = 0;
      this.teachCharacter();
    } else {
      this.prompt.$('#leech-ribbon').addClass('hidden');
    }
    this.renderTemplate();
    return this;
  },
  /**
   * @method handleAttemptFail
   */
  handleAttemptFail: function() {
    var character = this.prompt.review.character;
    var failedConsecutive = this.prompt.review.get('failedConsecutive') + 1;
    var failedTotal = this.prompt.review.get('failedTotal') + 1;
    var maxStrokes = character.getMaxPosition();

    this.prompt.review.set('failedConsecutive', failedConsecutive);
    this.prompt.review.set('failedTotal', failedTotal);

    if (maxStrokes > 11) {
      if (failedTotal > 3) {
        this.prompt.review.set('score', 1);
      }
    } else if (maxStrokes > 6) {
      if (failedTotal > 3) {
        this.prompt.review.set('score', 1);
      }
    } else if (maxStrokes > 2) {
      if (failedTotal > 2) {
        this.prompt.review.set('score', 1);
      }
    } else {
      if (failedTotal > 0) {
        this.prompt.review.set('score', 1);
      }
    }

    if (failedConsecutive > 2) {
      var expectedStroke = character.getExpectedStroke();
      if (expectedStroke) {
        this.prompt.canvas.fadeShape('stroke-hint', expectedStroke.getTargetShape());
      }
    }
  },
  /**
   * @method handleAttemptSuccess
   */
  handleAttemptSuccess: function() {
    this.prompt.review.set('failedConsecutive', 0);
  },
  /**
   * @method handlePromptCanvasClick
   */
  handlePromptCanvasClick: function() {
    if (this.prompt.review.isComplete()) {
      if (this.prompt.review.item) {
        if (this.prompt.review.get('score') === 1) {
          this.prompt.review.item.consecutiveWrong++;
        } else {
          this.prompt.review.item.consecutiveWrong = 0;
        }
      }
      this.prompt.next();
    } else {
      this.prompt.canvas.fadeLayer('character-hint');
    }
  },
  /**
   * @method handlePromptCanvasInputUp
   * @param {Array} points
   * @param {createjs.Shape} shape
   */
  handlePromptCanvasInputUp: function(points, shape) {
    if (app.fn.getLength(points) >= 5) {
      var stroke = this.prompt.review.character.recognize(points, shape);
      if (stroke) {
        var targetShape = stroke.getTargetShape();
        var userShape = stroke.getUserShape();
        if (app.user.get('squigs')) {
          this.prompt.canvas.drawShape(
            'character',
            shape
          );
        } else {
          stroke.set('tweening', true);
          this.prompt.canvas.tweenShape(
            'character',
            userShape,
            targetShape
          );
        }
        this.trigger('attempt:success');
      } else {
        this.trigger('attempt:fail');
      }
      if (this.prompt.review.character.isComplete()) {
        this.renderComplete();
      } else {
        if (this.prompt.review.get('showTeaching')) {
          this.teachCharacter();
        }
      }
    }
  },
  /**
   * @method handlePromptCanvasSwipeUp
   */
  handlePromptCanvasSwipeUp: function() {
    this.prompt.review.set({
      complete: false,
      failedConsecutive: 0,
      failedTotal: 0,
      teach: false
    });
    this.prompt.review.character.reset();
    this.render();
  },
  /**
   * @method handlePromptDoubleTap
   */
  handlePromptDoubleTap: function() {
    var expectedShape = this.prompt.review.character.getTargetShape();
    if (expectedShape) {
      this.prompt.canvas.clearLayer('character-hint');
      this.prompt.canvas.drawShape(
        'character-hint',
        this.prompt.review.character.getTargetShape(),
        {color: '#e8ded2'}
      );
      this.prompt.review.set('score', 1);
    }
  },
  /**
   * @method handlePromptCanvasTap
   */
  handlePromptCanvasTap: function() {
    var expectedStroke = this.prompt.review.character.getExpectedStroke();
    if (expectedStroke) {
      this.prompt.canvas.clearLayer('stroke-hint');
      this.prompt.canvas.fadeShape('stroke-hint', expectedStroke.getTargetShape());
      this.handleAttemptFail();
    }
  },
  /**
   * @method handlePromptToolbarActionCorrect
   */
  handlePromptToolbarActionCorrect: function() {
    this.prompt.review.set('score', this.prompt.review.get('score') === 1 ? 3 : 1);
    this.prompt.toolbarGrading.select(this.prompt.review.get('score'));
    if (this.prompt.review.isComplete()) {
      this.prompt.canvas.injectLayerColor(
        'character',
        this.prompt.review.getGradingColor()
      );
    }
    this.prompt.toolbarAction.render();
  },
  /**
   * @method handlePromptToolbarActionErase
   */
  handlePromptToolbarActionErase: function() {
    this.eraseCharacter();
  },
  /**
   * @method handlePromptToolbarActionShow
   */
  handlePromptToolbarActionShow: function() {
    this.showCharacter();
  },
  /**
   * @method handlePromptToolbarActionTeach
   */
  handlePromptToolbarActionTeach: function() {
    this.teachCharacter();
  },
  /**
   * @method handlePromptToolbarGradingMousedown
   * @param {Number} value
   */
  handlePromptToolbarGradingMousedown: function(value) {
    if (this.prompt.review.isComplete()) {
      this.prompt.review.set('score', value);
      this.prompt.canvas.injectLayerColor(
        'character',
        this.prompt.review.getGradingColor()
      );
    }
  },
  /**
   * @method completeCharacter
   */
  completeCharacter: function() {
    this.prompt.canvas.clearLayer('character');
    this.prompt.review.set('complete', true);
    this.prompt.review.character.reset();
    this.prompt.review.character.add(this.prompt.review.character.targets[0].models);
    this.render();
  },
  /**
   * @method eraseCharacter
   */
  eraseCharacter: function() {
    this.prompt.review.set({complete: false, showTeaching: false});
    this.prompt.review.character.reset();
    this.render();
  },

  /**
   * Whether the keyboard shortcuts should be registered for this prompt
   * @type {Boolean}
   */
  registerShortcuts: true,

  /**
   * @method showCharacter
   */
  showCharacter: function() {
    this.prompt.review.set('score', 1);
    this.prompt.canvas.clearLayer('character-hint');
    this.prompt.canvas.drawShape(
      'character-hint',
      this.prompt.review.character.getTargetShape(),
      {color: '#e8ded2'}
    );
  },
  /**
   * @method teachCharacter
   */
  teachCharacter: function() {
    if (!this.prompt.review.isComplete()) {
      var stroke = this.prompt.review.character.getExpectedStroke();
      if (stroke) {
        this.prompt.review.set('score', 1);
        this.prompt.review.set('showTeaching', true);
        this.prompt.canvas.clearLayer('character-teach');
        this.prompt.canvas.drawShape(
          'character-teach',
          this.prompt.review.character.getTargetShape(),
          {color: '#e8ded2'}
        );
        this.prompt.canvas.drawShape(
          'character-teach',
          stroke.getTargetShape(),
          {color: '#e8ded2'}
        );
        this.prompt.canvas.tracePath(
          'character-teach',
          stroke.getParamPath()
        );
      }
    }
  }
});
