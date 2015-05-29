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

                // Set coordinates
                this.x = Math.floor((e.layerX + this.cellSize / 2) / this.cellSize);
                this.y = Math.floor((e.layerY + this.cellSize / 2) / this.cellSize);

                if (this.create(this.x, this.y)) {

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
        value: function create(x, y) {

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
                    c.arc(this.x * this.cellSize, this.y * this.cellSize, this.rockSize / 2, 0, 2 * Math.PI, false);
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

                // Tiny territories (delete boublon)
                this.cache = [];
                this.territories = [];
                for (var i in this.territory) {
                    var territory = this.territory[i];
                    if (this.cache.indexOf(JSON.stringify(territory.get())) == -1) {
                        this.territories.push(territory);
                        this.cache.push(JSON.stringify(territory.get()));
                    }
                }

                // Verification of encirclement territories
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.territories[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var territory = _step.value;

                        // The territory is circled
                        if (territory.isDead()) {

                            // Deubg
                            console.log('**');
                            console.log('Enemy territory circled !');
                            console.log(territory.get());

                            // Delete each rock
                            var _iteratorNormalCompletion2 = true;
                            var _didIteratorError2 = false;
                            var _iteratorError2 = undefined;

                            try {
                                for (var _iterator2 = territory.get()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                    var rockDied = _step2.value;

                                    // In the tab
                                    this.tab[rockDied] = 0;

                                    // On the interface
                                    var index = rockDied.lastIndexOf(';');
                                    this.x = parseInt(rockDied.substr(0, index)) * this.cellSize - 1 - this.rockSize / 2;
                                    this.y = parseInt(rockDied.substring(index + 1)) * this.cellSize - 1 - this.rockSize / 2;
                                    this.canvas.clearRect(this.x, this.y, this.rockSize + 2, this.rockSize + 2);
                                }
                            } catch (err) {
                                _didIteratorError2 = true;
                                _iteratorError2 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                                        _iterator2['return']();
                                    }
                                } finally {
                                    if (_didIteratorError2) {
                                        throw _iteratorError2;
                                    }
                                }
                            }
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

            // Score
            var GameScore = new _scoreJs2["default"]();
            GameScore.run();
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

    /**
     * Init options
     *
     * @param tab (array)
     * @param ennemy (number)
     * @param x and y coordinate (numbers)
     */

    function Territory(tab, enemy, x, y) {
        _classCallCheck(this, Territory);

        this.tab = tab;
        this.enemy = enemy;
        this.x = x;
        this.y = y;
        this.start = '' + this.x + ';' + this.y;
        this.coordinate;
        this.cache = [];
        this.around = [];
        this.territory = [];
        this.borderTerritory = [];
        this.indexGoBack;
        this.newRock = true;
        this.liberties = 0;

        this.run();
    }

    _createClass(Territory, [{
        key: 'run',

        /**
         * Find the territory by recursion
         *
         */
        value: function run() {

            // Init around rocks
            this.around = [];

            // Save
            if (this.newRock) {
                this.cache['' + this.x + ';' + this.y] = 'check';
                this.indexGoBack = this.territory.length;
                this.territory.push('' + this.x + ';' + this.y);
            }

            // We check rocks around
            for (var i = 1; i <= 4; i++) {
                switch (i) {
                    case 1:
                        this.coordinate = '' + this.x + ';' + (this.y - 1);
                        break;

                    case 2:
                        this.coordinate = '' + (this.x + 1) + ';' + this.y;
                        break;

                    case 3:
                        this.coordinate = '' + this.x + ';' + (this.y + 1);
                        break;

                    case 4:
                        this.coordinate = '' + (this.x - 1) + ';' + this.y;
                        break;
                }

                if (this.tab[this.coordinate] == this.enemy && this.cache[this.coordinate] != 'check') {
                    this.around.push(this.coordinate);
                }
            }

            // If no enemies
            if (this.around.length == 0) {

                // If we can go back to find more new rocks
                if (!(this.start == '' + this.x + ';' + this.y)) {

                    // Said we go back
                    this.newRock = false;
                    this.indexGoBack = this.indexGoBack - 1;

                    // Set new coordinates for the next jump
                    var index = this.territory[this.indexGoBack].lastIndexOf(';');
                    this.x = parseInt(this.territory[this.indexGoBack].substr(0, index));
                    this.y = parseInt(this.territory[this.indexGoBack].substring(index + 1));

                    // Jump by recursion to an another rock
                    this.run();
                }
            } else {

                // Check one enemy
                this.random = Math.floor(Math.random() * this.around.length);

                // Set new coordinates for the next jump
                var index = this.around[this.random].lastIndexOf(';');
                this.x = parseInt(this.around[this.random].substr(0, index));
                this.y = parseInt(this.around[this.random].substring(index + 1));

                // Jump by recursion to an another rock
                this.newRock = true;
                this.run();
            }
        }
    }, {
        key: 'get',

        /**
         * Return all the territory
         *
         * @return array
         */
        value: function get() {
            return this.territory.sort();
        }
    }, {
        key: 'getBorders',

        /**
         * Return borders of the territory
         *
         * @return array
         */
        value: function getBorders() {

            if (this.borderTerritory.length == 0) {
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
            }
            return this.borderTerritory.sort();
        }
    }, {
        key: 'isDead',

        /**
         * Check if the territory is dead
         *
         * @return true or false
         */
        value: function isDead() {

            // Get borders of the territory
            if (this.borderTerritory.length == 0) {
                this.getBorders();
            }

            // Get liberties of the territory
            if (this.liberties == 0) {
                this.getLiberties();
            }

            if (this.liberties == this.borderTerritory.length) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'getLiberties',

        /**
         * Get liberties of the territories
         *
         * @return this.liberties (number)
         */
        value: function getLiberties() {

            // Get borders of the territory
            if (this.borderTerritory.length == 0) {
                this.getBorders();
            }

            this.liberties = 0;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.borderTerritory[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var rock = _step2.value;

                    var index = rock.lastIndexOf(';');
                    var x = parseInt(rock.substr(0, index));
                    var y = parseInt(rock.substring(index + 1));

                    // Check if the rock has any liberties
                    if (this.tab['' + x + ';' + (y - 1)] != 0 && this.tab['' + (x + 1) + ';' + y] != 0 && this.tab['' + x + ';' + (y + 1)] != 0 && this.tab['' + (x - 1) + ';' + y] != 0) {
                        this.liberties++;
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                        _iterator2['return']();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            return this.liberties;
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
        element: '.Game_goban'
    },
    gameplay: {
        element: '.Game_goban_gameplay'
    },
    grid: {
        nbre: '19',
        element: '.Game_goban_grid',
        cellSize: 40,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2
    },
    rock: {
        size: 20,
        player1: 'grey',
        player2: 'black'
    }
};

// Initialize and run the game
var GoGame = new _appIndexJs2['default'](options);
GoGame.run();

},{"./app/index.js":3}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2J1aWxkZXIuanMiLCJEOi9Ecm9wYm94L1NpdGVzL3d3dy9Hb0dhbWUvc3JjL2pzL2FwcC9nYW1lcGxheS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2luZGV4LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvc2F2ZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL3Njb3JlLmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvdGVycml0b3J5LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9mYWtlXzI4NjEwZTAzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2dCTSxPQUFPOzs7Ozs7OztBQVFFLGFBUlQsT0FBTyxDQVFHLE9BQU8sRUFBQzs4QkFSbEIsT0FBTzs7QUFTTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUVuRCxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxD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bUJBQVcsRUFBRSxPQUFPO0FBQ3BCLG1CQUFXLEVBQUUsQ0FBQztLQUNqQjtBQUNELFFBQUksRUFBQztBQUNELFlBQUksRUFBRSxFQUFFO0FBQ1IsZUFBTyxFQUFFLE1BQU07QUFDZixlQUFPLEVBQUUsT0FBTztLQUNuQjtDQUNKLENBQUM7OztBQUdGLElBQUksTUFBTSxHQUFHLDRCQUFTLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIgLyoqXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gICogSEVUSUMgUDIwMTlcbiAgKlxuICAqIEJ1aWxkZXIgbW9kdWxlXG4gICpcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxuICAqXG4gICogQ29weXJpZ2h0IDIwMTVcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gICpcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICAqL1xuXG5jbGFzcyBCdWlsZGVye1xuXG5cbiAgICAvKipcbiAgICAgKiBJbml0IG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJheSBvcHRpb25zXG4gICAgICovICAgICBcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuZ3JpZGJvcmRlcldpZHRoID0gb3B0aW9uc1snZ3JpZCddLmJvcmRlcldpZHRoO1xuXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG4gICAgICAgIHRoaXMuZ3JpZFNpemUgPSAocGFyc2VJbnQodGhpcy5ncmlkKSArIDEpICogdGhpcy5jZWxsU2l6ZTtcblxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydnb2JhbiddLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheSA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkID0gU3ByaW50KG9wdGlvbnNbJ2dyaWQnXS5lbGVtZW50KTtcblxuICAgICAgICB0aGlzLmdyaWRDYW52YXMgPSB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0aGlzLmdhbWVwbGF5Q2FudmFzID0gdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdvYmFuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNzcyBzdHlsZSBvZiB0aGUgZ29iYW5cbiAgICAgKi8gIFxuICAgIGJ1aWxkR29iYW4oKXtcbiAgICAgICAgdGhpcy4kZ29iYW4uY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplLFxuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB0aGUgZ2FtZXBsYXkgY2FudmFzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNhbnZhc1xuICAgICAqLyAgXG4gICAgYnVpbGRHYW1lcGxheSgpe1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0ud2lkdGggPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplXG4gICAgICAgIH0pXG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdyaWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gY2FudmFzIHdpdGggYSBncmlkIGRyYXduXG4gICAgICovICBcbiAgICBidWlsZEdyaWQoKXtcblxuICAgICAgICAvLyBTZXQgc2l6ZSBvZiBjYW52YXNcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0ud2lkdGggPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS5oZWlnaHQgPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEluaXQgdGhlIGNhbnZhc1xuICAgICAgICB2YXIgYyA9IHRoaXMuZ3JpZENhbnZhcztcblxuICAgICAgICAvLyBEcmF3IGVhY2ggbGluZXMgb2YgdGhlIGdyaWRcbiAgICAgICAgZm9yKHZhciB4ID0gMTsgeCA8PSB0aGlzLmdyaWQgOyB4Kyspe1xuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGMubW92ZVRvKHRoaXMuY2VsbFNpemUsIHRoaXMuY2VsbFNpemUgKiB4KTtcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xuICAgICAgICAgICAgYy5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IodmFyIHkgPSAxOyB5IDw9IHRoaXMuZ3JpZCA7IHkrKyl7XG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgYy5tb3ZlVG8odGhpcy5jZWxsU2l6ZSAqIHksIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgYy5saW5lVG8odGhpcy5jZWxsU2l6ZSAqIHksIHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gdGhpcy5ncmlkYm9yZGVyV2lkdGg7XG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGFsbCBlbGVtZW50c1xuICAgICAqXG4gICAgICovICBcbiAgICBydW4oKXtcbiAgICAgICAgdGhpcy5idWlsZEdvYmFuKCk7XG4gICAgICAgIHRoaXMuYnVpbGRHYW1lcGxheSgpO1xuICAgICAgICB0aGlzLmJ1aWxkR3JpZCgpO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1aWxkZXI7IiwiIC8qKlxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xuICAqIEhFVElDIFAyMDE5XG4gICpcbiAgKiBHYW1lcGxheSBtb2R1bGVcbiAgKlxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXG4gICpcbiAgKiBDb3B5cmlnaHQgMjAxNVxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAgKlxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gICovXG5cbmltcG9ydCBUZXJyaXRvcnkgZnJvbSBcIi4vdGVycml0b3J5LmpzXCI7XG5cbmNsYXNzIEdhbWVwbGF5e1xuXG5cbiAgICAvKipcbiAgICAgKiBJbml0IHBhcmFtc1xuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnNcbiAgICAgKi8gICBcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcblxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydlbGVtZW50J10pO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJGdvYmFuLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIxID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcblxuICAgICAgICB0aGlzLnBsYXllciA9IDE7XG4gICAgICAgIHRoaXMuZW5lbXkgPSB0aGlzLnBsYXllcisrO1xuXG4gICAgICAgIHRoaXMudGFiID0gW107XG4gICAgICAgIHRoaXMudGVycml0b3JpZXMgPSBbXTtcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBbXTtcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xuXG4gICAgICAgIC8vIEluaXRpYWx5c2UgdGhlIHRhYlxuICAgICAgICBmb3IodmFyIHggPSAxOyB4IDw9IHRoaXMuZ3JpZCA7IHgrKyl7XG4gICAgICAgICAgICBmb3IodmFyIHkgPSAxOyB5IDw9IHRoaXMuZ3JpZCA7IHkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7eH07JHt5fWBdID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIExpc3RlbiBldmVudCBvbiB0aGUgZ2FtZXBsYXkgXG4gICAgICpcbiAgICAgKi8gIFxuICAgIGxpc3Rlbm5lcigpe1xuXG4gICAgICAgIC8vIFRoZSBwbGF5ZXIgY2xpY2sgb24gdGhlIGdvYmFuIHRvIHBsYXlcbiAgICAgICAgU3ByaW50KHRoaXMuJGdvYmFuKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcblxuICAgICAgICAgICAgLy8gU2V0IGNvb3JkaW5hdGVzIFxuICAgICAgICAgICAgdGhpcy54ID0gTWF0aC5mbG9vcigoZS5sYXllclggKyB0aGlzLmNlbGxTaXplIC8gMikgLyB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IoKGUubGF5ZXJZICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG5cbiAgICAgICAgICAgIGlmKHRoaXMuY3JlYXRlKHRoaXMueCwgdGhpcy55KSl7XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgLy8gRGVidWdcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqYCk7XG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gdGhpcy5yb2NrUGxheWVyMTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnBsYXllciA9PSAyKXtcbiAgICAgICAgICAgICAgICAgICAgY29sb3IgPSB0aGlzLnJvY2tQbGF5ZXIyO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgSm91ZXVyICR7dGhpcy5wbGF5ZXJ9ICgke2NvbG9yfSkgZW4gJHt0aGlzLnh9OyR7dGhpcy55fWApO1xuXG4gICAgICAgICAgICAgICAgdGhpcy5yZXdyaXRlR29iYW4oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllciA9ICgodGhpcy5wbGF5ZXIrKykgJSAyKSArIDE7XG4gICAgICAgICAgICAgICAgdGhpcy5lbmVteSA9ICgodGhpcy5lbmVteSsrKSAlIDIpICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB3ZSBhcmUgaW4gYSBjYXNlIG9mIHN1aWNpZGVcbiAgICAgKlxuICAgICAqLyAgXG4gICAgY2hlY2tTdWljaWRlKCl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgd2UgYXJlIGluIGEgY2FzZSBvZiBLT1xuICAgICAqXG4gICAgICovICBcbiAgICBjaGVja0tPKCl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlIGEgcm9ja1xuICAgICAqXG4gICAgICogQHBhcmFtcyBjb29yZGluYXRlcyBjbGlja1xuICAgICAqIEByZXR1cm4gYSByb2NrIGRyYXduIG9uIHRoZSBjYW52YXNcbiAgICAgKi8gIFxuICAgIGNyZWF0ZSh4LCB5KXtcblxuICAgICAgICAvLyBTZXQgY29sb3JcbiAgICAgICAgdmFyIGNvbG9yID0gdGhpcy5yb2NrUGxheWVyMTtcbiAgICAgICAgaWYodGhpcy5wbGF5ZXIgPT0gMil7XG4gICAgICAgICAgICBjb2xvciA9IHRoaXMucm9ja1BsYXllcjI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiB3ZSBhcmUgb24gdGhlIGdvYmFuXG4gICAgICAgIGlmKDEgPD0gdGhpcy54ICYmIHRoaXMueCA8PSB0aGlzLmdyaWQgJiYgMSA8PSB0aGlzLnkgJiYgdGhpcy55IDw9IHRoaXMuZ3JpZCApe1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGxheWVyIGNhbiBwbGF5IGF0IHRoaXMgcGxhY2VcbiAgICAgICAgICAgIGlmKCF0aGlzLmNoZWNrU3VpY2lkZSgpICYmICF0aGlzLmNoZWNrS08oKSAmJiB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55fWBdID09IDApe1xuXG4gICAgICAgICAgICAgICAgLy8gRHJhdyB0aGUgcm9ja1xuICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5jYW52YXM7XG4gICAgICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBjLmFyYyh0aGlzLnggKiB0aGlzLmNlbGxTaXplLCB0aGlzLnkgKiB0aGlzLmNlbGxTaXplLCB0aGlzLnJvY2tTaXplIC8gMiwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBjLmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgICAgIGMuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgICAgICAgICAgYy5maWxsKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBTYXZlIGluIHRoZSB0YWJcbiAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55fWBdID0gdGhpcy5wbGF5ZXI7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogUmV3cml0ZSBnb2JhbiB3aXRoIHRoZSBsYXN0IGFjdGlvbiBvZiB0aGUgcGxheWVyXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHJld3JpdGVHb2Jhbigpe1xuXG4gICAgICAgIC8vIEluaXQgdGVycml0b3J5XG4gICAgICAgIHRoaXMudGVycml0b3J5ID0gW107XG5cbiAgICAgICAgLy8gQ2hlayBpZiB0aGVyZSBhcmUgZW5uZW1pZXMgYXJvdW5kIHRoZSBsYXN0IHJvY2sgcGxhY2VkXG4gICAgICAgIGlmKFxuICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueSAtIDF9YF0gPT0gdGhpcy5lbmVteSB8fFxuICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSB8fFxuICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueSArIDF9YF0gPT0gdGhpcy5lbmVteSB8fFxuICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54IC0gMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSlcbiAgICAgICAge1xuXG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIHRlcnJpdG9yeSBvZiB0aGUgbmVpZ2hib3JzIFxuICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueSAtIDF9YF0gPT0gdGhpcy5lbmVteSl7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXJyaXRvcnlbJ3RvcCddID0gbmV3IFRlcnJpdG9yeSh0aGlzLnRhYiwgdGhpcy5lbmVteSwgdGhpcy54LCB0aGlzLnkgLSAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3RoaXMueCArIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkpe1xuICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3J5WydyaWdodCddID0gbmV3IFRlcnJpdG9yeSh0aGlzLnRhYiwgdGhpcy5lbmVteSwgdGhpcy54ICsgMSwgdGhpcy55KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgKyAxfWBdID09IHRoaXMuZW5lbXkpe1xuICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3J5Wydib3R0b20nXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCwgdGhpcy55ICsgMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRhYltgJHt0aGlzLnggLSAxfTske3RoaXMueX1gXSA9PSB0aGlzLmVuZW15KXtcbiAgICAgICAgICAgICAgICB0aGlzLnRlcnJpdG9yeVsnbGVmdCddID0gbmV3IFRlcnJpdG9yeSh0aGlzLnRhYiwgdGhpcy5lbmVteSwgdGhpcy54IC0gMSwgdGhpcy55KTtcbiAgICAgICAgICAgIH0gXG5cbiAgICAgICAgICAgIC8vIFRpbnkgdGVycml0b3JpZXMgKGRlbGV0ZSBib3VibG9uKVxuICAgICAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xuICAgICAgICAgICAgdGhpcy50ZXJyaXRvcmllcyA9IFtdO1xuICAgICAgICAgICAgZm9yKGxldCBpIGluIHRoaXMudGVycml0b3J5KXtcbiAgICAgICAgICAgICAgICBsZXQgdGVycml0b3J5ID0gdGhpcy50ZXJyaXRvcnlbaV07XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbmRleE9mKEpTT04uc3RyaW5naWZ5KHRlcnJpdG9yeS5nZXQoKSkpID09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXJyaXRvcmllcy5wdXNoKHRlcnJpdG9yeSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaChKU09OLnN0cmluZ2lmeSh0ZXJyaXRvcnkuZ2V0KCkpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFZlcmlmaWNhdGlvbiBvZiBlbmNpcmNsZW1lbnQgdGVycml0b3JpZXNcbiAgICAgICAgICAgIGZvcihsZXQgdGVycml0b3J5IG9mIHRoaXMudGVycml0b3JpZXMpe1xuICAgICAgICAgICAgICAgIC8vIFRoZSB0ZXJyaXRvcnkgaXMgY2lyY2xlZFxuICAgICAgICAgICAgICAgIGlmKHRlcnJpdG9yeS5pc0RlYWQoKSl7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRGV1YmdcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyoqJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFbmVteSB0ZXJyaXRvcnkgY2lyY2xlZCAhJyk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRlcnJpdG9yeS5nZXQoKSk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gRGVsZXRlIGVhY2ggcm9ja1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHJvY2tEaWVkIG9mIHRlcnJpdG9yeS5nZXQoKSl7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluIHRoZSB0YWJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFiW3JvY2tEaWVkXSA9IDAgO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPbiB0aGUgaW50ZXJmYWNlXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSByb2NrRGllZC5sYXN0SW5kZXhPZignOycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy54ID0gcGFyc2VJbnQocm9ja0RpZWQuc3Vic3RyKDAsIGluZGV4KSkgKiB0aGlzLmNlbGxTaXplIC0gMSAtIHRoaXMucm9ja1NpemUgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55ID0gcGFyc2VJbnQocm9ja0RpZWQuc3Vic3RyaW5nKGluZGV4ICsgMSkpICogdGhpcy5jZWxsU2l6ZSAtIDEgLSB0aGlzLnJvY2tTaXplIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmNsZWFyUmVjdCh0aGlzLngsdGhpcy55LHRoaXMucm9ja1NpemUgKyAyLCB0aGlzLnJvY2tTaXplICsgMik7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lcGxheTsiLCIgLyoqXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gICogSEVUSUMgUDIwMTlcbiAgKiBcbiAgKiBJbmRleFxuICAqXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcbiAgKlxuICAqIENvcHlyaWdodCAyMDE1XG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICAqXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcbiAgKi9cblxuaW1wb3J0IEJ1aWxkZXIgZnJvbSBcIi4vYnVpbGRlci5qc1wiO1xuaW1wb3J0IEdhbWVwbGF5IGZyb20gXCIuL2dhbWVwbGF5LmpzXCI7XG5pbXBvcnQgU2F2ZSBmcm9tIFwiLi9zYXZlLmpzXCI7XG5pbXBvcnQgU2NvcmUgZnJvbSBcIi4vc2NvcmUuanNcIjtcblxuY2xhc3MgR2FtZXtcblxuICAgIC8qKlxuICAgICAqIEluaXQgb3B0aW9uc1xuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgICAqIEByZXR1cm4gXG4gICAgICovICAgICBcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuZ3JpZEJvcmRlcldpZHRoID0gb3B0aW9uc1snZ3JpZCddLmJvcmRlcldpZHRoO1xuXG4gICAgICAgIHRoaXMuJGdvYmFuID0gb3B0aW9uc1snZ29iYW4nXS5lbGVtZW50O1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkID0gb3B0aW9uc1snZ3JpZCddLmVsZW1lbnQ7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5ID0gb3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50O1xuXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIxID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBnYW1lXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHJ1bigpe1xuXG4gICAgICAgIC8vIEJ1aWxkZXJcbiAgICAgICAgdmFyIEdhbWVCdWlsZGVyID0gbmV3IEJ1aWxkZXIoe1xuICAgICAgICAgIGdvYmFuOiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuJGdvYmFuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnYW1lcGxheToge1xuICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9nYW1lcGxheVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ3JpZDoge1xuICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9ncmlkLFxuICAgICAgICAgICAgICBuYnJlOiB0aGlzLmdyaWQsXG4gICAgICAgICAgICAgIGNlbGxTaXplOiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICBib3JkZXJXaWR0aCA6IHRoaXMuZ3JpZEJvcmRlcldpZHRoLFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIEdhbWVCdWlsZGVyLnJ1bigpO1xuXG5cbiAgICAgICAgLy8gR2FtZXBsYXlcbiAgICAgICAgdmFyIEdhbWVHYW1lcGxheSA9IG5ldyBHYW1lcGxheSh7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9nYW1lcGxheSxcbiAgICAgICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICAgICAgICBuYnJlOiB0aGlzLmdyaWQsXG4gICAgICAgICAgICAgICAgY2VsbFNpemU6IHRoaXMuY2VsbFNpemVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb2NrOiB7XG4gICAgICAgICAgICAgICAgc2l6ZTogdGhpcy5yb2NrU2l6ZSxcbiAgICAgICAgICAgICAgICBwbGF5ZXIxOiB0aGlzLnJvY2tQbGF5ZXIxLFxuICAgICAgICAgICAgICAgIHBsYXllcjI6IHRoaXMucm9ja1BsYXllcjIsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBHYW1lR2FtZXBsYXkubGlzdGVubmVyKCk7XG5cblxuICAgICAgICAvLyBTY29yZVxuICAgICAgICB2YXIgR2FtZVNjb3JlID0gbmV3IFNjb3JlKCk7XG4gICAgICAgIEdhbWVTY29yZS5ydW4oKTtcblxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xuXG4iLCIgLyoqXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gICogSEVUSUMgUDIwMTlcbiAgKlxuICAqIFNhdmUgbW9kdWxlXG4gICpcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxuICAqXG4gICogQ29weXJpZ2h0IDIwMTVcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gICpcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICAqL1xuXG5leHBvcnQgY2xhc3MgU2NvcmV7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLnNjb3JlID0gW107XG4gICAgfVxuXG59IiwiIC8qKlxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xuICAqIEhFVElDIFAyMDE5XG4gICpcbiAgKiBTY29yZSBtb2R1bGVcbiAgKlxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXG4gICpcbiAgKiBDb3B5cmlnaHQgMjAxNVxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAgKlxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gICovXG5cbmV4cG9ydCBjbGFzcyBTY29yZXtcblxuXG59IiwiIC8qKlxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xuICAqIEhFVElDIFAyMDE5XG4gICpcbiAgKiBUZXJyaXRvcnkgbW9kdWxlXG4gICpcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxuICAqXG4gICogQ29weXJpZ2h0IDIwMTVcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gICpcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICAqL1xuXG5leHBvcnQgY2xhc3MgVGVycml0b3J5e1xuXG4gICAgLyoqXG4gICAgICogSW5pdCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGFiIChhcnJheSlcbiAgICAgKiBAcGFyYW0gZW5uZW15IChudW1iZXIpXG4gICAgICogQHBhcmFtIHggYW5kIHkgY29vcmRpbmF0ZSAobnVtYmVycylcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKHRhYiwgZW5lbXksIHgsIHkpe1xuXG4gICAgICAgIHRoaXMudGFiID0gdGFiO1xuICAgICAgICB0aGlzLmVuZW15ID0gZW5lbXk7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHRoaXMuc3RhcnQgPSBgJHt0aGlzLnh9OyR7dGhpcy55fWA7XG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZTtcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xuICAgICAgICB0aGlzLmFyb3VuZCA9IFtdO1xuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IFtdO1xuICAgICAgICB0aGlzLmJvcmRlclRlcnJpdG9yeSA9IFtdO1xuICAgICAgICB0aGlzLmluZGV4R29CYWNrO1xuICAgICAgICB0aGlzLm5ld1JvY2sgPSB0cnVlO1xuICAgICAgICB0aGlzLmxpYmVydGllcyA9IDA7XG5cbiAgICAgICAgdGhpcy5ydW4oKTtcblxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBGaW5kIHRoZSB0ZXJyaXRvcnkgYnkgcmVjdXJzaW9uXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHJ1bigpe1xuXG4gICAgICAgIC8vIEluaXQgYXJvdW5kIHJvY2tzXG4gICAgICAgIHRoaXMuYXJvdW5kPSBbXTtcblxuICAgICAgICAvLyBTYXZlXG4gICAgICAgIGlmKHRoaXMubmV3Um9jayl7XG4gICAgICAgICAgICB0aGlzLmNhY2hlW2Ake3RoaXMueH07JHt0aGlzLnl9YF0gPSAnY2hlY2snO1xuICAgICAgICAgICAgdGhpcy5pbmRleEdvQmFjayA9IHRoaXMudGVycml0b3J5Lmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMudGVycml0b3J5LnB1c2goYCR7dGhpcy54fTske3RoaXMueX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIGNoZWNrIHJvY2tzIGFyb3VuZFxuICAgICAgICBmb3IodmFyIGkgPSAxOyBpIDw9IDQ7IGkrKyl7XG4gICAgICAgICAgICBzd2l0Y2goaSl7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGUgPSBgJHt0aGlzLnh9OyR7dGhpcy55IC0gMX1gO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlID0gYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueH07JHt0aGlzLnkgKyAxfWA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGUgPSBgJHt0aGlzLnggLSAxfTske3RoaXMueX1gO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy50YWJbdGhpcy5jb29yZGluYXRlXSA9PSB0aGlzLmVuZW15ICYmIHRoaXMuY2FjaGVbdGhpcy5jb29yZGluYXRlXSAgIT0gJ2NoZWNrJyl7XG4gICAgICAgICAgICAgICAgdGhpcy5hcm91bmQucHVzaCh0aGlzLmNvb3JkaW5hdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbm8gZW5lbWllc1xuICAgICAgICBpZih0aGlzLmFyb3VuZC5sZW5ndGggPT0gMCl7XG5cbiAgICAgICAgICAgIC8vIElmIHdlIGNhbiBnbyBiYWNrIHRvIGZpbmQgbW9yZSBuZXcgcm9ja3NcbiAgICAgICAgICAgIGlmKCEodGhpcy5zdGFydCA9PSBgJHt0aGlzLnh9OyR7dGhpcy55fWApKXtcblxuICAgICAgICAgICAgICAgIC8vIFNhaWQgd2UgZ28gYmFja1xuICAgICAgICAgICAgICAgIHRoaXMubmV3Um9jayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhHb0JhY2sgPSB0aGlzLmluZGV4R29CYWNrIC0gMTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBTZXQgbmV3IGNvb3JkaW5hdGVzIGZvciB0aGUgbmV4dCBqdW1wXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy50ZXJyaXRvcnlbdGhpcy5pbmRleEdvQmFja10ubGFzdEluZGV4T2YoJzsnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBwYXJzZUludCh0aGlzLnRlcnJpdG9yeVt0aGlzLmluZGV4R29CYWNrXS5zdWJzdHIoMCwgaW5kZXgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBwYXJzZUludCh0aGlzLnRlcnJpdG9yeVt0aGlzLmluZGV4R29CYWNrXS5zdWJzdHJpbmcoaW5kZXggKyAxKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBKdW1wIGJ5IHJlY3Vyc2lvbiB0byBhbiBhbm90aGVyIHJvY2tcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIG9uZSBlbmVteVxuICAgICAgICAgICAgdGhpcy5yYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmFyb3VuZC5sZW5ndGgpO1xuXG4gICAgICAgICAgICAvLyBTZXQgbmV3IGNvb3JkaW5hdGVzIGZvciB0aGUgbmV4dCBqdW1wXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmFyb3VuZFt0aGlzLnJhbmRvbV0ubGFzdEluZGV4T2YoJzsnKTtcbiAgICAgICAgICAgIHRoaXMueCA9IHBhcnNlSW50KHRoaXMuYXJvdW5kW3RoaXMucmFuZG9tXS5zdWJzdHIoMCwgaW5kZXgpKTtcbiAgICAgICAgICAgIHRoaXMueSA9IHBhcnNlSW50KHRoaXMuYXJvdW5kW3RoaXMucmFuZG9tXS5zdWJzdHJpbmcoaW5kZXggKyAxKSk7XG5cbiAgICAgICAgICAgIC8vIEp1bXAgYnkgcmVjdXJzaW9uIHRvIGFuIGFub3RoZXIgcm9ja1xuICAgICAgICAgICAgdGhpcy5uZXdSb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucnVuKCk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGFsbCB0aGUgdGVycml0b3J5XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGFycmF5XG4gICAgICovIFxuICAgIGdldCgpe1xuICAgICAgICByZXR1cm4gdGhpcy50ZXJyaXRvcnkuc29ydCgpO1xuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGJvcmRlcnMgb2YgdGhlIHRlcnJpdG9yeVxuICAgICAqXG4gICAgICogQHJldHVybiBhcnJheVxuICAgICAqLyBcbiAgICBnZXRCb3JkZXJzKCl7XG5cbiAgICAgICAgaWYodGhpcy5ib3JkZXJUZXJyaXRvcnkubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgZm9yKHZhciBpdGVtIG9mIHRoaXMudGVycml0b3J5KXtcblxuICAgICAgICAgICAgICAgIC8vIFNldCBjb29yZGluYXRlcyBvZiB0aGUgY3VycmVudCByb2NrXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gaXRlbS5sYXN0SW5kZXhPZignOycpO1xuICAgICAgICAgICAgICAgIHRoaXMueCA9IHBhcnNlSW50KGl0ZW0uc3Vic3RyKDAsIGluZGV4KSk7XG4gICAgICAgICAgICAgICAgdGhpcy55ID0gcGFyc2VJbnQoaXRlbS5zdWJzdHJpbmcoaW5kZXggKyAxKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcm9jayBpcyBub3QgdG90YWxseSBhcm91bmQgdG8ga25vdyBpZiBpdCdzIG9uIHRoZSBib3JkZXJcbiAgICAgICAgICAgICAgICBpZighKHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgLSAxfWBdID09IHRoaXMuZW5lbXkgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55ICsgMX1gXSA9PSB0aGlzLmVuZW15ICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueCAtIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkpKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJUZXJyaXRvcnkucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVyVGVycml0b3J5LnNvcnQoKTtcblxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgdGVycml0b3J5IGlzIGRlYWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdHJ1ZSBvciBmYWxzZVxuICAgICAqLyBcbiAgICBpc0RlYWQoKXtcblxuICAgICAgICAvLyBHZXQgYm9yZGVycyBvZiB0aGUgdGVycml0b3J5XG4gICAgICAgIGlmKHRoaXMuYm9yZGVyVGVycml0b3J5Lmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgIHRoaXMuZ2V0Qm9yZGVycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0IGxpYmVydGllcyBvZiB0aGUgdGVycml0b3J5XG4gICAgICAgIGlmKHRoaXMubGliZXJ0aWVzID09IDApe1xuICAgICAgICAgICAgdGhpcy5nZXRMaWJlcnRpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMubGliZXJ0aWVzID09IHRoaXMuYm9yZGVyVGVycml0b3J5Lmxlbmd0aCl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogR2V0IGxpYmVydGllcyBvZiB0aGUgdGVycml0b3JpZXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdGhpcy5saWJlcnRpZXMgKG51bWJlcilcbiAgICAgKi8gXG4gICAgZ2V0TGliZXJ0aWVzKCl7XG5cbiAgICAgICAgLy8gR2V0IGJvcmRlcnMgb2YgdGhlIHRlcnJpdG9yeVxuICAgICAgICBpZih0aGlzLmJvcmRlclRlcnJpdG9yeS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICB0aGlzLmdldEJvcmRlcnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGliZXJ0aWVzID0gMDtcbiAgICAgICAgXG4gICAgICAgIGZvcihsZXQgcm9jayBvZiB0aGlzLmJvcmRlclRlcnJpdG9yeSl7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSByb2NrLmxhc3RJbmRleE9mKCc7Jyk7XG4gICAgICAgICAgICBsZXQgeCA9IHBhcnNlSW50KHJvY2suc3Vic3RyKDAsIGluZGV4KSk7XG4gICAgICAgICAgICBsZXQgeSA9IHBhcnNlSW50KHJvY2suc3Vic3RyaW5nKGluZGV4ICsgMSkpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcm9jayBoYXMgYW55IGxpYmVydGllc1xuICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7eH07JHt5IC0gMX1gXSAhPSAwICYmXG4gICAgICAgICAgICAgICB0aGlzLnRhYltgJHt4ICsgMX07JHt5fWBdICE9IDAgJiZcbiAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3h9OyR7eSArIDF9YF0gIT0gMCAmJlxuICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7eCAtIDF9OyR7eX1gXSAhPSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMubGliZXJ0aWVzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5saWJlcnRpZXM7XG5cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gVGVycml0b3J5OyAiLCIvKipcbiAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cbiAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gKiBIRVRJQyBQMjAxOVxuICpcbiAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZWxlcilcbiAqXG4gKiBDb3B5cmlnaHQgMjAxNVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKlxuICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcbiAqL1xuXG4vLyBJbXBvcnQgdGhlIGFwcFxuaW1wb3J0IEdhbWUgZnJvbSBcIi4vYXBwL2luZGV4LmpzXCI7XG5cbi8vIFNldCBvcHRpb25zXG52YXIgb3B0aW9ucyA9IHtcbiAgICBnb2Jhbjoge1xuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW4nXG4gICAgfSxcbiAgICBnYW1lcGxheToge1xuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW5fZ2FtZXBsYXknXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICAgIG5icmU6ICcxOScsXG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9ncmlkJyxcbiAgICAgICAgY2VsbFNpemU6IDQwLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gICAgICAgIGJvcmRlckNvbG9yOiAnYmxhY2snLFxuICAgICAgICBib3JkZXJXaWR0aDogMlxuICAgIH0sXG4gICAgcm9jazp7XG4gICAgICAgIHNpemU6IDIwLFxuICAgICAgICBwbGF5ZXIxOiAnZ3JleScsXG4gICAgICAgIHBsYXllcjI6ICdibGFjaydcbiAgICB9XG59O1xuXG4vLyBJbml0aWFsaXplIGFuZCBydW4gdGhlIGdhbWVcbnZhciBHb0dhbWUgPSBuZXcgR2FtZShvcHRpb25zKTtcbkdvR2FtZS5ydW4oKTtcbiJdfQ==
