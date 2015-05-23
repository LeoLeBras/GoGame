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
        this.$grid = Sprint(options['element']);
        this.gridCanvas = this.$grid.dom[0].getContext('2d');
        this.cellSize = options['grid'].cellSize;
        this.gridSize = this.grid * this.cellSize;
    }

    _createClass(Builder, [{
        key: 'buildGrid',

        /**
         * Build the background grid
         *
         * @return canvas
         */
        value: function buildGrid() {

            // Set size of canvas
            this.$grid.dom[0].width = this.gridSize;
            this.$grid.dom[0].height = this.gridSize;

            // Init the canvas
            var c = this.gridCanvas;

            // Draw each lines of the grid
            for (var x = 1; x < this.grid; x++) {
                c.beginPath();
                c.moveTo(this.cellSize, this.cellSize * x);
                c.lineTo(this.gridSize - this.cellSize, this.cellSize * x);
                c.lineWidth = 1;
                c.stroke();
            }

            for (var y = 1; y < this.grid; y++) {
                c.beginPath();
                c.moveTo(this.cellSize * y, this.cellSize);
                c.lineTo(this.cellSize * y, this.gridSize - this.cellSize);
                c.lineWidth = 1;
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
     * Init options
     *
     * @param array options
     */

    function Gameplay(options) {
        _classCallCheck(this, Gameplay);

        console.log('Gameplay !');
    }

    _createClass(Gameplay, [{
        key: 'run',

        /**
         * Run
         *
         */
        value: function run() {
            console.log('Run');
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
        this.$goban = options["element"];
        this.cellSize = options["grid"].cellSize;
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
                element: this.$goban,
                grid: {
                    nbre: this.grid,
                    cellSize: this.cellSize
                }
            });
            GameBuilder.run();

            // Gameplay
            var GameGameplay = new _gameplayJs2["default"]({
                element: this.$goban });
            GameGameplay.run();
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
    element: '.Game_goban',
    grid: {
        nbre: '19',
        cellSize: 40,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1 }
};

// Initialize and run the game
var GoGame = new _appIndexJs2['default'](options);
GoGame.run();

},{"./app/index.js":3}]},{},[6])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxKZXUtZGUtR09cXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0pldS1kZS1HTy9zcmMvanMvYXBwL2J1aWxkZXIuanMiLCJEOi9Ecm9wYm94L1NpdGVzL3d3dy9KZXUtZGUtR08vc3JjL2pzL2FwcC9nYW1lcGxheS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0pldS1kZS1HTy9zcmMvanMvYXBwL2luZGV4LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvSmV1LWRlLUdPL3NyYy9qcy9hcHAvc2F2ZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0pldS1kZS1HTy9zcmMvanMvYXBwL3Njb3JlLmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvSmV1LWRlLUdPL3NyYy9qcy9mYWtlXzZjMGYxMDM5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2dCTSxPQUFPOzs7Ozs7OztBQVFFLGFBUlQsT0FBTyxDQVFHLE9BQU8sRUFBQzs4QkFSbEIsT0FBTzs7QUFTTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7QUFDeEMsWUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckQsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0tBQzdDOztpQkFkQyxPQUFPOzs7Ozs7OztlQTJCQSxxQkFBRTs7O0FBR1AsZ0JBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ3hDLGdCQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQzs7O0FBR3pDLGdCQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDOzs7QUFHeEIsaUJBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsSUFBSSxFQUFHLENBQUMsRUFBRSxFQUFDO0FBQy9CLGlCQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDZCxpQkFBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0MsaUJBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0QsaUJBQUMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDO0FBQ2hCLGlCQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDZDs7QUFFRCxpQkFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUcsQ0FBQyxFQUFFLEVBQUM7QUFDL0IsaUJBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNkLGlCQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzQyxpQkFBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzRCxpQkFBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDaEIsaUJBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNkO1NBRUo7Ozs7Ozs7O2VBV0UsZUFBRTtBQUNELGdCQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7U0FDcEI7OztXQWxFQyxPQUFPOzs7QUFzRWIsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUN0RW5CLFFBQVE7Ozs7Ozs7O0FBUUMsYUFSVCxRQUFRLENBUUUsT0FBTyxFQUFDOzhCQVJsQixRQUFROztBQVNOLGVBQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7S0FDN0I7O2lCQVZDLFFBQVE7Ozs7Ozs7ZUFzQlAsZUFBRTtBQUNELG1CQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3RCOzs7V0F4QkMsUUFBUTs7O0FBNEJkLE1BQU0sQ0FBQyxPQUFPLEdBQUcsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7eUJDNUJOLGNBQWM7Ozs7MEJBQ2IsZUFBZTs7OztzQkFDbkIsV0FBVzs7Ozt1QkFDVixZQUFZOzs7O0lBRXhCLElBQUk7Ozs7Ozs7OztBQVFLLGFBUlQsSUFBSSxDQVFNLE9BQU8sRUFBQzs4QkFSbEIsSUFBSTs7QUFTRixZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDO0tBQzVDOztpQkFaQyxJQUFJOzs7Ozs7O2VBdUJILGVBQUU7OztBQUdELGdCQUFJLFdBQVcsR0FBRywyQkFBWTtBQUMxQix1QkFBTyxFQUFFLElBQUksQ0FBQyxNQUFNO0FBQ3BCLG9CQUFJLEVBQUU7QUFDRix3QkFBSSxFQUFFLElBQUksQ0FBQyxJQUFJO0FBQ2YsNEJBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTtpQkFDMUI7YUFDSixDQUFDLENBQUM7QUFDSCx1QkFBVyxDQUFDLEdBQUcsRUFBRSxDQUFDOzs7QUFHbEIsZ0JBQUksWUFBWSxHQUFHLDRCQUFhO0FBQzVCLHVCQUFPLEVBQUUsSUFBSSxDQUFDLE1BQU0sRUFDdkIsQ0FBQyxDQUFDO0FBQ0gsd0JBQVksQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUV0Qjs7O1dBekNDLElBQUk7OztBQTRDVixNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDakRULEtBQUssR0FFSCxTQUZGLEtBQUssR0FFRDswQkFGSixLQUFLOztBQUdWLFFBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0NBQ25COztRQUpRLEtBQUssR0FBTCxLQUFLOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUNBTCxLQUFLLFlBQUwsS0FBSzt3QkFBTCxLQUFLOzs7UUFBTCxLQUFLLEdBQUwsS0FBSzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7MEJDREQsZ0JBQWdCOzs7OztBQUdqQyxJQUFJLE9BQU8sR0FBRztBQUNWLFdBQU8sRUFBRSxhQUFhO0FBQ3RCLFFBQUksRUFBRTtBQUNGLFlBQUksRUFBRSxJQUFJO0FBQ1YsZ0JBQVEsRUFBRSxFQUFFO0FBQ1osdUJBQWUsRUFBRSxPQUFPO0FBQ3hCLG1CQUFXLEVBQUUsT0FBTztBQUNwQixtQkFBVyxFQUFFLENBQUMsRUFDakI7Q0FDSixDQUFDOzs7QUFHRixJQUFJLE1BQU0sR0FBRyw0QkFBUyxPQUFPLENBQUMsQ0FBQztBQUMvQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIC8qKlxyXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxyXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcclxuICAqIEhFVElDIFAyMDE5XHJcbiAgKlxyXG4gICogQnVpbGRlciBtb2R1bGVcclxuICAqXHJcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxyXG4gICpcclxuICAqIENvcHlyaWdodCAyMDEyLCAyMDE0XHJcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICAqXHJcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxyXG4gICovXHJcblxyXG5jbGFzcyBCdWlsZGVye1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXQgb3B0aW9uc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBhcnJheSBvcHRpb25zXHJcbiAgICAgKi8gICAgIFxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XHJcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XHJcbiAgICAgICAgdGhpcy4kZ3JpZCA9IFNwcmludChvcHRpb25zWydlbGVtZW50J10pO1xyXG4gICAgICAgIHRoaXMuZ3JpZENhbnZhcyA9IHRoaXMuJGdyaWQuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcclxuICAgICAgICB0aGlzLmdyaWRTaXplID0gdGhpcy5ncmlkICogdGhpcy5jZWxsU2l6ZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIHRoZSBiYWNrZ3JvdW5kIGdyaWRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGNhbnZhc1xyXG4gICAgICovICBcclxuICAgIGJ1aWxkR3JpZCgpe1xyXG5cclxuICAgICAgICAvLyBTZXQgc2l6ZSBvZiBjYW52YXNcclxuICAgICAgICB0aGlzLiRncmlkLmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XHJcbiAgICAgICAgdGhpcy4kZ3JpZC5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcclxuXHJcbiAgICAgICAgLy8gSW5pdCB0aGUgY2FudmFzXHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLmdyaWRDYW52YXM7XHJcblxyXG4gICAgICAgIC8vIERyYXcgZWFjaCBsaW5lcyBvZiB0aGUgZ3JpZFxyXG4gICAgICAgIGZvcih2YXIgeCA9IDE7IHggPCB0aGlzLmdyaWQgOyB4Kyspe1xyXG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XHJcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XHJcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gMTtcclxuICAgICAgICAgICAgYy5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZvcih2YXIgeSA9IDE7IHkgPCB0aGlzLmdyaWQgOyB5Kyspe1xyXG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplICogeSwgdGhpcy5jZWxsU2l6ZSk7XHJcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSk7XHJcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gMTtcclxuICAgICAgICAgICAgYy5zdHJva2UoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCdWlsZCBhbGwgZWxlbWVudHNcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgcnVuKCl7XHJcbiAgICAgICAgdGhpcy5idWlsZEdyaWQoKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQnVpbGRlcjsiLCIgLyoqXHJcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXHJcbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xyXG4gICogSEVUSUMgUDIwMTlcclxuICAqXHJcbiAgKiBHYW1lcGxheSBtb2R1bGVcclxuICAqXHJcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxyXG4gICpcclxuICAqIENvcHlyaWdodCAyMDEyLCAyMDE0XHJcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICAqXHJcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxyXG4gICovXHJcblxyXG5jbGFzcyBHYW1lcGxheXtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0IG9wdGlvbnNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9uc1xyXG4gICAgICovICAgICBcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdHYW1lcGxheSAhJyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSdW5cclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgcnVuKCl7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ1J1bicpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lcGxheTsiLCIgLyoqXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gICogSEVUSUMgUDIwMTlcbiAgKiBcbiAgKiBJbmRleFxuICAqXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcbiAgKlxuICAqIENvcHlyaWdodCAyMDEyLCAyMDE0XG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICAqXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcbiAgKi9cblxuaW1wb3J0IEJ1aWxkZXIgZnJvbSBcIi4vYnVpbGRlci5qc1wiO1xuaW1wb3J0IEdhbWVwbGF5IGZyb20gXCIuL2dhbWVwbGF5LmpzXCI7XG5pbXBvcnQgU2F2ZSBmcm9tIFwiLi9zYXZlLmpzXCI7XG5pbXBvcnQgU2NvcmUgZnJvbSBcIi4vc2NvcmUuanNcIjtcblxuY2xhc3MgR2FtZXtcblxuICAgIC8qKlxuICAgICAqIEluaXQgb3B0aW9uc1xuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgICAqIEByZXR1cm4gXG4gICAgICovICAgICBcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuJGdvYmFuID0gb3B0aW9uc1snZWxlbWVudCddO1xuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBSdW4gdGhlIGdhbWVcbiAgICAgKlxuICAgICAqLyAgXG4gICAgcnVuKCl7XG5cbiAgICAgICAgLy8gQnVpbGRlclxuICAgICAgICB2YXIgR2FtZUJ1aWxkZXIgPSBuZXcgQnVpbGRlcih7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2JhbixcbiAgICAgICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICAgICAgICBuYnJlOiB0aGlzLmdyaWQsXG4gICAgICAgICAgICAgICAgY2VsbFNpemU6IHRoaXMuY2VsbFNpemVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIEdhbWVCdWlsZGVyLnJ1bigpO1xuXG4gICAgICAgIC8vIEdhbWVwbGF5XG4gICAgICAgIHZhciBHYW1lR2FtZXBsYXkgPSBuZXcgR2FtZXBsYXkoe1xuICAgICAgICAgICAgZWxlbWVudDogdGhpcy4kZ29iYW4sXG4gICAgICAgIH0pO1xuICAgICAgICBHYW1lR2FtZXBsYXkucnVuKCk7XG5cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcblxuIiwiIC8qKlxyXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxyXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcclxuICAqIEhFVElDIFAyMDE5XHJcbiAgKlxyXG4gICogU2F2ZSBtb2R1bGVcclxuICAqXHJcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxyXG4gICpcclxuICAqIENvcHlyaWdodCAyMDEyLCAyMDE0XHJcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICAqXHJcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxyXG4gICovXHJcblxyXG5leHBvcnQgY2xhc3MgU2NvcmV7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLnNjb3JlID0gW107XHJcbiAgICB9XHJcblxyXG59IiwiIC8qKlxyXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxyXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcclxuICAqIEhFVElDIFAyMDE5XHJcbiAgKlxyXG4gICogU2NvcmUgbW9kdWxlXHJcbiAgKlxyXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcclxuICAqXHJcbiAgKiBDb3B5cmlnaHQgMjAxMiwgMjAxNFxyXG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXHJcbiAgKlxyXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcclxuICAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjb3Jle1xyXG5cclxuXHJcbn0iLCIgLyoqXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gICogSEVUSUMgUDIwMTlcbiAgKlxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZWxlcilcbiAgKlxuICAqIENvcHlyaWdodCAyMDEyLCAyMDE0XG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICAqXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcbiAgKi9cblxuLy8gSW1wb3J0IHRoZSBhcHBcbmltcG9ydCBHYW1lIGZyb20gXCIuL2FwcC9pbmRleC5qc1wiO1xuXG4vLyBTZXQgb3B0aW9uc1xudmFyIG9wdGlvbnMgPSB7XG4gICAgZWxlbWVudDogJy5HYW1lX2dvYmFuJyxcbiAgICBncmlkOiB7XG4gICAgICAgIG5icmU6ICcxOScsXG4gICAgICAgIGNlbGxTaXplOiA0MCxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICAgICAgICBib3JkZXJDb2xvcjogJ2JsYWNrJyxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDEsXG4gICAgfVxufTtcblxuLy8gSW5pdGlhbGl6ZSBhbmQgcnVuIHRoZSBnYW1lXG52YXIgR29HYW1lID0gbmV3IEdhbWUob3B0aW9ucyk7XG5Hb0dhbWUucnVuKCk7Il19
