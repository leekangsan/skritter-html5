/**
 * @module Skritter
 * @submodule Prompts
 * @param Canvas
 * @author Joshua McFarland
 */
define([
    'components/Canvas',
    'backbone',
    'createjs.easel',
    'createjs.tween'
], function(Canvas) {
    /**
     * @class PromptCanvas
     * @extends Canvas
     */
    var PromptCanvas = Canvas.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Canvas.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {PromptCanvas}
         */
        render: function() {
            Canvas.prototype.render.call(this);
            this.createLayer('background');
            this.createLayer('hint');
            this.createLayer('stroke');
            this.createLayer('overlay');
            this.createLayer('indicator');
            this.createLayer('feedback');
            return this;
        }
    });


    return PromptCanvas;
});