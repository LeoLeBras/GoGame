(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * Minions in da’ game, brotha 😎
 * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
 * HETIC P2019
 *
 * Builder module
 *
 * Work with ES6+ (with babel transpiler)
 *
 * Copyright 2012, 2014
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date of creation : 2015-05-19
 */

var Builder = (function () {

    /**
     * Init options
     *
     * @param array options
     */

    function Builder(options) {
        _classCallCheck(this, Builder);

        this.grid = options['grid'].nbre;
        this.cellSize = options['grid'].cellSize;
        this.gridSize = (parseInt(this.grid) + 1) * this.cellSize;

        this.$goban = Sprint(options['goban'].element);
        this.$goban_gameplay = Sprint(options['gameplay'].element);
        this.$goban_grid = Sprint(options['grid'].element);

        this.gridCanvas = this.$goban_grid.dom[0].getContext('2d');
        this.gameplayCanvas = this.$goban_gameplay.dom[0].getContext('2d');
    }

    _createClass(Builder, [{
        key: 'buildGoban',

        /**
         * Build the goban
         *
         * @return css style of the goban
         */
        value: function buildGoban() {
            this.$goban.css({
                width: this.gridSize,
                height: this.gridSize });
        }
    }, {
        key: 'buildGameplay',

        /**
         * Build the gameplay
         *
         * @return canvas
         */
        value: function buildGameplay() {

            // Set size of canvas
            this.$goban_gameplay.dom[0].width = this.gridSize;
            this.$goban_gameplay.dom[0].height = this.gridSize;
            this.$goban_gameplay.css({
                width: this.gridSize,
                height: this.gridSize
            });
        }
    }, {
        key: 'buildGrid',

        /**
         * Build the grid
         *
         * @return canvas with a grid drawn
         */
        value: function buildGrid() {

            // Set size of canvas
            this.$goban_grid.dom[0].width = this.gridSize;
            this.$goban_grid.dom[0].height = this.gridSize;
            this.$goban_grid.css({
                width: this.gridSize,
                height: this.gridSize
            });

            // Init the canvas
            var c = this.gridCanvas;

            // Draw each lines of the grid
            for (var x = 1; x <= this.grid; x++) {
                c.beginPath();
                c.moveTo(this.cellSize, this.cellSize * x);
                c.lineTo(this.gridSize - this.cellSize, this.cellSize * x);
                c.lineWidth = 2;
                c.stroke();
            }
            for (var y = 1; y <= this.grid; y++) {
                c.beginPath();
                c.moveTo(this.cellSize * y, this.cellSize);
                c.lineTo(this.cellSize * y, this.gridSize - this.cellSize);
                c.lineWidth = 2;
                c.stroke();
            }
        }
    }, {
        key: 'run',

        /**
         * Build all elements
         *
         */
        value: function run() {
            this.buildGoban();
            this.buildGameplay();
            this.buildGrid();
        }
    }]);

    return Builder;
})();

module.exports = Builder;

},{}],2:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * Minions in da’ game, brotha 😎
 * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
 * HETIC P2019
 *
 * Gameplay module
 *
 * Work with ES6+ (with babel transpiler)
 *
 * Copyright 2012, 2014
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date of creation : 2015-05-19
 */

var Gameplay = (function () {

    /**
     * Init params
     *
     * @param array options
     */

    function Gameplay(options) {
        _classCallCheck(this, Gameplay);

        this.grid = options['grid'].nbre;
        this.$goban = Sprint(options['element']);
        this.canvas = this.$goban.dom[0].getContext('2d');
        this.cellSize = options['grid'].cellSize;
        this.rockSize = options['rock'].size;
        this.player = 1;
    }

    _createClass(Gameplay, [{
        key: 'listenner',

        /**
         * Listen event on the gameplay 
         *
         */
        value: function listenner() {
            this.create();
            Sprint(this.$goban).on('click', (function (e) {
                this.create(e.layerX, e.layerY);
            }).bind(this));
        }
    }, {
        key: 'create',

        /**
         * Create a rock
         *
         * @params coordinates click
         * @return a rock drawn on the canvas
         */
        value: function create(layerX, layerY) {

            console.log(this.player++ % 2 + 1);

            // Set coordinates
            var x = Math.floor((layerX + this.cellSize / 2) / this.cellSize);
            var y = Math.floor((layerY + this.cellSize / 2) / this.cellSize);

            // Draw the rock
            if (1 <= x && x <= this.grid && 1 <= y && y <= this.grid) {
                var c = this.canvas;
                c.beginPath();
                c.arc(x * this.cellSize, y * this.cellSize, this.rockSize, 0, 2 * Math.PI, false);
                c.closePath();
                c.fillStyle = 'black';
                c.fill();
            }
        }
    }]);

    return Gameplay;
})();

module.exports = Gameplay;

},{}],3:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Minions in da’ game, brotha 😎
 * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
 * HETIC P2019
 * 
 * Index
 *
 * Work with ES6+ (with babel transpiler)
 *
 * Copyright 2012, 2014
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date of creation : 2015-05-19
 */

var _builderJs = require("./builder.js");

var _builderJs2 = _interopRequireDefault(_builderJs);

var _gameplayJs = require("./gameplay.js");

var _gameplayJs2 = _interopRequireDefault(_gameplayJs);

var _saveJs = require("./save.js");

var _saveJs2 = _interopRequireDefault(_saveJs);

var _scoreJs = require("./score.js");

var _scoreJs2 = _interopRequireDefault(_scoreJs);

var Game = (function () {

    /**
     * Init options
     *
     * @param array options (optional)
     * @return 
     */

    function Game(options) {
        _classCallCheck(this, Game);

        this.grid = options["grid"].nbre;
        this.$goban = options["goban"].element;
        this.$goban_grid = options["grid"].element;
        this.$goban_gameplay = options["gameplay"].element;
        this.cellSize = options["grid"].cellSize;
        this.rockSize = options["rock"].size;
    }

    _createClass(Game, [{
        key: "run",

        /**
         * Run the game
         *
         */
        value: function run() {

            // Builder
            var GameBuilder = new _builderJs2["default"]({
                goban: {
                    element: this.$goban
                },
                gameplay: {
                    element: this.$goban_gameplay
                },
                grid: {
                    element: this.$goban_grid,
                    nbre: this.grid,
                    cellSize: this.cellSize
                }
            });
            GameBuilder.run();

            // Gameplay
            var GameGameplay = new _gameplayJs2["default"]({
                element: this.$goban_gameplay,
                grid: {
                    nbre: this.grid,
                    cellSize: this.cellSize
                },
                rock: {
                    size: this.rockSize }
            });
            GameGameplay.listenner();
        }
    }]);

    return Game;
})();

module.exports = Game;

},{"./builder.js":1,"./gameplay.js":2,"./save.js":4,"./score.js":5}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Minions in da’ game, brotha 😎
 * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
 * HETIC P2019
 *
 * Save module
 *
 * Work with ES6+ (with babel transpiler)
 *
 * Copyright 2012, 2014
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date of creation : 2015-05-19
 */

var Score = function Score() {
    _classCallCheck(this, Score);

    this.score = [];
};

exports.Score = Score;

},{}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Minions in da’ game, brotha 😎
 * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
 * HETIC P2019
 *
 * Score module
 *
 * Work with ES6+ (with babel transpiler)
 *
 * Copyright 2012, 2014
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date of creation : 2015-05-19
 */

var Score = function Score() {
  _classCallCheck(this, Score);
};

exports.Score = Score;

},{}],6:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Minions in da’ game, brotha 😎
 * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
 * HETIC P2019
 *
 * Work with ES6+ (with babel transpileler)
 *
 * Copyright 2012, 2014
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date of creation : 2015-05-19
 */

// Import the app

var _appIndexJs = require('./app/index.js');

var _appIndexJs2 = _interopRequireDefault(_appIndexJs);

// Set options
var options = {
    goban: {
        element: '.Game_goban' },
    gameplay: {
        element: '.Game_goban_gameplay' },
    grid: {
        nbre: '19',
        element: '.Game_goban_grid',
        cellSize: 40,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1 },
    rock: {
        size: 15,
        player1Color: 'grey',
        player2Color: 'black' }
};

// Initialize and run the game
var GoGame = new _appIndexJs2['default'](options);
GoGame.run();

},{"./app/index.js":3}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2J1aWxkZXIuanMiLCJEOi9Ecm9wYm94L1NpdGVzL3d3dy9Hb0dhbWUvc3JjL2pzL2FwcC9nYW1lcGxheS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2luZGV4LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvc2F2ZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL3Njb3JlLmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9mYWtlX2Y2NGU2MGNmLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2dCTSxPQUFPOzs7Ozs7OztBQVFFLGFBUlQsT0FBTyxDQVFHLE9BQU8sRUFBQzs4QkFSbEIsT0FBTzs7QUFTTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7O0FBRTFELFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQyxZQUFJLENBQUMsZUFBZSxHQUFH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LENBQUM7OztBQUdGLElBQUksTUFBTSxHQUFHLDRCQUFTLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIgLyoqXHJcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXHJcbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xyXG4gICogSEVUSUMgUDIwMTlcclxuICAqXHJcbiAgKiBCdWlsZGVyIG1vZHVsZVxyXG4gICpcclxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXHJcbiAgKlxyXG4gICogQ29weXJpZ2h0IDIwMTIsIDIwMTRcclxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4gICpcclxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XHJcbiAgKi9cclxuXHJcbmNsYXNzIEJ1aWxkZXJ7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdCBvcHRpb25zXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnNcclxuICAgICAqLyAgICAgXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcclxuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcclxuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xyXG4gICAgICAgIHRoaXMuZ3JpZFNpemUgPSAocGFyc2VJbnQodGhpcy5ncmlkKSArIDEpICogdGhpcy5jZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ29iYW4nXS5lbGVtZW50KTtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheSA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQgPSBTcHJpbnQob3B0aW9uc1snZ3JpZCddLmVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmdyaWRDYW52YXMgPSB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuZ2FtZXBsYXlDYW52YXMgPSB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIHRoZSBnb2JhblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gY3NzIHN0eWxlIG9mIHRoZSBnb2JhblxyXG4gICAgICovICBcclxuICAgIGJ1aWxkR29iYW4oKXtcclxuICAgICAgICB0aGlzLiRnb2Jhbi5jc3Moe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVpbGQgdGhlIGdhbWVwbGF5XHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBjYW52YXNcclxuICAgICAqLyAgXHJcbiAgICBidWlsZEdhbWVwbGF5KCl7XHJcblxyXG4gICAgICAgIC8vIFNldCBzaXplIG9mIGNhbnZhc1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmhlaWdodCA9IHRoaXMuZ3JpZFNpemU7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuY3NzKHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVpbGQgdGhlIGdyaWRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGNhbnZhcyB3aXRoIGEgZ3JpZCBkcmF3blxyXG4gICAgICovICBcclxuICAgIGJ1aWxkR3JpZCgpe1xyXG5cclxuICAgICAgICAvLyBTZXQgc2l6ZSBvZiBjYW52YXNcclxuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmNzcyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBJbml0IHRoZSBjYW52YXNcclxuICAgICAgICB2YXIgYyA9IHRoaXMuZ3JpZENhbnZhcztcclxuXHJcbiAgICAgICAgLy8gRHJhdyBlYWNoIGxpbmVzIG9mIHRoZSBncmlkXHJcbiAgICAgICAgZm9yKHZhciB4ID0gMTsgeCA8PSB0aGlzLmdyaWQgOyB4Kyspe1xyXG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XHJcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XHJcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gMjtcclxuICAgICAgICAgICAgYy5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKHZhciB5ID0gMTsgeSA8PSB0aGlzLmdyaWQgOyB5Kyspe1xyXG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplICogeSwgdGhpcy5jZWxsU2l6ZSk7XHJcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSk7XHJcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gMjtcclxuICAgICAgICAgICAgYy5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIGFsbCBlbGVtZW50c1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBydW4oKXtcclxuICAgICAgICB0aGlzLmJ1aWxkR29iYW4oKTtcclxuICAgICAgICB0aGlzLmJ1aWxkR2FtZXBsYXkoKTtcclxuICAgICAgICB0aGlzLmJ1aWxkR3JpZCgpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCdWlsZGVyOyIsIiAvKipcclxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cclxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXHJcbiAgKiBIRVRJQyBQMjAxOVxyXG4gICpcclxuICAqIEdhbWVwbGF5IG1vZHVsZVxyXG4gICpcclxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXHJcbiAgKlxyXG4gICogQ29weXJpZ2h0IDIwMTIsIDIwMTRcclxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4gICpcclxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XHJcbiAgKi9cclxuXHJcbmNsYXNzIEdhbWVwbGF5e1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXQgcGFyYW1zXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnNcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XHJcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XHJcbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZWxlbWVudCddKTtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJGdvYmFuLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XHJcbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gMTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0ZW4gZXZlbnQgb24gdGhlIGdhbWVwbGF5IFxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBsaXN0ZW5uZXIoKXtcclxuICAgICAgICB0aGlzLmNyZWF0ZSgpO1xyXG4gICAgICAgIFNwcmludCh0aGlzLiRnb2Jhbikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlKGUubGF5ZXJYLCBlLmxheWVyWSk7XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSByb2NrXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtcyBjb29yZGluYXRlcyBjbGlja1xyXG4gICAgICogQHJldHVybiBhIHJvY2sgZHJhd24gb24gdGhlIGNhbnZhc1xyXG4gICAgICovICBcclxuICAgIGNyZWF0ZShsYXllclgsIGxheWVyWSl7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKCgodGhpcy5wbGF5ZXIrKykgJSAyKSArIDEpO1xyXG5cclxuICAgICAgICAvLyBTZXQgY29vcmRpbmF0ZXMgXHJcbiAgICAgICAgdmFyIHggPSBNYXRoLmZsb29yKChsYXllclggKyB0aGlzLmNlbGxTaXplIC8gMikgLyB0aGlzLmNlbGxTaXplKTtcclxuICAgICAgICB2YXIgeSA9IE1hdGguZmxvb3IoKGxheWVyWSArIHRoaXMuY2VsbFNpemUgLyAyKSAvIHRoaXMuY2VsbFNpemUpO1xyXG5cclxuICAgICAgICAvLyBEcmF3IHRoZSByb2NrXHJcbiAgICAgICAgaWYoMSA8PSB4ICYmIHggPD0gdGhpcy5ncmlkICYmIDEgPD0geSAmJiB5IDw9IHRoaXMuZ3JpZCApe1xyXG4gICAgICAgICAgdmFyIGMgPSB0aGlzLmNhbnZhcztcclxuICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICBjLmFyYyh4ICogdGhpcy5jZWxsU2l6ZSwgeSAqIHRoaXMuY2VsbFNpemUsIHRoaXMucm9ja1NpemUsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICAgICAgICBjLmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgYy5maWxsU3R5bGUgPSAnYmxhY2snO1xyXG4gICAgICAgICAgYy5maWxsKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVwbGF5OyIsIiAvKipcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcbiAgKiBIRVRJQyBQMjAxOVxuICAqIFxuICAqIEluZGV4XG4gICpcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxuICAqXG4gICogQ29weXJpZ2h0IDIwMTIsIDIwMTRcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gICpcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICAqL1xuXG5pbXBvcnQgQnVpbGRlciBmcm9tIFwiLi9idWlsZGVyLmpzXCI7XG5pbXBvcnQgR2FtZXBsYXkgZnJvbSBcIi4vZ2FtZXBsYXkuanNcIjtcbmltcG9ydCBTYXZlIGZyb20gXCIuL3NhdmUuanNcIjtcbmltcG9ydCBTY29yZSBmcm9tIFwiLi9zY29yZS5qc1wiO1xuXG5jbGFzcyBHYW1le1xuXG4gICAgLyoqXG4gICAgICogSW5pdCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9ucyAob3B0aW9uYWwpXG4gICAgICogQHJldHVybiBcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcbiAgICAgICAgdGhpcy4kZ29iYW4gPSBvcHRpb25zWydnb2JhbiddLmVsZW1lbnQ7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQgPSBvcHRpb25zWydncmlkJ10uZWxlbWVudDtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkgPSBvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQ7XG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG4gICAgICAgIHRoaXMucm9ja1NpemUgPSBvcHRpb25zWydyb2NrJ10uc2l6ZTtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBnYW1lXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHJ1bigpe1xuXG4gICAgICAgIC8vIEJ1aWxkZXJcbiAgICAgICAgdmFyIEdhbWVCdWlsZGVyID0gbmV3IEJ1aWxkZXIoe1xuICAgICAgICAgIGdvYmFuOiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuJGdvYmFuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnYW1lcGxheToge1xuICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9nYW1lcGxheVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ3JpZDoge1xuICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9ncmlkLFxuICAgICAgICAgICAgICBuYnJlOiB0aGlzLmdyaWQsXG4gICAgICAgICAgICAgIGNlbGxTaXplOiB0aGlzLmNlbGxTaXplXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgR2FtZUJ1aWxkZXIucnVuKCk7XG5cblxuICAgICAgICAvLyBHYW1lcGxheVxuICAgICAgICB2YXIgR2FtZUdhbWVwbGF5ID0gbmV3IEdhbWVwbGF5KHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuJGdvYmFuX2dhbWVwbGF5LFxuICAgICAgICAgICAgZ3JpZDoge1xuICAgICAgICAgICAgICAgIG5icmU6IHRoaXMuZ3JpZCxcbiAgICAgICAgICAgICAgICBjZWxsU2l6ZTogdGhpcy5jZWxsU2l6ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJvY2s6IHtcbiAgICAgICAgICAgICAgICBzaXplOiB0aGlzLnJvY2tTaXplLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgR2FtZUdhbWVwbGF5Lmxpc3Rlbm5lcigpO1xuXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG5cbiIsIiAvKipcclxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cclxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXHJcbiAgKiBIRVRJQyBQMjAxOVxyXG4gICpcclxuICAqIFNhdmUgbW9kdWxlXHJcbiAgKlxyXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcclxuICAqXHJcbiAgKiBDb3B5cmlnaHQgMjAxMiwgMjAxNFxyXG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXHJcbiAgKlxyXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcclxuICAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjb3Jle1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5zY29yZSA9IFtdO1xyXG4gICAgfVxyXG5cclxufSIsIiAvKipcclxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cclxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXHJcbiAgKiBIRVRJQyBQMjAxOVxyXG4gICpcclxuICAqIFNjb3JlIG1vZHVsZVxyXG4gICpcclxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXHJcbiAgKlxyXG4gICogQ29weXJpZ2h0IDIwMTIsIDIwMTRcclxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4gICpcclxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XHJcbiAgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBTY29yZXtcclxuXHJcblxyXG59IiwiIC8qKlxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xuICAqIEhFVElDIFAyMDE5XG4gICpcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVsZXIpXG4gICpcbiAgKiBDb3B5cmlnaHQgMjAxMiwgMjAxNFxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAgKlxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gICovXG5cbi8vIEltcG9ydCB0aGUgYXBwXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9hcHAvaW5kZXguanNcIjtcblxuLy8gU2V0IG9wdGlvbnNcbnZhciBvcHRpb25zID0ge1xuICAgIGdvYmFuOiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2JhbicsXG4gICAgfSxcbiAgICBnYW1lcGxheToge1xuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW5fZ2FtZXBsYXknLFxuICAgIH0sXG4gICAgZ3JpZDoge1xuICAgICAgICBuYnJlOiAnMTknLFxuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW5fZ3JpZCcsXG4gICAgICAgIGNlbGxTaXplOiA0MCxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICAgICAgICBib3JkZXJDb2xvcjogJ2JsYWNrJyxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDEsXG4gICAgfSxcbiAgICByb2NrOntcbiAgICAgICAgc2l6ZTogMTUsXG4gICAgICAgIHBsYXllcjFDb2xvciA6ICdncmV5JyxcbiAgICAgICAgcGxheWVyMkNvbG9yIDogJ2JsYWNrJyxcbiAgICB9XG59O1xuXG4vLyBJbml0aWFsaXplIGFuZCBydW4gdGhlIGdhbWVcbnZhciBHb0dhbWUgPSBuZXcgR2FtZShvcHRpb25zKTtcbkdvR2FtZS5ydW4oKTsiXX0=
