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
 * Copyright 2015
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
        this.gridborderWidth = options['grid'].borderWidth;

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
         * Build the gameplay canvas
         *
         * @return canvas
         */
        value: function buildGameplay() {
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
                c.lineWidth = this.gridborderWidth;
                c.stroke();
            }
            for (var y = 1; y <= this.grid; y++) {
                c.beginPath();
                c.moveTo(this.cellSize * y, this.cellSize);
                c.lineTo(this.cellSize * y, this.gridSize - this.cellSize);
                c.lineWidth = this.gridborderWidth;
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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
 * Copyright 2015
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date of creation : 2015-05-19
 */

var _territoryJs = require('./territory.js');

var _territoryJs2 = _interopRequireDefault(_territoryJs);

var Gameplay = (function () {

    /**
     * Init params
     *
     * @param array options
     */

    function Gameplay(options) {
        _classCallCheck(this, Gameplay);

        this.$goban = Sprint(options['element']);
        this.canvas = this.$goban.dom[0].getContext('2d');

        this.grid = options['grid'].nbre;
        this.cellSize = options['grid'].cellSize;

        this.rockSize = options['rock'].size;
        this.rockPlayer1 = options['rock'].player1;
        this.rockPlayer2 = options['rock'].player2;

        this.player = 1;
        this.enemy = this.player++;

        this.tab = [];
        this.territories = [];
        this.territory = [];
        this.cache = [];

        // Initialyse the tab
        for (var x = 1; x <= this.grid; x++) {
            for (var y = 1; y <= this.grid; y++) {
                this.tab['' + x + ';' + y] = 0;
            }
        }
    }

    _createClass(Gameplay, [{
        key: 'listenner',

        /**
         * Listen event on the gameplay 
         *
         */
        value: function listenner() {

            // The player click on the goban to play
            Sprint(this.$goban).on('click', (function (e) {
                if (this.create(e.layerX, e.layerY)) {

                    // Debug
                    console.log('*********************************');
                    var color = this.rockPlayer1;
                    if (this.player == 2) {
                        color = this.rockPlayer2;
                    }
                    console.log('Joueur ' + this.player + ' (' + color + ') en ' + this.x + ';' + this.y);

                    this.rewriteGoban();
                    this.player = this.player++ % 2 + 1;
                    this.enemy = this.enemy++ % 2 + 1;
                }
            }).bind(this));
        }
    }, {
        key: 'checkSuicide',

        /**
         * Check if we are in a case of suicide
         *
         */
        value: function checkSuicide() {
            return false;
        }
    }, {
        key: 'checkKO',

        /**
         * Check if we are in a case of KO
         *
         */
        value: function checkKO() {
            return false;
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

            // Set coordinates
            this.x = Math.floor((layerX + this.cellSize / 2) / this.cellSize);
            this.y = Math.floor((layerY + this.cellSize / 2) / this.cellSize);

            // Set color
            var color = this.rockPlayer1;
            if (this.player == 2) {
                color = this.rockPlayer2;
            }

            // Check if we are on the goban
            if (1 <= this.x && this.x <= this.grid && 1 <= this.y && this.y <= this.grid) {

                // Check if the player can play at this place
                if (!this.checkSuicide() && !this.checkKO() && this.tab['' + this.x + ';' + this.y] == 0) {

                    // Draw the rock
                    var c = this.canvas;
                    c.beginPath();
                    c.arc(this.x * this.cellSize, this.y * this.cellSize, this.rockSize, 0, 2 * Math.PI, false);
                    c.closePath();
                    c.fillStyle = color;
                    c.fill();

                    // Save in the tab
                    this.tab['' + this.x + ';' + this.y] = this.player;

                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        }
    }, {
        key: 'rewriteGoban',

        /**
         * Rewrite goban with the last action of the player
         *
         */
        value: function rewriteGoban() {

            // Init territory
            this.territory = [];

            // Chek if there are ennemies around the last rock placed
            if (this.tab['' + this.x + ';' + (this.y - 1)] == this.enemy || this.tab['' + (this.x + 1) + ';' + this.y] == this.enemy || this.tab['' + this.x + ';' + (this.y + 1)] == this.enemy || this.tab['' + (this.x - 1) + ';' + this.y] == this.enemy) {

                // Return the territory of the neighbors
                if (this.tab['' + this.x + ';' + (this.y - 1)] == this.enemy) {
                    this.territory['top'] = new _territoryJs2['default'](this.tab, this.enemy, this.x, this.y - 1);
                }
                if (this.tab['' + (this.x + 1) + ';' + this.y] == this.enemy) {
                    this.territory['right'] = new _territoryJs2['default'](this.tab, this.enemy, this.x + 1, this.y);
                }
                if (this.tab['' + this.x + ';' + (this.y + 1)] == this.enemy) {
                    this.territory['bottom'] = new _territoryJs2['default'](this.tab, this.enemy, this.x, this.y + 1);
                }
                if (this.tab['' + (this.x - 1) + ';' + this.y] == this.enemy) {
                    this.territory['left'] = new _territoryJs2['default'](this.tab, this.enemy, this.x - 1, this.y);
                }

                for (var i in this.territory) {
                    console.log('***');
                    console.log('To ' + i + ' :');
                    console.log(this.territory[i].findBorderTerritory());
                }

                /*
                // Gather border territories
                this.cache = [];
                for(let i in this.territory){
                    let territory = this.territory[i].findBorderTerritory();
                    if(this.cache.indexOf(JSON.stringify(territory)) != 1){
                        this.territories.push(territory);
                        this.cache.push(JSON.stringify(territory));
                    }
                }
                  // For each border territories, check if it's around
                console.log('***');
                console.log(`Territoire(s) nettoyé(s) :`);
                for(let territory of this.territories){
                    console.log(territory);
                }*/
            }
        }
    }]);

    return Gameplay;
})();

module.exports = Gameplay;

},{"./territory.js":6}],3:[function(require,module,exports){
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
 * Copyright 2015
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
        this.gridBorderWidth = options["grid"].borderWidth;

        this.$goban = options["goban"].element;
        this.$goban_grid = options["grid"].element;
        this.$goban_gameplay = options["gameplay"].element;

        this.cellSize = options["grid"].cellSize;

        this.rockSize = options["rock"].size;
        this.rockPlayer1 = options["rock"].player1;
        this.rockPlayer2 = options["rock"].player2;
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
                    cellSize: this.cellSize,
                    borderWidth: this.gridBorderWidth }
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
                    size: this.rockSize,
                    player1: this.rockPlayer1,
                    player2: this.rockPlayer2 }
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
 * Copyright 2015
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
 * Copyright 2015
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

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

/**
 * Minions in da’ game, brotha 😎
 * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
 * HETIC P2019
 *
 * Territory module
 *
 * Work with ES6+ (with babel transpiler)
 *
 * Copyright 2015
 * Released under the MIT license
 * http://opensource.org/licenses/MIT
 *
 * Date of creation : 2015-05-19
 */

var Territory = (function () {
    function Territory(tab, enemy, x, y) {
        _classCallCheck(this, Territory);

        this.tab = tab;
        this.enemy = enemy;
        this.x = x;
        this.y = y;
        this.start = '' + this.x + ';' + (this.y - 1);
        this.cache = [];
        this.around = [];
        this.territory = [];
        this.borderTerritory = [];
    }

    _createClass(Territory, [{
        key: 'findTerritory',
        value: function findTerritory() {

            // Init around rocks
            this.around = [];

            this.cache['' + this.x + ';' + this.y] = 'check';
            this.territory.push('' + this.x + ';' + this.y);

            // We check rocks around
            for (var i = 1; i <= 4; i++) {
                switch (i) {
                    case 1:
                        if (this.tab['' + this.x + ';' + (this.y - 1)] == this.enemy && this.cache['' + this.x + ';' + (this.y - 1)] != 'check') {
                            this.around.push('' + this.x + ';' + (this.y - 1));
                        }
                        break;

                    case 2:
                        if (this.tab['' + (this.x + 1) + ';' + this.y] == this.enemy && this.cache['' + (this.x + 1) + ';' + this.y] != 'check') {
                            this.around.push('' + (this.x + 1) + ';' + this.y);
                        }
                        break;

                    case 3:
                        if (this.tab['' + this.x + ';' + (this.y + 1)] == this.enemy && this.cache['' + this.x + ';' + (this.y + 1)] != 'check') {
                            this.around.push('' + this.x + ';' + (this.y + 1));
                        }
                        break;

                    case 4:
                        if (this.tab['' + (this.x - 1) + ';' + this.y] == this.enemy && this.cache['' + (this.x - 1) + ';' + this.y] != 'check') {
                            this.around.push('' + (this.x - 1) + ';' + this.y);
                        }
                        break;
                }
            }

            // If no enemies
            if (this.around.length == 0) {

                // This is the end, Hold your breath and count to ten, Feel the earth move, and them ... ♪♫
                if (this.start == '' + this.x + ';' + this.y) {}

                // Go back !
                else {}
            } else {

                // Check one enemy
                this.random = Math.floor(Math.random() * this.around.length);

                // Set new coordinates for the next jump
                var index = this.around[this.random].lastIndexOf(';');
                this.x = parseInt(this.around[this.random].substr(0, index));
                this.y = parseInt(this.around[this.random].substring(index + 1));

                // Jump by recursion to an another rock
                this.findTerritory();
            }
        }
    }, {
        key: 'findBorderTerritory',
        value: function findBorderTerritory() {

            this.findTerritory();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.territory[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var item = _step.value;

                    // Set coordinates of the current rock
                    var index = item.lastIndexOf(';');
                    this.x = parseInt(item.substr(0, index));
                    this.y = parseInt(item.substring(index + 1));

                    // Check if the rock is not totally around to know if it's on the border
                    if (!(this.tab['' + this.x + ';' + (this.y - 1)] == this.enemy && this.tab['' + (this.x + 1) + ';' + this.y] == this.enemy && this.tab['' + this.x + ';' + (this.y + 1)] == this.enemy && this.tab['' + (this.x - 1) + ';' + this.y] == this.enemy)) {
                        this.borderTerritory.push(item);
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion && _iterator['return']) {
                        _iterator['return']();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            return this.borderTerritory.sort();
        }
    }]);

    return Territory;
})();

exports.Territory = Territory;

module.exports = Territory;

},{}],7:[function(require,module,exports){
'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Minions in da’ game, brotha 😎
 * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
 * HETIC P2019
 *
 * Work with ES6+ (with babel transpileler)
 *
 * Copyright 2015
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
        nbre: '7',
        element: '.Game_goban_grid',
        cellSize: 40,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2 },
    rock: {
        size: 10,
        player1: 'grey',
        player2: 'black' }
};

// Initialize and run the game
var GoGame = new _appIndexJs2['default'](options);
GoGame.run();

},{"./app/index.js":3}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2J1aWxkZXIuanMiLCJEOi9Ecm9wYm94L1NpdGVzL3d3dy9Hb0dhbWUvc3JjL2pzL2FwcC9nYW1lcGxheS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2luZGV4LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvc2F2ZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL3Njb3JlLmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvdGVycml0b3J5LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9mYWtlXzQ0Mjg4Y2EuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0lDZ0JNLE9BQU87Ozs7Ozs7O0FBUUUsYUFSVCxPQUFPLENBUUcsT0FBTyxFQUFDOzhCQVJsQixPQUFPOztBQVNMLFlBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNqQyxZQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUM7O0FBRW5ELFlBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUN6QyxZQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENB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QUFJLE9BQU8sR0FBRztBQUNWLFNBQUssRUFBRTtBQUNILGVBQU8sRUFBRSxhQUFhLEVBQ3pCO0FBQ0QsWUFBUSxFQUFFO0FBQ04sZUFBTyxFQUFFLHNCQUFzQixFQUNsQztBQUNELFFBQUksRUFBRTtBQUNGLFlBQUksRUFBRSxHQUFHO0FBQ1QsZUFBTyxFQUFFLGtCQUFrQjtBQUMzQixnQkFBUSxFQUFFLEVBQUU7QUFDWix1QkFBZSxFQUFFLE9BQU87QUFDeEIsbUJBQVcsRUFBRSxPQUFPO0FBQ3BCLG1CQUFXLEVBQUUsQ0FBQyxFQUNqQjtBQUNELFFBQUksRUFBQztBQUNELFlBQUksRUFBRSxFQUFFO0FBQ1IsZUFBTyxFQUFFLE1BQU07QUFDZixlQUFPLEVBQUUsT0FBTyxFQUNuQjtDQUNKLENBQUM7OztBQUdGLElBQUksTUFBTSxHQUFHLDRCQUFTLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIgLyoqXHJcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXHJcbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xyXG4gICogSEVUSUMgUDIwMTlcclxuICAqXHJcbiAgKiBCdWlsZGVyIG1vZHVsZVxyXG4gICpcclxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXHJcbiAgKlxyXG4gICogQ29weXJpZ2h0IDIwMTVcclxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4gICpcclxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XHJcbiAgKi9cclxuXHJcbmNsYXNzIEJ1aWxkZXJ7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdCBvcHRpb25zXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnNcclxuICAgICAqLyAgICAgXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcclxuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcclxuICAgICAgICB0aGlzLmdyaWRib3JkZXJXaWR0aCA9IG9wdGlvbnNbJ2dyaWQnXS5ib3JkZXJXaWR0aDtcclxuXHJcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcclxuICAgICAgICB0aGlzLmdyaWRTaXplID0gKHBhcnNlSW50KHRoaXMuZ3JpZCkgKyAxKSAqIHRoaXMuY2VsbFNpemU7XHJcblxyXG4gICAgICAgIHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2dvYmFuJ10uZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkgPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkID0gU3ByaW50KG9wdGlvbnNbJ2dyaWQnXS5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmlkQ2FudmFzID0gdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICB0aGlzLmdhbWVwbGF5Q2FudmFzID0gdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCdWlsZCB0aGUgZ29iYW5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGNzcyBzdHlsZSBvZiB0aGUgZ29iYW5cclxuICAgICAqLyAgXHJcbiAgICBidWlsZEdvYmFuKCl7XHJcbiAgICAgICAgdGhpcy4kZ29iYW4uY3NzKHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIHRoZSBnYW1lcGxheSBjYW52YXNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGNhbnZhc1xyXG4gICAgICovICBcclxuICAgIGJ1aWxkR2FtZXBsYXkoKXtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0ud2lkdGggPSB0aGlzLmdyaWRTaXplO1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS5oZWlnaHQgPSB0aGlzLmdyaWRTaXplO1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmNzcyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVpbGQgdGhlIGdyaWRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGNhbnZhcyB3aXRoIGEgZ3JpZCBkcmF3blxyXG4gICAgICovICBcclxuICAgIGJ1aWxkR3JpZCgpe1xyXG5cclxuICAgICAgICAvLyBTZXQgc2l6ZSBvZiBjYW52YXNcclxuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmNzcyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBJbml0IHRoZSBjYW52YXNcclxuICAgICAgICB2YXIgYyA9IHRoaXMuZ3JpZENhbnZhcztcclxuXHJcbiAgICAgICAgLy8gRHJhdyBlYWNoIGxpbmVzIG9mIHRoZSBncmlkXHJcbiAgICAgICAgZm9yKHZhciB4ID0gMTsgeCA8PSB0aGlzLmdyaWQgOyB4Kyspe1xyXG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XHJcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XHJcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gdGhpcy5ncmlkYm9yZGVyV2lkdGg7XHJcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcih2YXIgeSA9IDE7IHkgPD0gdGhpcy5ncmlkIDsgeSsrKXtcclxuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgYy5tb3ZlVG8odGhpcy5jZWxsU2l6ZSAqIHksIHRoaXMuY2VsbFNpemUpO1xyXG4gICAgICAgICAgICBjLmxpbmVUbyh0aGlzLmNlbGxTaXplICogeSwgdGhpcy5ncmlkU2l6ZSAtIHRoaXMuY2VsbFNpemUpO1xyXG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xyXG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVpbGQgYWxsIGVsZW1lbnRzXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIHJ1bigpe1xyXG4gICAgICAgIHRoaXMuYnVpbGRHb2JhbigpO1xyXG4gICAgICAgIHRoaXMuYnVpbGRHYW1lcGxheSgpO1xyXG4gICAgICAgIHRoaXMuYnVpbGRHcmlkKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJ1aWxkZXI7IiwiIC8qKlxyXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxyXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcclxuICAqIEhFVElDIFAyMDE5XHJcbiAgKlxyXG4gICogR2FtZXBsYXkgbW9kdWxlXHJcbiAgKlxyXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcclxuICAqXHJcbiAgKiBDb3B5cmlnaHQgMjAxNVxyXG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXHJcbiAgKlxyXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcclxuICAqL1xyXG5cclxuaW1wb3J0IFRlcnJpdG9yeSBmcm9tIFwiLi90ZXJyaXRvcnkuanNcIjtcclxuXHJcbmNsYXNzIEdhbWVwbGF5e1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXQgcGFyYW1zXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnNcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XHJcblxyXG4gICAgICAgIHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2VsZW1lbnQnXSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRnb2Jhbi5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcclxuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xyXG5cclxuICAgICAgICB0aGlzLnJvY2tTaXplID0gb3B0aW9uc1sncm9jayddLnNpemU7XHJcbiAgICAgICAgdGhpcy5yb2NrUGxheWVyMSA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIxO1xyXG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcclxuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSAxO1xyXG4gICAgICAgIHRoaXMuZW5lbXkgPSB0aGlzLnBsYXllcisrO1xyXG5cclxuICAgICAgICB0aGlzLnRhYiA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVycml0b3JpZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbHlzZSB0aGUgdGFiXHJcbiAgICAgICAgZm9yKHZhciB4ID0gMTsgeCA8PSB0aGlzLmdyaWQgOyB4Kyspe1xyXG4gICAgICAgICAgICBmb3IodmFyIHkgPSAxOyB5IDw9IHRoaXMuZ3JpZCA7IHkrKyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt4fTske3l9YF0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0ZW4gZXZlbnQgb24gdGhlIGdhbWVwbGF5IFxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBsaXN0ZW5uZXIoKXtcclxuXHJcbiAgICAgICAgLy8gVGhlIHBsYXllciBjbGljayBvbiB0aGUgZ29iYW4gdG8gcGxheVxyXG4gICAgICAgIFNwcmludCh0aGlzLiRnb2Jhbikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY3JlYXRlKGUubGF5ZXJYLCBlLmxheWVyWSkpe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBEZWJ1Z1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKmApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gdGhpcy5yb2NrUGxheWVyMTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMucGxheWVyID09IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0gdGhpcy5yb2NrUGxheWVyMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBKb3VldXIgJHt0aGlzLnBsYXllcn0gKCR7Y29sb3J9KSBlbiAke3RoaXMueH07JHt0aGlzLnl9YCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXdyaXRlR29iYW4oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyID0gKCh0aGlzLnBsYXllcisrKSAlIDIpICsgMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lbXkgPSAoKHRoaXMuZW5lbXkrKykgJSAyKSArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB3ZSBhcmUgaW4gYSBjYXNlIG9mIHN1aWNpZGVcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgY2hlY2tTdWljaWRlKCl7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHdlIGFyZSBpbiBhIGNhc2Ugb2YgS09cclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgY2hlY2tLTygpe1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSByb2NrXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtcyBjb29yZGluYXRlcyBjbGlja1xyXG4gICAgICogQHJldHVybiBhIHJvY2sgZHJhd24gb24gdGhlIGNhbnZhc1xyXG4gICAgICovICBcclxuICAgIGNyZWF0ZShsYXllclgsIGxheWVyWSl7XHJcblxyXG4gICAgICAgIC8vIFNldCBjb29yZGluYXRlcyBcclxuICAgICAgICB0aGlzLnggPSBNYXRoLmZsb29yKChsYXllclggKyB0aGlzLmNlbGxTaXplIC8gMikgLyB0aGlzLmNlbGxTaXplKTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLmZsb29yKChsYXllclkgKyB0aGlzLmNlbGxTaXplIC8gMikgLyB0aGlzLmNlbGxTaXplKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IGNvbG9yXHJcbiAgICAgICAgdmFyIGNvbG9yID0gdGhpcy5yb2NrUGxheWVyMTtcclxuICAgICAgICBpZih0aGlzLnBsYXllciA9PSAyKXtcclxuICAgICAgICAgICAgY29sb3IgPSB0aGlzLnJvY2tQbGF5ZXIyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgYXJlIG9uIHRoZSBnb2JhblxyXG4gICAgICAgIGlmKDEgPD0gdGhpcy54ICYmIHRoaXMueCA8PSB0aGlzLmdyaWQgJiYgMSA8PSB0aGlzLnkgJiYgdGhpcy55IDw9IHRoaXMuZ3JpZCApe1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBsYXllciBjYW4gcGxheSBhdCB0aGlzIHBsYWNlXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmNoZWNrU3VpY2lkZSgpICYmICF0aGlzLmNoZWNrS08oKSAmJiB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55fWBdID09IDApe1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIERyYXcgdGhlIHJvY2tcclxuICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5jYW52YXM7XHJcbiAgICAgICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgYy5hcmModGhpcy54ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy55ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy5yb2NrU2l6ZSwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIGMuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgICAgICAgICBjLmZpbGxTdHlsZSA9IGNvbG9yO1xyXG4gICAgICAgICAgICAgICAgYy5maWxsKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gU2F2ZSBpbiB0aGUgdGFiXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55fWBdID0gdGhpcy5wbGF5ZXI7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJld3JpdGUgZ29iYW4gd2l0aCB0aGUgbGFzdCBhY3Rpb24gb2YgdGhlIHBsYXllclxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICByZXdyaXRlR29iYW4oKXtcclxuXHJcbiAgICAgICAgLy8gSW5pdCB0ZXJyaXRvcnlcclxuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IFtdO1xyXG5cclxuICAgICAgICAvLyBDaGVrIGlmIHRoZXJlIGFyZSBlbm5lbWllcyBhcm91bmQgdGhlIGxhc3Qgcm9jayBwbGFjZWRcclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueSAtIDF9YF0gPT0gdGhpcy5lbmVteSB8fFxyXG4gICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnggKyAxfTske3RoaXMueX1gXSA9PSB0aGlzLmVuZW15IHx8XHJcbiAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgKyAxfWBdID09IHRoaXMuZW5lbXkgfHxcclxuICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54IC0gMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSl7XHJcblxyXG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIHRlcnJpdG9yeSBvZiB0aGUgbmVpZ2hib3JzIFxyXG4gICAgICAgICAgICBpZih0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55IC0gMX1gXSA9PSB0aGlzLmVuZW15KXtcclxuICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3J5Wyd0b3AnXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCwgdGhpcy55IC0gMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRlcnJpdG9yeVsncmlnaHQnXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCArIDEsIHRoaXMueSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueSArIDF9YF0gPT0gdGhpcy5lbmVteSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRlcnJpdG9yeVsnYm90dG9tJ10gPSBuZXcgVGVycml0b3J5KHRoaXMudGFiLCB0aGlzLmVuZW15LCB0aGlzLngsIHRoaXMueSArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3RoaXMueCAtIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXJyaXRvcnlbJ2xlZnQnXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCAtIDEsIHRoaXMueSk7XHJcbiAgICAgICAgICAgIH0gXHJcblxyXG4gICAgICAgICAgICBmb3IodmFyIGkgaW4gdGhpcy50ZXJyaXRvcnkpe1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyoqKicpO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFRvICR7aX0gOmApO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy50ZXJyaXRvcnlbaV0uZmluZEJvcmRlclRlcnJpdG9yeSgpKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLypcclxuICAgICAgICAgICAgLy8gR2F0aGVyIGJvcmRlciB0ZXJyaXRvcmllc1xyXG4gICAgICAgICAgICB0aGlzLmNhY2hlID0gW107XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSBpbiB0aGlzLnRlcnJpdG9yeSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgdGVycml0b3J5ID0gdGhpcy50ZXJyaXRvcnlbaV0uZmluZEJvcmRlclRlcnJpdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbmRleE9mKEpTT04uc3RyaW5naWZ5KHRlcnJpdG9yeSkpICE9IDEpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3JpZXMucHVzaCh0ZXJyaXRvcnkpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaChKU09OLnN0cmluZ2lmeSh0ZXJyaXRvcnkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gRm9yIGVhY2ggYm9yZGVyIHRlcnJpdG9yaWVzLCBjaGVjayBpZiBpdCdzIGFyb3VuZFxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnKioqJyk7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBUZXJyaXRvaXJlKHMpIG5ldHRvecOpKHMpIDpgKTtcclxuICAgICAgICAgICAgZm9yKGxldCB0ZXJyaXRvcnkgb2YgdGhpcy50ZXJyaXRvcmllcyl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0ZXJyaXRvcnkpO1xyXG4gICAgICAgICAgICB9Ki9cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVwbGF5OyIsIiAvKipcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcbiAgKiBIRVRJQyBQMjAxOVxuICAqIFxuICAqIEluZGV4XG4gICpcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxuICAqXG4gICogQ29weXJpZ2h0IDIwMTVcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gICpcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICAqL1xuXG5pbXBvcnQgQnVpbGRlciBmcm9tIFwiLi9idWlsZGVyLmpzXCI7XG5pbXBvcnQgR2FtZXBsYXkgZnJvbSBcIi4vZ2FtZXBsYXkuanNcIjtcbmltcG9ydCBTYXZlIGZyb20gXCIuL3NhdmUuanNcIjtcbmltcG9ydCBTY29yZSBmcm9tIFwiLi9zY29yZS5qc1wiO1xuXG5jbGFzcyBHYW1le1xuXG4gICAgLyoqXG4gICAgICogSW5pdCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9ucyAob3B0aW9uYWwpXG4gICAgICogQHJldHVybiBcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcbiAgICAgICAgdGhpcy5ncmlkQm9yZGVyV2lkdGggPSBvcHRpb25zWydncmlkJ10uYm9yZGVyV2lkdGg7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBvcHRpb25zWydnb2JhbiddLmVsZW1lbnQ7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQgPSBvcHRpb25zWydncmlkJ10uZWxlbWVudDtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkgPSBvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcblxuICAgICAgICB0aGlzLnJvY2tTaXplID0gb3B0aW9uc1sncm9jayddLnNpemU7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjEgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMTtcbiAgICAgICAgdGhpcy5yb2NrUGxheWVyMiA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIyO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBSdW4gdGhlIGdhbWVcbiAgICAgKlxuICAgICAqLyAgXG4gICAgcnVuKCl7XG5cbiAgICAgICAgLy8gQnVpbGRlclxuICAgICAgICB2YXIgR2FtZUJ1aWxkZXIgPSBuZXcgQnVpbGRlcih7XG4gICAgICAgICAgZ29iYW46IHtcbiAgICAgICAgICAgICAgZWxlbWVudDogdGhpcy4kZ29iYW5cbiAgICAgICAgICB9LFxuICAgICAgICAgIGdhbWVwbGF5OiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuJGdvYmFuX2dhbWVwbGF5XG4gICAgICAgICAgfSxcbiAgICAgICAgICBncmlkOiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuJGdvYmFuX2dyaWQsXG4gICAgICAgICAgICAgIG5icmU6IHRoaXMuZ3JpZCxcbiAgICAgICAgICAgICAgY2VsbFNpemU6IHRoaXMuY2VsbFNpemUsXG4gICAgICAgICAgICAgIGJvcmRlcldpZHRoIDogdGhpcy5ncmlkQm9yZGVyV2lkdGgsXG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgR2FtZUJ1aWxkZXIucnVuKCk7XG5cblxuICAgICAgICAvLyBHYW1lcGxheVxuICAgICAgICB2YXIgR2FtZUdhbWVwbGF5ID0gbmV3IEdhbWVwbGF5KHtcbiAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuJGdvYmFuX2dhbWVwbGF5LFxuICAgICAgICAgICAgZ3JpZDoge1xuICAgICAgICAgICAgICAgIG5icmU6IHRoaXMuZ3JpZCxcbiAgICAgICAgICAgICAgICBjZWxsU2l6ZTogdGhpcy5jZWxsU2l6ZVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJvY2s6IHtcbiAgICAgICAgICAgICAgICBzaXplOiB0aGlzLnJvY2tTaXplLFxuICAgICAgICAgICAgICAgIHBsYXllcjE6IHRoaXMucm9ja1BsYXllcjEsXG4gICAgICAgICAgICAgICAgcGxheWVyMjogdGhpcy5yb2NrUGxheWVyMixcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIEdhbWVHYW1lcGxheS5saXN0ZW5uZXIoKTtcblxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xuXG4iLCIgLyoqXHJcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXHJcbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xyXG4gICogSEVUSUMgUDIwMTlcclxuICAqXHJcbiAgKiBTYXZlIG1vZHVsZVxyXG4gICpcclxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXHJcbiAgKlxyXG4gICogQ29weXJpZ2h0IDIwMTVcclxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4gICpcclxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XHJcbiAgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBTY29yZXtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuc2NvcmUgPSBbXTtcclxuICAgIH1cclxuXHJcbn0iLCIgLyoqXHJcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXHJcbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xyXG4gICogSEVUSUMgUDIwMTlcclxuICAqXHJcbiAgKiBTY29yZSBtb2R1bGVcclxuICAqXHJcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxyXG4gICpcclxuICAqIENvcHlyaWdodCAyMDE1XHJcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICAqXHJcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxyXG4gICovXHJcblxyXG5leHBvcnQgY2xhc3MgU2NvcmV7XHJcblxyXG5cclxufSIsIiAvKipcclxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cclxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXHJcbiAgKiBIRVRJQyBQMjAxOVxyXG4gICpcclxuICAqIFRlcnJpdG9yeSBtb2R1bGVcclxuICAqXHJcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxyXG4gICpcclxuICAqIENvcHlyaWdodCAyMDE1XHJcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICAqXHJcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxyXG4gICovXHJcblxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5e1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhYiwgZW5lbXksIHgsIHkpe1xyXG4gICAgICAgIHRoaXMudGFiID0gdGFiO1xyXG4gICAgICAgIHRoaXMuZW5lbXkgPSBlbmVteTtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5zdGFydCA9IGAke3RoaXMueH07JHt0aGlzLnkgLSAxfWA7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xyXG4gICAgICAgIHRoaXMuYXJvdW5kID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBbXTtcclxuICAgICAgICB0aGlzLmJvcmRlclRlcnJpdG9yeSA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGZpbmRUZXJyaXRvcnkoKXtcclxuXHJcbiAgICAgICAgLy8gSW5pdCBhcm91bmQgcm9ja3NcclxuICAgICAgICB0aGlzLmFyb3VuZD0gW107XHJcblxyXG4gICAgICAgIHRoaXMuY2FjaGVbYCR7dGhpcy54fTske3RoaXMueX1gXSA9ICdjaGVjayc7XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkucHVzaChgJHt0aGlzLnh9OyR7dGhpcy55fWApO1xyXG5cclxuICAgICAgICAvLyBXZSBjaGVjayByb2NrcyBhcm91bmRcclxuICAgICAgICBmb3IodmFyIGkgPSAxOyBpIDw9IDQ7IGkrKyl7XHJcbiAgICAgICAgICAgIHN3aXRjaChpKXtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55IC0gMX1gXSA9PSB0aGlzLmVuZW15ICYmIHRoaXMuY2FjaGVbYCR7dGhpcy54fTske3RoaXMueSAtIDF9YF0gICE9ICdjaGVjaycpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFyb3VuZC5wdXNoKGAke3RoaXMueH07JHt0aGlzLnkgLSAxfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSAmJiB0aGlzLmNhY2hlW2Ake3RoaXMueCArIDF9OyR7dGhpcy55fWBdICAhPSAnY2hlY2snKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcm91bmQucHVzaChgJHt0aGlzLnggKyAxfTske3RoaXMueX1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgKyAxfWBdID09IHRoaXMuZW5lbXkgJiYgdGhpcy5jYWNoZVtgJHt0aGlzLnh9OyR7dGhpcy55ICsgMX1gXSAgIT0gJ2NoZWNrJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXJvdW5kLnB1c2goYCR7dGhpcy54fTske3RoaXMueSArIDF9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRhYltgJHt0aGlzLnggLSAxfTske3RoaXMueX1gXSA9PSB0aGlzLmVuZW15ICYmIHRoaXMuY2FjaGVbYCR7dGhpcy54IC0gMX07JHt0aGlzLnl9YF0gICE9ICdjaGVjaycpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFyb3VuZC5wdXNoKGAke3RoaXMueCAtIDF9OyR7dGhpcy55fWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgbm8gZW5lbWllc1xyXG4gICAgICAgIGlmKHRoaXMuYXJvdW5kLmxlbmd0aCA9PSAwKXtcclxuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgaXMgdGhlIGVuZCwgSG9sZCB5b3VyIGJyZWF0aCBhbmQgY291bnQgdG8gdGVuLCBGZWVsIHRoZSBlYXJ0aCBtb3ZlLCBhbmQgdGhlbSAuLi4g4pmq4pmrXHJcbiAgICAgICAgICAgIGlmKHRoaXMuc3RhcnQgPT0gYCR7dGhpcy54fTske3RoaXMueX1gKXtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gR28gYmFjayAhXHJcbiAgICAgICAgICAgIGVsc2V7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgb25lIGVuZW15XHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5hcm91bmQubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCBuZXcgY29vcmRpbmF0ZXMgZm9yIHRoZSBuZXh0IGp1bXBcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5hcm91bmRbdGhpcy5yYW5kb21dLmxhc3RJbmRleE9mKCc7Jyk7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHBhcnNlSW50KHRoaXMuYXJvdW5kW3RoaXMucmFuZG9tXS5zdWJzdHIoMCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgdGhpcy55ID0gcGFyc2VJbnQodGhpcy5hcm91bmRbdGhpcy5yYW5kb21dLnN1YnN0cmluZyhpbmRleCArIDEpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEp1bXAgYnkgcmVjdXJzaW9uIHRvIGFuIGFub3RoZXIgcm9ja1xyXG4gICAgICAgICAgICB0aGlzLmZpbmRUZXJyaXRvcnkoKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmaW5kQm9yZGVyVGVycml0b3J5KCl7XHJcblxyXG4gICAgICAgIHRoaXMuZmluZFRlcnJpdG9yeSgpO1xyXG5cclxuICAgICAgICBmb3IodmFyIGl0ZW0gb2YgdGhpcy50ZXJyaXRvcnkpe1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGNvb3JkaW5hdGVzIG9mIHRoZSBjdXJyZW50IHJvY2tcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gaXRlbS5sYXN0SW5kZXhPZignOycpO1xyXG4gICAgICAgICAgICB0aGlzLnggPSBwYXJzZUludChpdGVtLnN1YnN0cigwLCBpbmRleCkpO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBwYXJzZUludChpdGVtLnN1YnN0cmluZyhpbmRleCArIDEpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSByb2NrIGlzIG5vdCB0b3RhbGx5IGFyb3VuZCB0byBrbm93IGlmIGl0J3Mgb24gdGhlIGJvcmRlclxyXG4gICAgICAgICAgICBpZighKHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgLSAxfWBdID09IHRoaXMuZW5lbXkgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueCArIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgKyAxfWBdID09IHRoaXMuZW5lbXkgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueCAtIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkpKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyVGVycml0b3J5LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmJvcmRlclRlcnJpdG9yeS5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRlcnJpdG9yeTsgIiwiLyoqXG4gKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXG4gKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xuICogSEVUSUMgUDIwMTlcbiAqXG4gKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVsZXIpXG4gKlxuICogQ29weXJpZ2h0IDIwMTVcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICpcbiAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gKi9cblxuLy8gSW1wb3J0IHRoZSBhcHBcbmltcG9ydCBHYW1lIGZyb20gXCIuL2FwcC9pbmRleC5qc1wiO1xuXG4vLyBTZXQgb3B0aW9uc1xudmFyIG9wdGlvbnMgPSB7XG4gICAgZ29iYW46IHtcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuJyxcbiAgICB9LFxuICAgIGdhbWVwbGF5OiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9nYW1lcGxheScsXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICAgIG5icmU6ICc3JyxcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuX2dyaWQnLFxuICAgICAgICBjZWxsU2l6ZTogNDAsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICdibGFjaycsXG4gICAgICAgIGJvcmRlcldpZHRoOiAyLFxuICAgIH0sXG4gICAgcm9jazp7XG4gICAgICAgIHNpemU6IDEwLFxuICAgICAgICBwbGF5ZXIxOiAnZ3JleScsXG4gICAgICAgIHBsYXllcjI6ICdibGFjaycsXG4gICAgfVxufTtcblxuLy8gSW5pdGlhbGl6ZSBhbmQgcnVuIHRoZSBnYW1lXG52YXIgR29HYW1lID0gbmV3IEdhbWUob3B0aW9ucyk7XG5Hb0dhbWUucnVuKCk7Il19
