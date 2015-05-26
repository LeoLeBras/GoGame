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

            // Init cache
            this.cache = 0;

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
                        this.cache++;
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

            if (this.cache == this.borderTerritory.length) {
                return true;
            } else {
                return false;
            }
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
        nbre: '19',
        element: '.Game_goban_grid',
        cellSize: 40,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 2 },
    rock: {
        size: 20,
        player1: 'grey',
        player2: 'black' }
};

// Initialize and run the game
var GoGame = new _appIndexJs2['default'](options);
GoGame.run();

},{"./app/index.js":3}]},{},[7])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2J1aWxkZXIuanMiLCJEOi9Ecm9wYm94L1NpdGVzL3d3dy9Hb0dhbWUvc3JjL2pzL2FwcC9nYW1lcGxheS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2luZGV4LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvc2F2ZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL3Njb3JlLmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvdGVycml0b3J5LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9mYWtlX2U1MzBkYjE4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2dCTSxPQUFPOzs7Ozs7OztBQVFFLGFBUlQsT0FBTyxDQVFHLE9BQU8sRUFBQzs4QkFSbEIsT0FBTzs7QUFTTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUVuRCxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxD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QUksQ0FBQyxDQUFDLFVBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQ2pELElBQUksQ0FBQyxHQUFHLE9BQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFHLElBQUksSUFBSSxDQUFDLEtBQUssSUFDakQsSUFBSSxDQUFDLEdBQUcsTUFBSSxJQUFJLENBQUMsQ0FBQyxVQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUNqRCxJQUFJLENBQUMsR0FBRyxPQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQ3JEOzs7QUFHSSxvQkFBRyxJQUFJLENBQUMsR0FBRyxNQUFJLElBQUksQ0FBQyxDQUFDLFVBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUM7QUFDakQsd0JBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsNkJBQWMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDbkY7QUFDRCxvQkFBRyxJQUFJLENBQUMsR0FBRyxPQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUM7QUFDakQsd0JBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsNkJBQWMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztp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Q0FBQyxDQUFBLFNBQUksQ0FBQyxDQUFHLElBQUksQ0FBQyxFQUNqQztBQUNJLDRCQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7cUJBQ2hCO2lCQUNKOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsZ0JBQUcsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLENBQUMsZUFBZSxDQUFDLE1BQU0sRUFBQztBQUN6Qyx1QkFBTyxJQUFJLENBQUM7YUFDZixNQUNHO0FBQ0EsdUJBQU8sS0FBSyxDQUFDO2FBQ2hCO1NBQ0o7OztXQXJNUSxTQUFTOzs7UUFBVCxTQUFTLEdBQVQsU0FBUzs7QUF3TXRCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkN6TVYsZ0JBQWdCOzs7OztBQUdqQyxJQUFJLE9BQU8sR0FBRztBQUNWLFNBQUssRUFBRTtBQUNILGVBQU8sRUFBRSxhQUFhLEVBQ3pCO0FBQ0QsWUFBUSxFQUFFO0FBQ04sZUFBTyxFQUFFLHNCQUFzQixFQUNsQztBQUNELFFBQUksRUFBRTtBQUNGLFlBQUksRUFBRSxJQUFJO0FBQ1YsZUFBTyxFQUFFLGtCQUFrQjtBQUMzQixnQkFBUSxFQUFFLEVBQUU7QUFDWix1QkFBZSxFQUFFLE9BQU87QUFDeEIsbUJBQVcsRUFBRSxPQUFPO0FBQ3BCLG1CQUFXLEVBQUUsQ0FBQyxFQUNqQjtBQUNELFFBQUksRUFBQztBQUNELFlBQUksRUFBRSxFQUFFO0FBQ1IsZUFBTyxFQUFFLE1BQU07QUFDZixlQUFPLEVBQUUsT0FBTyxFQUNuQjtDQUNKLENBQUM7OztBQUdGLElBQUksTUFBTSxHQUFHLDRCQUFTLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIgLyoqXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gICogSEVUSUMgUDIwMTlcbiAgKlxuICAqIEJ1aWxkZXIgbW9kdWxlXG4gICpcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxuICAqXG4gICogQ29weXJpZ2h0IDIwMTVcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gICpcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICAqL1xuXG5jbGFzcyBCdWlsZGVye1xuXG5cbiAgICAvKipcbiAgICAgKiBJbml0IG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJheSBvcHRpb25zXG4gICAgICovICAgICBcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuZ3JpZGJvcmRlcldpZHRoID0gb3B0aW9uc1snZ3JpZCddLmJvcmRlcldpZHRoO1xuXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG4gICAgICAgIHRoaXMuZ3JpZFNpemUgPSAocGFyc2VJbnQodGhpcy5ncmlkKSArIDEpICogdGhpcy5jZWxsU2l6ZTtcblxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydnb2JhbiddLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheSA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkID0gU3ByaW50KG9wdGlvbnNbJ2dyaWQnXS5lbGVtZW50KTtcblxuICAgICAgICB0aGlzLmdyaWRDYW52YXMgPSB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0aGlzLmdhbWVwbGF5Q2FudmFzID0gdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdvYmFuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNzcyBzdHlsZSBvZiB0aGUgZ29iYW5cbiAgICAgKi8gIFxuICAgIGJ1aWxkR29iYW4oKXtcbiAgICAgICAgdGhpcy4kZ29iYW4uY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplLFxuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB0aGUgZ2FtZXBsYXkgY2FudmFzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNhbnZhc1xuICAgICAqLyAgXG4gICAgYnVpbGRHYW1lcGxheSgpe1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0ud2lkdGggPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplXG4gICAgICAgIH0pXG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdyaWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gY2FudmFzIHdpdGggYSBncmlkIGRyYXduXG4gICAgICovICBcbiAgICBidWlsZEdyaWQoKXtcblxuICAgICAgICAvLyBTZXQgc2l6ZSBvZiBjYW52YXNcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0ud2lkdGggPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS5oZWlnaHQgPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEluaXQgdGhlIGNhbnZhc1xuICAgICAgICB2YXIgYyA9IHRoaXMuZ3JpZENhbnZhcztcblxuICAgICAgICAvLyBEcmF3IGVhY2ggbGluZXMgb2YgdGhlIGdyaWRcbiAgICAgICAgZm9yKHZhciB4ID0gMTsgeCA8PSB0aGlzLmdyaWQgOyB4Kyspe1xuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGMubW92ZVRvKHRoaXMuY2VsbFNpemUsIHRoaXMuY2VsbFNpemUgKiB4KTtcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xuICAgICAgICAgICAgYy5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IodmFyIHkgPSAxOyB5IDw9IHRoaXMuZ3JpZCA7IHkrKyl7XG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgYy5tb3ZlVG8odGhpcy5jZWxsU2l6ZSAqIHksIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgYy5saW5lVG8odGhpcy5jZWxsU2l6ZSAqIHksIHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gdGhpcy5ncmlkYm9yZGVyV2lkdGg7XG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGFsbCBlbGVtZW50c1xuICAgICAqXG4gICAgICovICBcbiAgICBydW4oKXtcbiAgICAgICAgdGhpcy5idWlsZEdvYmFuKCk7XG4gICAgICAgIHRoaXMuYnVpbGRHYW1lcGxheSgpO1xuICAgICAgICB0aGlzLmJ1aWxkR3JpZCgpO1xuICAgIH1cblxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEJ1aWxkZXI7IiwiIC8qKlxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xuICAqIEhFVElDIFAyMDE5XG4gICpcbiAgKiBHYW1lcGxheSBtb2R1bGVcbiAgKlxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXG4gICpcbiAgKiBDb3B5cmlnaHQgMjAxNVxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAgKlxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gICovXG5cbmltcG9ydCBUZXJyaXRvcnkgZnJvbSBcIi4vdGVycml0b3J5LmpzXCI7XG5cbmNsYXNzIEdhbWVwbGF5e1xuXG5cbiAgICAvKipcbiAgICAgKiBJbml0IHBhcmFtc1xuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnNcbiAgICAgKi8gICBcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcblxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydlbGVtZW50J10pO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJGdvYmFuLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIxID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcblxuICAgICAgICB0aGlzLnBsYXllciA9IDE7XG4gICAgICAgIHRoaXMuZW5lbXkgPSB0aGlzLnBsYXllcisrO1xuXG4gICAgICAgIHRoaXMudGFiID0gW107XG4gICAgICAgIHRoaXMudGVycml0b3JpZXMgPSBbXTtcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBbXTtcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xuXG4gICAgICAgIC8vIEluaXRpYWx5c2UgdGhlIHRhYlxuICAgICAgICBmb3IodmFyIHggPSAxOyB4IDw9IHRoaXMuZ3JpZCA7IHgrKyl7XG4gICAgICAgICAgICBmb3IodmFyIHkgPSAxOyB5IDw9IHRoaXMuZ3JpZCA7IHkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7eH07JHt5fWBdID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gZXZlbnQgb24gdGhlIGdhbWVwbGF5IFxuICAgICAqXG4gICAgICovICBcbiAgICBsaXN0ZW5uZXIoKXtcblxuICAgICAgICAvLyBUaGUgcGxheWVyIGNsaWNrIG9uIHRoZSBnb2JhbiB0byBwbGF5XG4gICAgICAgIFNwcmludCh0aGlzLiRnb2Jhbikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBpZih0aGlzLmNyZWF0ZShlLmxheWVyWCwgZS5sYXllclkpKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBEZWJ1Z1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipgKTtcbiAgICAgICAgICAgICAgICB2YXIgY29sb3IgPSB0aGlzLnJvY2tQbGF5ZXIxO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMucGxheWVyID09IDIpe1xuICAgICAgICAgICAgICAgICAgICBjb2xvciA9IHRoaXMucm9ja1BsYXllcjI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBKb3VldXIgJHt0aGlzLnBsYXllcn0gKCR7Y29sb3J9KSBlbiAke3RoaXMueH07JHt0aGlzLnl9YCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJld3JpdGVHb2JhbigpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyID0gKCh0aGlzLnBsYXllcisrKSAlIDIpICsgMTtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW15ID0gKCh0aGlzLmVuZW15KyspICUgMikgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LmJpbmQodGhpcykpO1xuXG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB3ZSBhcmUgaW4gYSBjYXNlIG9mIHN1aWNpZGVcbiAgICAgKlxuICAgICAqLyAgXG4gICAgY2hlY2tTdWljaWRlKCl7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHdlIGFyZSBpbiBhIGNhc2Ugb2YgS09cbiAgICAgKlxuICAgICAqLyAgXG4gICAgY2hlY2tLTygpe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBDcmVhdGUgYSByb2NrXG4gICAgICpcbiAgICAgKiBAcGFyYW1zIGNvb3JkaW5hdGVzIGNsaWNrXG4gICAgICogQHJldHVybiBhIHJvY2sgZHJhd24gb24gdGhlIGNhbnZhc1xuICAgICAqLyAgXG4gICAgY3JlYXRlKGxheWVyWCwgbGF5ZXJZKXtcblxuICAgICAgICAvLyBTZXQgY29vcmRpbmF0ZXMgXG4gICAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IoKGxheWVyWCArIHRoaXMuY2VsbFNpemUgLyAyKSAvIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICB0aGlzLnkgPSBNYXRoLmZsb29yKChsYXllclkgKyB0aGlzLmNlbGxTaXplIC8gMikgLyB0aGlzLmNlbGxTaXplKTtcblxuICAgICAgICAvLyBTZXQgY29sb3JcbiAgICAgICAgdmFyIGNvbG9yID0gdGhpcy5yb2NrUGxheWVyMTtcbiAgICAgICAgaWYodGhpcy5wbGF5ZXIgPT0gMil7XG4gICAgICAgICAgICBjb2xvciA9IHRoaXMucm9ja1BsYXllcjI7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDaGVjayBpZiB3ZSBhcmUgb24gdGhlIGdvYmFuXG4gICAgICAgIGlmKDEgPD0gdGhpcy54ICYmIHRoaXMueCA8PSB0aGlzLmdyaWQgJiYgMSA8PSB0aGlzLnkgJiYgdGhpcy55IDw9IHRoaXMuZ3JpZCApe1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcGxheWVyIGNhbiBwbGF5IGF0IHRoaXMgcGxhY2VcbiAgICAgICAgICAgIGlmKCF0aGlzLmNoZWNrU3VpY2lkZSgpICYmICF0aGlzLmNoZWNrS08oKSAmJiB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55fWBdID09IDApe1xuXG4gICAgICAgICAgICAgICAgLy8gRHJhdyB0aGUgcm9ja1xuICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5jYW52YXM7XG4gICAgICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgICAgICBjLmFyYyh0aGlzLnggKiB0aGlzLmNlbGxTaXplLCB0aGlzLnkgKiB0aGlzLmNlbGxTaXplLCB0aGlzLnJvY2tTaXplIC8gMiwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgICAgICAgICAgICBjLmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgICAgIGMuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgICAgICAgICAgYy5maWxsKCk7XG5cbiAgICAgICAgICAgICAgICAvLyBTYXZlIGluIHRoZSB0YWJcbiAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55fWBdID0gdGhpcy5wbGF5ZXI7XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9XG5cblxuICAgIC8qKlxuICAgICAqIFJld3JpdGUgZ29iYW4gd2l0aCB0aGUgbGFzdCBhY3Rpb24gb2YgdGhlIHBsYXllclxuICAgICAqXG4gICAgICovICBcbiAgICByZXdyaXRlR29iYW4oKXtcblxuICAgICAgICAvLyBJbml0IHRlcnJpdG9yeVxuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IFtdO1xuXG4gICAgICAgIC8vIENoZWsgaWYgdGhlcmUgYXJlIGVubmVtaWVzIGFyb3VuZCB0aGUgbGFzdCByb2NrIHBsYWNlZFxuICAgICAgICBpZihcbiAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgLSAxfWBdID09IHRoaXMuZW5lbXkgfHxcbiAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueCArIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkgfHxcbiAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgKyAxfWBdID09IHRoaXMuZW5lbXkgfHxcbiAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueCAtIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkpXG4gICAgICAgIHtcblxuICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSB0ZXJyaXRvcnkgb2YgdGhlIG5laWdoYm9ycyBcbiAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgLSAxfWBdID09IHRoaXMuZW5lbXkpe1xuICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3J5Wyd0b3AnXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCwgdGhpcy55IC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRhYltgJHt0aGlzLnggKyAxfTske3RoaXMueX1gXSA9PSB0aGlzLmVuZW15KXtcbiAgICAgICAgICAgICAgICB0aGlzLnRlcnJpdG9yeVsncmlnaHQnXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCArIDEsIHRoaXMueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55ICsgMX1gXSA9PSB0aGlzLmVuZW15KXtcbiAgICAgICAgICAgICAgICB0aGlzLnRlcnJpdG9yeVsnYm90dG9tJ10gPSBuZXcgVGVycml0b3J5KHRoaXMudGFiLCB0aGlzLmVuZW15LCB0aGlzLngsIHRoaXMueSArIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7dGhpcy54IC0gMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSl7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXJyaXRvcnlbJ2xlZnQnXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCAtIDEsIHRoaXMueSk7XG4gICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAvLyBUaW55IHRlcnJpdG9yaWVzIChkZWxldGUgYm91YmxvbilcbiAgICAgICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcbiAgICAgICAgICAgIHRoaXMudGVycml0b3JpZXMgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgaSBpbiB0aGlzLnRlcnJpdG9yeSl7XG4gICAgICAgICAgICAgICAgbGV0IHRlcnJpdG9yeSA9IHRoaXMudGVycml0b3J5W2ldO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2FjaGUuaW5kZXhPZihKU09OLnN0cmluZ2lmeSh0ZXJyaXRvcnkuZ2V0KCkpKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3JpZXMucHVzaCh0ZXJyaXRvcnkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2goSlNPTi5zdHJpbmdpZnkodGVycml0b3J5LmdldCgpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBWZXJpZmljYXRpb24gb2YgZW5jaXJjbGVtZW50IHRlcnJpdG9yaWVzXG4gICAgICAgICAgICBmb3IobGV0IHRlcnJpdG9yeSBvZiB0aGlzLnRlcnJpdG9yaWVzKXtcbiAgICAgICAgICAgICAgICAvLyBUaGUgdGVycml0b3J5IGlzIGNpcmNsZWRcbiAgICAgICAgICAgICAgICBpZih0ZXJyaXRvcnkuaXNEZWFkKCkpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIERldWJnXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcqKicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRW5lbXkgdGVycml0b3J5IGNpcmNsZWQgIScpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0ZXJyaXRvcnkuZ2V0KCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBlYWNoIHJvY2tcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCByb2NrRGllZCBvZiB0ZXJyaXRvcnkuZ2V0KCkpe1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJbiB0aGUgdGFiXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYltyb2NrRGllZF0gPSAwIDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT24gdGhlIGludGVyZmFjZVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gcm9ja0RpZWQubGFzdEluZGV4T2YoJzsnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCA9IHBhcnNlSW50KHJvY2tEaWVkLnN1YnN0cigwLCBpbmRleCkpICogdGhpcy5jZWxsU2l6ZSAtIDEgLSB0aGlzLnJvY2tTaXplIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSA9IHBhcnNlSW50KHJvY2tEaWVkLnN1YnN0cmluZyhpbmRleCArIDEpKSAqIHRoaXMuY2VsbFNpemUgLSAxIC0gdGhpcy5yb2NrU2l6ZSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5jbGVhclJlY3QodGhpcy54LHRoaXMueSx0aGlzLnJvY2tTaXplICsgMiwgdGhpcy5yb2NrU2l6ZSArIDIpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZXBsYXk7IiwiIC8qKlxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xuICAqIEhFVElDIFAyMDE5XG4gICogXG4gICogSW5kZXhcbiAgKlxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXG4gICpcbiAgKiBDb3B5cmlnaHQgMjAxNVxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAgKlxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gICovXG5cbmltcG9ydCBCdWlsZGVyIGZyb20gXCIuL2J1aWxkZXIuanNcIjtcbmltcG9ydCBHYW1lcGxheSBmcm9tIFwiLi9nYW1lcGxheS5qc1wiO1xuaW1wb3J0IFNhdmUgZnJvbSBcIi4vc2F2ZS5qc1wiO1xuaW1wb3J0IFNjb3JlIGZyb20gXCIuL3Njb3JlLmpzXCI7XG5cbmNsYXNzIEdhbWV7XG5cbiAgICAvKipcbiAgICAgKiBJbml0IG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJheSBvcHRpb25zIChvcHRpb25hbClcbiAgICAgKiBAcmV0dXJuIFxuICAgICAqLyAgICAgXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xuICAgICAgICB0aGlzLmdyaWRCb3JkZXJXaWR0aCA9IG9wdGlvbnNbJ2dyaWQnXS5ib3JkZXJXaWR0aDtcblxuICAgICAgICB0aGlzLiRnb2JhbiA9IG9wdGlvbnNbJ2dvYmFuJ10uZWxlbWVudDtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5lbGVtZW50O1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheSA9IG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudDtcblxuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuXG4gICAgICAgIHRoaXMucm9ja1NpemUgPSBvcHRpb25zWydyb2NrJ10uc2l6ZTtcbiAgICAgICAgdGhpcy5yb2NrUGxheWVyMSA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIxO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIyID0gb3B0aW9uc1sncm9jayddLnBsYXllcjI7XG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIFJ1biB0aGUgZ2FtZVxuICAgICAqXG4gICAgICovICBcbiAgICBydW4oKXtcblxuICAgICAgICAvLyBCdWlsZGVyXG4gICAgICAgIHZhciBHYW1lQnVpbGRlciA9IG5ldyBCdWlsZGVyKHtcbiAgICAgICAgICBnb2Jhbjoge1xuICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2JhblxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ2FtZXBsYXk6IHtcbiAgICAgICAgICAgICAgZWxlbWVudDogdGhpcy4kZ29iYW5fZ2FtZXBsYXlcbiAgICAgICAgICB9LFxuICAgICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICAgICAgZWxlbWVudDogdGhpcy4kZ29iYW5fZ3JpZCxcbiAgICAgICAgICAgICAgbmJyZTogdGhpcy5ncmlkLFxuICAgICAgICAgICAgICBjZWxsU2l6ZTogdGhpcy5jZWxsU2l6ZSxcbiAgICAgICAgICAgICAgYm9yZGVyV2lkdGggOiB0aGlzLmdyaWRCb3JkZXJXaWR0aCxcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBHYW1lQnVpbGRlci5ydW4oKTtcblxuXG4gICAgICAgIC8vIEdhbWVwbGF5XG4gICAgICAgIHZhciBHYW1lR2FtZXBsYXkgPSBuZXcgR2FtZXBsYXkoe1xuICAgICAgICAgICAgZWxlbWVudDogdGhpcy4kZ29iYW5fZ2FtZXBsYXksXG4gICAgICAgICAgICBncmlkOiB7XG4gICAgICAgICAgICAgICAgbmJyZTogdGhpcy5ncmlkLFxuICAgICAgICAgICAgICAgIGNlbGxTaXplOiB0aGlzLmNlbGxTaXplXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcm9jazoge1xuICAgICAgICAgICAgICAgIHNpemU6IHRoaXMucm9ja1NpemUsXG4gICAgICAgICAgICAgICAgcGxheWVyMTogdGhpcy5yb2NrUGxheWVyMSxcbiAgICAgICAgICAgICAgICBwbGF5ZXIyOiB0aGlzLnJvY2tQbGF5ZXIyLFxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgR2FtZUdhbWVwbGF5Lmxpc3Rlbm5lcigpO1xuXG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWU7XG5cbiIsIiAvKipcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcbiAgKiBIRVRJQyBQMjAxOVxuICAqXG4gICogU2F2ZSBtb2R1bGVcbiAgKlxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXG4gICpcbiAgKiBDb3B5cmlnaHQgMjAxNVxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAgKlxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gICovXG5cbmV4cG9ydCBjbGFzcyBTY29yZXtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuc2NvcmUgPSBbXTtcbiAgICB9XG5cbn0iLCIgLyoqXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gICogSEVUSUMgUDIwMTlcbiAgKlxuICAqIFNjb3JlIG1vZHVsZVxuICAqXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcbiAgKlxuICAqIENvcHlyaWdodCAyMDE1XG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICAqXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcbiAgKi9cblxuZXhwb3J0IGNsYXNzIFNjb3Jle1xuXG5cbn0iLCIgLyoqXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gICogSEVUSUMgUDIwMTlcbiAgKlxuICAqIFRlcnJpdG9yeSBtb2R1bGVcbiAgKlxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXG4gICpcbiAgKiBDb3B5cmlnaHQgMjAxNVxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAgKlxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gICovXG5cbmV4cG9ydCBjbGFzcyBUZXJyaXRvcnl7XG5cbiAgICAvKipcbiAgICAgKiBJbml0IG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSB0YWIgKGFycmF5KVxuICAgICAqIEBwYXJhbSBlbm5lbXkgKG51bWJlcilcbiAgICAgKiBAcGFyYW0geCBhbmQgeSBjb29yZGluYXRlIChudW1iZXJzKVxuICAgICAqLyAgICAgXG4gICAgY29uc3RydWN0b3IodGFiLCBlbmVteSwgeCwgeSl7XG5cbiAgICAgICAgdGhpcy50YWIgPSB0YWI7XG4gICAgICAgIHRoaXMuZW5lbXkgPSBlbmVteTtcbiAgICAgICAgdGhpcy54ID0geDtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgdGhpcy5zdGFydCA9IGAke3RoaXMueH07JHt0aGlzLnl9YDtcbiAgICAgICAgdGhpcy5jb29yZGluYXRlO1xuICAgICAgICB0aGlzLmNhY2hlID0gW107XG4gICAgICAgIHRoaXMuYXJvdW5kID0gW107XG4gICAgICAgIHRoaXMudGVycml0b3J5ID0gW107XG4gICAgICAgIHRoaXMuYm9yZGVyVGVycml0b3J5ID0gW107XG4gICAgICAgIHRoaXMuaW5kZXhHb0JhY2s7XG4gICAgICAgIHRoaXMubmV3Um9jayA9IHRydWU7XG5cbiAgICAgICAgdGhpcy5ydW4oKTtcblxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBGaW5kIHRoZSB0ZXJyaXRvcnkgYnkgcmVjdXJzaW9uXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHJ1bigpe1xuXG4gICAgICAgIC8vIEluaXQgYXJvdW5kIHJvY2tzXG4gICAgICAgIHRoaXMuYXJvdW5kPSBbXTtcblxuICAgICAgICAvLyBTYXZlXG4gICAgICAgIGlmKHRoaXMubmV3Um9jayl7XG4gICAgICAgICAgICB0aGlzLmNhY2hlW2Ake3RoaXMueH07JHt0aGlzLnl9YF0gPSAnY2hlY2snO1xuICAgICAgICAgICAgdGhpcy5pbmRleEdvQmFjayA9IHRoaXMudGVycml0b3J5Lmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMudGVycml0b3J5LnB1c2goYCR7dGhpcy54fTske3RoaXMueX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFdlIGNoZWNrIHJvY2tzIGFyb3VuZFxuICAgICAgICBmb3IodmFyIGkgPSAxOyBpIDw9IDQ7IGkrKyl7XG4gICAgICAgICAgICBzd2l0Y2goaSl7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGUgPSBgJHt0aGlzLnh9OyR7dGhpcy55IC0gMX1gO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlID0gYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueH07JHt0aGlzLnkgKyAxfWA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSA0OlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGUgPSBgJHt0aGlzLnggLSAxfTske3RoaXMueX1gO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy50YWJbdGhpcy5jb29yZGluYXRlXSA9PSB0aGlzLmVuZW15ICYmIHRoaXMuY2FjaGVbdGhpcy5jb29yZGluYXRlXSAgIT0gJ2NoZWNrJyl7XG4gICAgICAgICAgICAgICAgdGhpcy5hcm91bmQucHVzaCh0aGlzLmNvb3JkaW5hdGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gSWYgbm8gZW5lbWllc1xuICAgICAgICBpZih0aGlzLmFyb3VuZC5sZW5ndGggPT0gMCl7XG5cbiAgICAgICAgICAgIC8vIElmIHdlIGNhbiBnbyBiYWNrIHRvIGZpbmQgbW9yZSBuZXcgcm9ja3NcbiAgICAgICAgICAgIGlmKCEodGhpcy5zdGFydCA9PSBgJHt0aGlzLnh9OyR7dGhpcy55fWApKXtcblxuICAgICAgICAgICAgICAgIC8vIFNhaWQgd2UgZ28gYmFja1xuICAgICAgICAgICAgICAgIHRoaXMubmV3Um9jayA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIHRoaXMuaW5kZXhHb0JhY2sgPSB0aGlzLmluZGV4R29CYWNrIC0gMTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBTZXQgbmV3IGNvb3JkaW5hdGVzIGZvciB0aGUgbmV4dCBqdW1wXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy50ZXJyaXRvcnlbdGhpcy5pbmRleEdvQmFja10ubGFzdEluZGV4T2YoJzsnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBwYXJzZUludCh0aGlzLnRlcnJpdG9yeVt0aGlzLmluZGV4R29CYWNrXS5zdWJzdHIoMCwgaW5kZXgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBwYXJzZUludCh0aGlzLnRlcnJpdG9yeVt0aGlzLmluZGV4R29CYWNrXS5zdWJzdHJpbmcoaW5kZXggKyAxKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBKdW1wIGJ5IHJlY3Vyc2lvbiB0byBhbiBhbm90aGVyIHJvY2tcbiAgICAgICAgICAgICAgICB0aGlzLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2V7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIG9uZSBlbmVteVxuICAgICAgICAgICAgdGhpcy5yYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmFyb3VuZC5sZW5ndGgpO1xuXG4gICAgICAgICAgICAvLyBTZXQgbmV3IGNvb3JkaW5hdGVzIGZvciB0aGUgbmV4dCBqdW1wXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmFyb3VuZFt0aGlzLnJhbmRvbV0ubGFzdEluZGV4T2YoJzsnKTtcbiAgICAgICAgICAgIHRoaXMueCA9IHBhcnNlSW50KHRoaXMuYXJvdW5kW3RoaXMucmFuZG9tXS5zdWJzdHIoMCwgaW5kZXgpKTtcbiAgICAgICAgICAgIHRoaXMueSA9IHBhcnNlSW50KHRoaXMuYXJvdW5kW3RoaXMucmFuZG9tXS5zdWJzdHJpbmcoaW5kZXggKyAxKSk7XG5cbiAgICAgICAgICAgIC8vIEp1bXAgYnkgcmVjdXJzaW9uIHRvIGFuIGFub3RoZXIgcm9ja1xuICAgICAgICAgICAgdGhpcy5uZXdSb2NrID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMucnVuKCk7XG5cbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGFsbCB0aGUgdGVycml0b3J5XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGFycmF5XG4gICAgICovIFxuICAgIGdldCgpe1xuICAgICAgICByZXR1cm4gdGhpcy50ZXJyaXRvcnkuc29ydCgpO1xuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogUmV0dXJuIGJvcmRlcnMgb2YgdGhlIHRlcnJpdG9yeVxuICAgICAqXG4gICAgICogQHJldHVybiBhcnJheVxuICAgICAqLyBcbiAgICBnZXRCb3JkZXJzKCl7XG5cbiAgICAgICAgaWYodGhpcy5ib3JkZXJUZXJyaXRvcnkubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgZm9yKHZhciBpdGVtIG9mIHRoaXMudGVycml0b3J5KXtcblxuICAgICAgICAgICAgICAgIC8vIFNldCBjb29yZGluYXRlcyBvZiB0aGUgY3VycmVudCByb2NrXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gaXRlbS5sYXN0SW5kZXhPZignOycpO1xuICAgICAgICAgICAgICAgIHRoaXMueCA9IHBhcnNlSW50KGl0ZW0uc3Vic3RyKDAsIGluZGV4KSk7XG4gICAgICAgICAgICAgICAgdGhpcy55ID0gcGFyc2VJbnQoaXRlbS5zdWJzdHJpbmcoaW5kZXggKyAxKSk7XG5cbiAgICAgICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcm9jayBpcyBub3QgdG90YWxseSBhcm91bmQgdG8ga25vdyBpZiBpdCdzIG9uIHRoZSBib3JkZXJcbiAgICAgICAgICAgICAgICBpZighKHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgLSAxfWBdID09IHRoaXMuZW5lbXkgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55ICsgMX1gXSA9PSB0aGlzLmVuZW15ICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueCAtIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkpKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJUZXJyaXRvcnkucHVzaChpdGVtKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5ib3JkZXJUZXJyaXRvcnkuc29ydCgpO1xuXG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSB0ZXJyaXRvcnkgaXMgZGVhZFxuICAgICAqXG4gICAgICogQHJldHVybiB0cnVlIG9yIGZhbHNlXG4gICAgICovIFxuICAgIGlzRGVhZCgpe1xuXG4gICAgICAgIC8vIEdldCBib3JkZXJzIG9mIHRoZSB0ZXJyaXRvcnlcbiAgICAgICAgaWYodGhpcy5ib3JkZXJUZXJyaXRvcnkubGVuZ3RoID09IDApe1xuICAgICAgICAgICAgdGhpcy5nZXRCb3JkZXJzKCk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJbml0IGNhY2hlXG4gICAgICAgIHRoaXMuY2FjaGUgPSAwO1xuICAgICAgICBcbiAgICAgICAgZm9yKGxldCByb2NrIG9mIHRoaXMuYm9yZGVyVGVycml0b3J5KXtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHJvY2subGFzdEluZGV4T2YoJzsnKTtcbiAgICAgICAgICAgIGxldCB4ID0gcGFyc2VJbnQocm9jay5zdWJzdHIoMCwgaW5kZXgpKTtcbiAgICAgICAgICAgIGxldCB5ID0gcGFyc2VJbnQocm9jay5zdWJzdHJpbmcoaW5kZXggKyAxKSk7XG5cbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSByb2NrIGhhcyBhbnkgbGliZXJ0aWVzXG4gICAgICAgICAgICBpZih0aGlzLnRhYltgJHt4fTske3kgLSAxfWBdICE9IDAgJiZcbiAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3ggKyAxfTske3l9YF0gIT0gMCAmJlxuICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7eH07JHt5ICsgMX1gXSAhPSAwICYmXG4gICAgICAgICAgICAgICB0aGlzLnRhYltgJHt4IC0gMX07JHt5fWBdICE9IDApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5jYWNoZSA9PSB0aGlzLmJvcmRlclRlcnJpdG9yeS5sZW5ndGgpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBUZXJyaXRvcnk7ICIsIi8qKlxuICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcbiAqIEhFVElDIFAyMDE5XG4gKlxuICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlbGVyKVxuICpcbiAqIENvcHlyaWdodCAyMDE1XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqXG4gKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICovXG5cbi8vIEltcG9ydCB0aGUgYXBwXG5pbXBvcnQgR2FtZSBmcm9tIFwiLi9hcHAvaW5kZXguanNcIjtcblxuLy8gU2V0IG9wdGlvbnNcbnZhciBvcHRpb25zID0ge1xuICAgIGdvYmFuOiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2JhbicsXG4gICAgfSxcbiAgICBnYW1lcGxheToge1xuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW5fZ2FtZXBsYXknLFxuICAgIH0sXG4gICAgZ3JpZDoge1xuICAgICAgICBuYnJlOiAnMTknLFxuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW5fZ3JpZCcsXG4gICAgICAgIGNlbGxTaXplOiA0MCxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICAgICAgICBib3JkZXJDb2xvcjogJ2JsYWNrJyxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDIsXG4gICAgfSxcbiAgICByb2NrOntcbiAgICAgICAgc2l6ZTogMjAsXG4gICAgICAgIHBsYXllcjE6ICdncmV5JyxcbiAgICAgICAgcGxheWVyMjogJ2JsYWNrJyxcbiAgICB9XG59O1xuXG4vLyBJbml0aWFsaXplIGFuZCBydW4gdGhlIGdhbWVcbnZhciBHb0dhbWUgPSBuZXcgR2FtZShvcHRpb25zKTtcbkdvR2FtZS5ydW4oKTsiXX0=
