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

        this.coordinate;
        this.x;
        this.y;

        this.tab = [];
        this.territories = [];
        this.territory = [];
        this.cache = [];

        this.init();
    }

    _createClass(Gameplay, [{
        key: 'init',

        /**
         * Initialize the array
         *
         */
        value: function init() {
            for (var x = 1; x <= this.grid; x++) {
                for (var y = 1; y <= this.grid; y++) {
                    this.tab['' + x + ';' + y] = 0;
                }
            }
        }
    }, {
        key: 'listenner',

        /**
         * Listen event on the gameplay 
         *
         */
        value: function listenner() {

            // The player click on the goban to play
            Sprint(this.$goban).on('click', (function (e) {

                // Set coordinates
                this.x = Math.floor((layerX + this.cellSize / 2) / this.cellSize);
                this.y = Math.floor((layerY + this.cellSize / 2) / this.cellSize);

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
         * @return a rock created
         */
        value: function create(x, y) {

            // Set color of the player
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
         * Rewrite the goban with the last action of the player
         *
         */
        value: function rewriteGoban() {

            // Init territory
            this.territory = [];

            // Chek if there are ennemies around the last rock placed
            if (this.tab['' + this.x + ';' + (this.y - 1)] == this.enemy || this.tab['' + (this.x + 1) + ';' + this.y] == this.enemy || this.tab['' + this.x + ';' + (this.y + 1)] == this.enemy || this.tab['' + (this.x - 1) + ';' + this.y] == this.enemy) {

                // Return the territory of the ennemy neighbors
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

                // Verification the encirclement of each territory
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.territories[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var territory = _step.value;

                        if (territory.isDead()) {

                            // Debug
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
            this.GameBuilder = new _builderJs2["default"]({
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
            this.GameBuilder.run();

            // Gameplay
            this.GameGameplay = new _gameplayJs2["default"]({
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
            this.GameGameplay.listenner();
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
        this.territory = [];
        this.borderTerritory = [];

        this.enemy = enemy;
        this.start = '' + this.x + ';' + this.y;
        this.coordinate;
        this.x = x;
        this.y = y;

        this.indexGoBack;
        this.newRock = true;
        this.around = [];
        this.cache = [];

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2J1aWxkZXIuanMiLCJEOi9Ecm9wYm94L1NpdGVzL3d3dy9Hb0dhbWUvc3JjL2pzL2FwcC9nYW1lcGxheS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2luZGV4LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvc2F2ZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL3Njb3JlLmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvdGVycml0b3J5LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9mYWtlX2U5Y2M0YTY5LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2dCTSxPQUFPOzs7Ozs7OztBQVFFLGFBUlQsT0FBTyxDQVFHLE9BQU8sRUFBQzs4QkFSbEIsT0FBTzs7QUFTTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUVuRCxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxD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RUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIiAvKipcclxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cclxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXHJcbiAgKiBIRVRJQyBQMjAxOVxyXG4gICpcclxuICAqIEJ1aWxkZXIgbW9kdWxlXHJcbiAgKlxyXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcclxuICAqXHJcbiAgKiBDb3B5cmlnaHQgMjAxNVxyXG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXHJcbiAgKlxyXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcclxuICAqL1xyXG5cclxuY2xhc3MgQnVpbGRlcntcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0IG9wdGlvbnNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9uc1xyXG4gICAgICovICAgICBcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xyXG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xyXG4gICAgICAgIHRoaXMuZ3JpZGJvcmRlcldpZHRoID0gb3B0aW9uc1snZ3JpZCddLmJvcmRlcldpZHRoO1xyXG5cclxuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xyXG4gICAgICAgIHRoaXMuZ3JpZFNpemUgPSAocGFyc2VJbnQodGhpcy5ncmlkKSArIDEpICogdGhpcy5jZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ29iYW4nXS5lbGVtZW50KTtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheSA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQgPSBTcHJpbnQob3B0aW9uc1snZ3JpZCddLmVsZW1lbnQpO1xyXG5cclxuICAgICAgICB0aGlzLmdyaWRDYW52YXMgPSB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuZ2FtZXBsYXlDYW52YXMgPSB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIHRoZSBnb2JhblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gY3NzIHN0eWxlIG9mIHRoZSBnb2JhblxyXG4gICAgICovICBcclxuICAgIGJ1aWxkR29iYW4oKXtcclxuICAgICAgICB0aGlzLiRnb2Jhbi5jc3Moe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplLFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVpbGQgdGhlIGdhbWVwbGF5IGNhbnZhc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gY2FudmFzXHJcbiAgICAgKi8gIFxyXG4gICAgYnVpbGRHYW1lcGxheSgpe1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmhlaWdodCA9IHRoaXMuZ3JpZFNpemU7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuY3NzKHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxyXG4gICAgICAgIH0pXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCdWlsZCB0aGUgZ3JpZFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gY2FudmFzIHdpdGggYSBncmlkIGRyYXduXHJcbiAgICAgKi8gIFxyXG4gICAgYnVpbGRHcmlkKCl7XHJcblxyXG4gICAgICAgIC8vIFNldCBzaXplIG9mIGNhbnZhc1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS5oZWlnaHQgPSB0aGlzLmdyaWRTaXplO1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuY3NzKHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIC8vIEluaXQgdGhlIGNhbnZhc1xyXG4gICAgICAgIHZhciBjID0gdGhpcy5ncmlkQ2FudmFzO1xyXG5cclxuICAgICAgICAvLyBEcmF3IGVhY2ggbGluZXMgb2YgdGhlIGdyaWRcclxuICAgICAgICBmb3IodmFyIHggPSAxOyB4IDw9IHRoaXMuZ3JpZCA7IHgrKyl7XHJcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGMubW92ZVRvKHRoaXMuY2VsbFNpemUsIHRoaXMuY2VsbFNpemUgKiB4KTtcclxuICAgICAgICAgICAgYy5saW5lVG8odGhpcy5ncmlkU2l6ZSAtIHRoaXMuY2VsbFNpemUsIHRoaXMuY2VsbFNpemUgKiB4KTtcclxuICAgICAgICAgICAgYy5saW5lV2lkdGggPSB0aGlzLmdyaWRib3JkZXJXaWR0aDtcclxuICAgICAgICAgICAgYy5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZm9yKHZhciB5ID0gMTsgeSA8PSB0aGlzLmdyaWQgOyB5Kyspe1xyXG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplICogeSwgdGhpcy5jZWxsU2l6ZSk7XHJcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSk7XHJcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gdGhpcy5ncmlkYm9yZGVyV2lkdGg7XHJcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCdWlsZCBhbGwgZWxlbWVudHNcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgcnVuKCl7XHJcbiAgICAgICAgdGhpcy5idWlsZEdvYmFuKCk7XHJcbiAgICAgICAgdGhpcy5idWlsZEdhbWVwbGF5KCk7XHJcbiAgICAgICAgdGhpcy5idWlsZEdyaWQoKTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQnVpbGRlcjsiLCIgLyoqXHJcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXHJcbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xyXG4gICogSEVUSUMgUDIwMTlcclxuICAqXHJcbiAgKiBHYW1lcGxheSBtb2R1bGVcclxuICAqXHJcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxyXG4gICpcclxuICAqIENvcHlyaWdodCAyMDE1XHJcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICAqXHJcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxyXG4gICovXHJcblxyXG5pbXBvcnQgVGVycml0b3J5IGZyb20gXCIuL3RlcnJpdG9yeS5qc1wiO1xyXG5cclxuY2xhc3MgR2FtZXBsYXl7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdCBwYXJhbXNcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9uc1xyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcclxuXHJcbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZWxlbWVudCddKTtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJGdvYmFuLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xyXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XHJcblxyXG4gICAgICAgIHRoaXMucm9ja1NpemUgPSBvcHRpb25zWydyb2NrJ10uc2l6ZTtcclxuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIxID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XHJcbiAgICAgICAgdGhpcy5yb2NrUGxheWVyMiA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIyO1xyXG5cclxuICAgICAgICB0aGlzLnBsYXllciA9IDE7XHJcbiAgICAgICAgdGhpcy5lbmVteSA9IHRoaXMucGxheWVyKys7XHJcblxyXG4gICAgICAgIHRoaXMuY29vcmRpbmF0ZTtcclxuICAgICAgICB0aGlzLng7XHJcbiAgICAgICAgdGhpcy55O1xyXG5cclxuICAgICAgICB0aGlzLnRhYiA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVycml0b3JpZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0aWFsaXplIHRoZSBhcnJheVxyXG4gICAgICpcclxuICAgICAqLyBcclxuICAgIGluaXQoKXtcclxuICAgICAgICBmb3IodmFyIHggPSAxOyB4IDw9IHRoaXMuZ3JpZCA7IHgrKyl7XHJcbiAgICAgICAgICAgIGZvcih2YXIgeSA9IDE7IHkgPD0gdGhpcy5ncmlkIDsgeSsrKXtcclxuICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3h9OyR7eX1gXSA9IDA7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIExpc3RlbiBldmVudCBvbiB0aGUgZ2FtZXBsYXkgXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGxpc3Rlbm5lcigpe1xyXG5cclxuICAgICAgICAvLyBUaGUgcGxheWVyIGNsaWNrIG9uIHRoZSBnb2JhbiB0byBwbGF5XHJcbiAgICAgICAgU3ByaW50KHRoaXMuJGdvYmFuKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCBjb29yZGluYXRlcyBcclxuICAgICAgICAgICAgdGhpcy54ID0gTWF0aC5mbG9vcigobGF5ZXJYICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IoKGxheWVyWSArIHRoaXMuY2VsbFNpemUgLyAyKSAvIHRoaXMuY2VsbFNpemUpO1xyXG5cclxuICAgICAgICAgICAgaWYodGhpcy5jcmVhdGUodGhpcy54LCB0aGlzLnkpKXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gRGVidWdcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipgKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHRoaXMucm9ja1BsYXllcjE7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnBsYXllciA9PSAyKXtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9IHRoaXMucm9ja1BsYXllcjI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgSm91ZXVyICR7dGhpcy5wbGF5ZXJ9ICgke2NvbG9yfSkgZW4gJHt0aGlzLnh9OyR7dGhpcy55fWApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmV3cml0ZUdvYmFuKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllciA9ICgodGhpcy5wbGF5ZXIrKykgJSAyKSArIDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW15ID0gKCh0aGlzLmVuZW15KyspICUgMikgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHdlIGFyZSBpbiBhIGNhc2Ugb2Ygc3VpY2lkZVxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBjaGVja1N1aWNpZGUoKXtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHdlIGFyZSBpbiBhIGNhc2Ugb2YgS09cclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgY2hlY2tLTygpe1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbXMgY29vcmRpbmF0ZXMgY2xpY2tcclxuICAgICAqIEByZXR1cm4gYSByb2NrIGNyZWF0ZWRcclxuICAgICAqLyAgXHJcbiAgICBjcmVhdGUoeCwgeSl7XHJcblxyXG4gICAgICAgIC8vIFNldCBjb2xvciBvZiB0aGUgcGxheWVyXHJcbiAgICAgICAgdmFyIGNvbG9yID0gdGhpcy5yb2NrUGxheWVyMTtcclxuICAgICAgICBpZih0aGlzLnBsYXllciA9PSAyKXtcclxuICAgICAgICAgICAgY29sb3IgPSB0aGlzLnJvY2tQbGF5ZXIyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgYXJlIG9uIHRoZSBnb2JhblxyXG4gICAgICAgIGlmKDEgPD0gdGhpcy54ICYmIHRoaXMueCA8PSB0aGlzLmdyaWQgJiYgMSA8PSB0aGlzLnkgJiYgdGhpcy55IDw9IHRoaXMuZ3JpZCApe1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBsYXllciBjYW4gcGxheSBhdCB0aGlzIHBsYWNlXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmNoZWNrU3VpY2lkZSgpICYmICF0aGlzLmNoZWNrS08oKSAmJiB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55fWBdID09IDApe1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIERyYXcgdGhlIHJvY2tcclxuICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5jYW52YXM7XHJcbiAgICAgICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgYy5hcmModGhpcy54ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy55ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy5yb2NrU2l6ZSAvIDIsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBjLmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgYy5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgIGMuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNhdmUgaW4gdGhlIHRhYlxyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueX1gXSA9IHRoaXMucGxheWVyO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV3cml0ZSB0aGUgZ29iYW4gd2l0aCB0aGUgbGFzdCBhY3Rpb24gb2YgdGhlIHBsYXllclxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICByZXdyaXRlR29iYW4oKXtcclxuXHJcbiAgICAgICAgLy8gSW5pdCB0ZXJyaXRvcnlcclxuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IFtdO1xyXG5cclxuICAgICAgICAvLyBDaGVrIGlmIHRoZXJlIGFyZSBlbm5lbWllcyBhcm91bmQgdGhlIGxhc3Qgcm9jayBwbGFjZWRcclxuICAgICAgICBpZihcclxuICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueSAtIDF9YF0gPT0gdGhpcy5lbmVteSB8fFxyXG4gICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnggKyAxfTske3RoaXMueX1gXSA9PSB0aGlzLmVuZW15IHx8XHJcbiAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgKyAxfWBdID09IHRoaXMuZW5lbXkgfHxcclxuICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54IC0gMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSlcclxuICAgICAgICB7XHJcblxyXG4gICAgICAgICAgICAvLyBSZXR1cm4gdGhlIHRlcnJpdG9yeSBvZiB0aGUgZW5uZW15IG5laWdoYm9yc1xyXG4gICAgICAgICAgICBpZih0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55IC0gMX1gXSA9PSB0aGlzLmVuZW15KXtcclxuICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3J5Wyd0b3AnXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCwgdGhpcy55IC0gMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRlcnJpdG9yeVsncmlnaHQnXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCArIDEsIHRoaXMueSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueSArIDF9YF0gPT0gdGhpcy5lbmVteSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRlcnJpdG9yeVsnYm90dG9tJ10gPSBuZXcgVGVycml0b3J5KHRoaXMudGFiLCB0aGlzLmVuZW15LCB0aGlzLngsIHRoaXMueSArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3RoaXMueCAtIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXJyaXRvcnlbJ2xlZnQnXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCAtIDEsIHRoaXMueSk7XHJcbiAgICAgICAgICAgIH0gXHJcblxyXG5cclxuICAgICAgICAgICAgLy8gVGlueSB0ZXJyaXRvcmllcyAoZGVsZXRlIGJvdWJsb24pXHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy50ZXJyaXRvcmllcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgaW4gdGhpcy50ZXJyaXRvcnkpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlcnJpdG9yeSA9IHRoaXMudGVycml0b3J5W2ldO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbmRleE9mKEpTT04uc3RyaW5naWZ5KHRlcnJpdG9yeS5nZXQoKSkpID09IC0xKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRlcnJpdG9yaWVzLnB1c2godGVycml0b3J5KTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2goSlNPTi5zdHJpbmdpZnkodGVycml0b3J5LmdldCgpKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFZlcmlmaWNhdGlvbiB0aGUgZW5jaXJjbGVtZW50IG9mIGVhY2ggdGVycml0b3J5XHJcbiAgICAgICAgICAgIGZvcihsZXQgdGVycml0b3J5IG9mIHRoaXMudGVycml0b3JpZXMpe1xyXG4gICAgICAgICAgICAgICAgaWYodGVycml0b3J5LmlzRGVhZCgpKXtcclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAvLyBEZWJ1Z1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcqKicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFbmVteSB0ZXJyaXRvcnkgY2lyY2xlZCAhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGVycml0b3J5LmdldCgpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGVsZXRlIGVhY2ggcm9ja1xyXG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcm9ja0RpZWQgb2YgdGVycml0b3J5LmdldCgpKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIEluIHRoZSB0YWJcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJbcm9ja0RpZWRdID0gMCA7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBPbiB0aGUgaW50ZXJmYWNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBpbmRleCA9IHJvY2tEaWVkLmxhc3RJbmRleE9mKCc7Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueCA9IHBhcnNlSW50KHJvY2tEaWVkLnN1YnN0cigwLCBpbmRleCkpICogdGhpcy5jZWxsU2l6ZSAtIDEgLSB0aGlzLnJvY2tTaXplIC8gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy55ID0gcGFyc2VJbnQocm9ja0RpZWQuc3Vic3RyaW5nKGluZGV4ICsgMSkpICogdGhpcy5jZWxsU2l6ZSAtIDEgLSB0aGlzLnJvY2tTaXplIC8gMjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuY2xlYXJSZWN0KHRoaXMueCx0aGlzLnksdGhpcy5yb2NrU2l6ZSArIDIsIHRoaXMucm9ja1NpemUgKyAyKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEdhbWVwbGF5OyIsIiAvKipcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcbiAgKiBIRVRJQyBQMjAxOVxuICAqIFxuICAqIEluZGV4XG4gICpcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxuICAqXG4gICogQ29weXJpZ2h0IDIwMTVcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gICpcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICAqL1xuXG5pbXBvcnQgQnVpbGRlciBmcm9tIFwiLi9idWlsZGVyLmpzXCI7XG5pbXBvcnQgR2FtZXBsYXkgZnJvbSBcIi4vZ2FtZXBsYXkuanNcIjtcbmltcG9ydCBTYXZlIGZyb20gXCIuL3NhdmUuanNcIjtcbmltcG9ydCBTY29yZSBmcm9tIFwiLi9zY29yZS5qc1wiO1xuXG5jbGFzcyBHYW1le1xuXG4gICAgLyoqXG4gICAgICogSW5pdCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9ucyAob3B0aW9uYWwpXG4gICAgICogQHJldHVybiBcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcbiAgICAgICAgdGhpcy5ncmlkQm9yZGVyV2lkdGggPSBvcHRpb25zWydncmlkJ10uYm9yZGVyV2lkdGg7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBvcHRpb25zWydnb2JhbiddLmVsZW1lbnQ7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQgPSBvcHRpb25zWydncmlkJ10uZWxlbWVudDtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkgPSBvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcblxuICAgICAgICB0aGlzLnJvY2tTaXplID0gb3B0aW9uc1sncm9jayddLnNpemU7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjEgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMTtcbiAgICAgICAgdGhpcy5yb2NrUGxheWVyMiA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIyO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBSdW4gdGhlIGdhbWVcbiAgICAgKlxuICAgICAqLyAgXG4gICAgcnVuKCl7XG5cbiAgICAgICAgLy8gQnVpbGRlclxuICAgICAgICB0aGlzLkdhbWVCdWlsZGVyID0gbmV3IEJ1aWxkZXIoe1xuICAgICAgICAgIGdvYmFuOiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuJGdvYmFuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnYW1lcGxheToge1xuICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9nYW1lcGxheVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ3JpZDoge1xuICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9ncmlkLFxuICAgICAgICAgICAgICBuYnJlOiB0aGlzLmdyaWQsXG4gICAgICAgICAgICAgIGNlbGxTaXplOiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICBib3JkZXJXaWR0aCA6IHRoaXMuZ3JpZEJvcmRlcldpZHRoLFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuR2FtZUJ1aWxkZXIucnVuKCk7XG5cblxuICAgICAgICAvLyBHYW1lcGxheVxuICAgICAgICB0aGlzLkdhbWVHYW1lcGxheSA9IG5ldyBHYW1lcGxheSh7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9nYW1lcGxheSxcbiAgICAgICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICAgICAgICBuYnJlOiB0aGlzLmdyaWQsXG4gICAgICAgICAgICAgICAgY2VsbFNpemU6IHRoaXMuY2VsbFNpemVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb2NrOiB7XG4gICAgICAgICAgICAgICAgc2l6ZTogdGhpcy5yb2NrU2l6ZSxcbiAgICAgICAgICAgICAgICBwbGF5ZXIxOiB0aGlzLnJvY2tQbGF5ZXIxLFxuICAgICAgICAgICAgICAgIHBsYXllcjI6IHRoaXMucm9ja1BsYXllcjIsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLkdhbWVHYW1lcGxheS5saXN0ZW5uZXIoKTtcblxuICAgIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBHYW1lO1xuXG4iLCIgLyoqXHJcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXHJcbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xyXG4gICogSEVUSUMgUDIwMTlcclxuICAqXHJcbiAgKiBTYXZlIG1vZHVsZVxyXG4gICpcclxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXHJcbiAgKlxyXG4gICogQ29weXJpZ2h0IDIwMTVcclxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4gICpcclxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XHJcbiAgKi9cclxuXHJcbmV4cG9ydCBjbGFzcyBTY29yZXtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuc2NvcmUgPSBbXTtcclxuICAgIH1cclxuXHJcbn0iLCIgLyoqXHJcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXHJcbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xyXG4gICogSEVUSUMgUDIwMTlcclxuICAqXHJcbiAgKiBTY29yZSBtb2R1bGVcclxuICAqXHJcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxyXG4gICpcclxuICAqIENvcHlyaWdodCAyMDE1XHJcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICAqXHJcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxyXG4gICovXHJcblxyXG5leHBvcnQgY2xhc3MgU2NvcmV7XHJcblxyXG5cclxufSIsIiAvKipcclxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cclxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXHJcbiAgKiBIRVRJQyBQMjAxOVxyXG4gICpcclxuICAqIFRlcnJpdG9yeSBtb2R1bGVcclxuICAqXHJcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxyXG4gICpcclxuICAqIENvcHlyaWdodCAyMDE1XHJcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICAqXHJcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxyXG4gICovXHJcblxyXG5leHBvcnQgY2xhc3MgVGVycml0b3J5e1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHRhYiwgZW5lbXksIHgsIHkpe1xyXG5cclxuICAgICAgICB0aGlzLnRhYiA9IHRhYjtcclxuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IFtdO1xyXG4gICAgICAgIHRoaXMuYm9yZGVyVGVycml0b3J5ID0gW107XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5lbmVteSA9IGVuZW15O1xyXG4gICAgICAgIHRoaXMuc3RhcnQgPSBgJHt0aGlzLnh9OyR7dGhpcy55fWA7XHJcbiAgICAgICAgdGhpcy5jb29yZGluYXRlO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmluZGV4R29CYWNrO1xyXG4gICAgICAgIHRoaXMubmV3Um9jayA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5hcm91bmQgPSBbXTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gW107XHJcblxyXG4gICAgICAgIHRoaXMucnVuKCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBGaW5kIHRoZSB0ZXJyaXRvcnkgYnkgcmVjdXJzaW9uXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIHJ1bigpe1xyXG5cclxuICAgICAgICAvLyBJbml0IGFyb3VuZCByb2Nrc1xyXG4gICAgICAgIHRoaXMuYXJvdW5kPSBbXTtcclxuXHJcbiAgICAgICAgLy8gU2F2ZVxyXG4gICAgICAgIGlmKHRoaXMubmV3Um9jayl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGVbYCR7dGhpcy54fTske3RoaXMueX1gXSA9ICdjaGVjayc7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXhHb0JhY2sgPSB0aGlzLnRlcnJpdG9yeS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMudGVycml0b3J5LnB1c2goYCR7dGhpcy54fTske3RoaXMueX1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdlIGNoZWNrIHJvY2tzIGFyb3VuZFxyXG4gICAgICAgIGZvcih2YXIgaSA9IDE7IGkgPD0gNDsgaSsrKXtcclxuICAgICAgICAgICAgc3dpdGNoKGkpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueH07JHt0aGlzLnkgLSAxfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueCArIDF9OyR7dGhpcy55fWA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueH07JHt0aGlzLnkgKyAxfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueCAtIDF9OyR7dGhpcy55fWA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLnRhYlt0aGlzLmNvb3JkaW5hdGVdID09IHRoaXMuZW5lbXkgJiYgdGhpcy5jYWNoZVt0aGlzLmNvb3JkaW5hdGVdICAhPSAnY2hlY2snKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJvdW5kLnB1c2godGhpcy5jb29yZGluYXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgbm8gZW5lbWllc1xyXG4gICAgICAgIGlmKHRoaXMuYXJvdW5kLmxlbmd0aCA9PSAwKXtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHdlIGNhbiBnbyBiYWNrIHRvIGZpbmQgbW9yZSBuZXcgcm9ja3NcclxuICAgICAgICAgICAgaWYoISh0aGlzLnN0YXJ0ID09IGAke3RoaXMueH07JHt0aGlzLnl9YCkpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNhaWQgd2UgZ28gYmFja1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdSb2NrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4R29CYWNrID0gdGhpcy5pbmRleEdvQmFjayAtIDE7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIFNldCBuZXcgY29vcmRpbmF0ZXMgZm9yIHRoZSBuZXh0IGp1bXBcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMudGVycml0b3J5W3RoaXMuaW5kZXhHb0JhY2tdLmxhc3RJbmRleE9mKCc7Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBwYXJzZUludCh0aGlzLnRlcnJpdG9yeVt0aGlzLmluZGV4R29CYWNrXS5zdWJzdHIoMCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IHBhcnNlSW50KHRoaXMudGVycml0b3J5W3RoaXMuaW5kZXhHb0JhY2tdLnN1YnN0cmluZyhpbmRleCArIDEpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBKdW1wIGJ5IHJlY3Vyc2lvbiB0byBhbiBhbm90aGVyIHJvY2tcclxuICAgICAgICAgICAgICAgIHRoaXMucnVuKCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBlbHNle1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgb25lIGVuZW15XHJcbiAgICAgICAgICAgIHRoaXMucmFuZG9tID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogdGhpcy5hcm91bmQubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgICAgIC8vIFNldCBuZXcgY29vcmRpbmF0ZXMgZm9yIHRoZSBuZXh0IGp1bXBcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5hcm91bmRbdGhpcy5yYW5kb21dLmxhc3RJbmRleE9mKCc7Jyk7XHJcbiAgICAgICAgICAgIHRoaXMueCA9IHBhcnNlSW50KHRoaXMuYXJvdW5kW3RoaXMucmFuZG9tXS5zdWJzdHIoMCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgdGhpcy55ID0gcGFyc2VJbnQodGhpcy5hcm91bmRbdGhpcy5yYW5kb21dLnN1YnN0cmluZyhpbmRleCArIDEpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEp1bXAgYnkgcmVjdXJzaW9uIHRvIGFuIGFub3RoZXIgcm9ja1xyXG4gICAgICAgICAgICB0aGlzLm5ld1JvY2sgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnJ1bigpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBhbGwgdGhlIHRlcnJpdG9yeVxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gYXJyYXlcclxuICAgICAqLyBcclxuICAgIGdldCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRlcnJpdG9yeS5zb3J0KCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBib3JkZXJzIG9mIHRoZSB0ZXJyaXRvcnlcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGFycmF5XHJcbiAgICAgKi8gXHJcbiAgICBnZXRCb3JkZXJzKCl7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYm9yZGVyVGVycml0b3J5Lmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgZm9yKHZhciBpdGVtIG9mIHRoaXMudGVycml0b3J5KXtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgY29vcmRpbmF0ZXMgb2YgdGhlIGN1cnJlbnQgcm9ja1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gaXRlbS5sYXN0SW5kZXhPZignOycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gcGFyc2VJbnQoaXRlbS5zdWJzdHIoMCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IHBhcnNlSW50KGl0ZW0uc3Vic3RyaW5nKGluZGV4ICsgMSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSByb2NrIGlzIG5vdCB0b3RhbGx5IGFyb3VuZCB0byBrbm93IGlmIGl0J3Mgb24gdGhlIGJvcmRlclxyXG4gICAgICAgICAgICAgICAgaWYoISh0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55IC0gMX1gXSA9PSB0aGlzLmVuZW15ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgKyAxfWBdID09IHRoaXMuZW5lbXkgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnggLSAxfTske3RoaXMueX1gXSA9PSB0aGlzLmVuZW15KSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJUZXJyaXRvcnkucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVyVGVycml0b3J5LnNvcnQoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSB0ZXJyaXRvcnkgaXMgZGVhZFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdHJ1ZSBvciBmYWxzZVxyXG4gICAgICovIFxyXG4gICAgaXNEZWFkKCl7XHJcblxyXG5cclxuICAgICAgICAvLyBHZXQgYm9yZGVycyBvZiB0aGUgdGVycml0b3J5XHJcbiAgICAgICAgaWYodGhpcy5ib3JkZXJUZXJyaXRvcnkubGVuZ3RoID09IDApe1xyXG4gICAgICAgICAgICB0aGlzLmdldEJvcmRlcnMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIEluaXQgY2FjaGVcclxuICAgICAgICB0aGlzLmNhY2hlID0gMDtcclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IHJvY2sgb2YgdGhpcy5ib3JkZXJUZXJyaXRvcnkpe1xyXG4gICAgICAgICAgICBsZXQgaW5kZXggPSByb2NrLmxhc3RJbmRleE9mKCc7Jyk7XHJcbiAgICAgICAgICAgIGxldCB4ID0gcGFyc2VJbnQocm9jay5zdWJzdHIoMCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgbGV0IHkgPSBwYXJzZUludChyb2NrLnN1YnN0cmluZyhpbmRleCArIDEpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSByb2NrIGhhcyBhbnkgbGliZXJ0aWVzXHJcbiAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3h9OyR7eSAtIDF9YF0gIT0gMCAmJlxyXG4gICAgICAgICAgICAgICB0aGlzLnRhYltgJHt4ICsgMX07JHt5fWBdICE9IDAgJiZcclxuICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7eH07JHt5ICsgMX1gXSAhPSAwICYmXHJcbiAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3ggLSAxfTske3l9YF0gIT0gMClcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZih0aGlzLmNhY2hlID09IHRoaXMuYm9yZGVyVGVycml0b3J5Lmxlbmd0aCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRlcnJpdG9yeTsgIiwiLyoqXG4gKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXG4gKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xuICogSEVUSUMgUDIwMTlcbiAqXG4gKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVsZXIpXG4gKlxuICogQ29weXJpZ2h0IDIwMTVcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICpcbiAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gKi9cblxuLy8gSW1wb3J0IHRoZSBhcHBcbmltcG9ydCBHYW1lIGZyb20gXCIuL2FwcC9pbmRleC5qc1wiO1xuXG4vLyBTZXQgb3B0aW9uc1xudmFyIG9wdGlvbnMgPSB7XG4gICAgZ29iYW46IHtcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuJyxcbiAgICB9LFxuICAgIGdhbWVwbGF5OiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9nYW1lcGxheScsXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICAgIG5icmU6ICcxOScsXG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9ncmlkJyxcbiAgICAgICAgY2VsbFNpemU6IDQwLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gICAgICAgIGJvcmRlckNvbG9yOiAnYmxhY2snLFxuICAgICAgICBib3JkZXJXaWR0aDogMixcbiAgICB9LFxuICAgIHJvY2s6e1xuICAgICAgICBzaXplOiAyMCxcbiAgICAgICAgcGxheWVyMTogJ2dyZXknLFxuICAgICAgICBwbGF5ZXIyOiAnYmxhY2snLFxuICAgIH1cbn07XG5cbi8vIEluaXRpYWxpemUgYW5kIHJ1biB0aGUgZ2FtZVxudmFyIEdvR2FtZSA9IG5ldyBHYW1lKG9wdGlvbnMpO1xuR29HYW1lLnJ1bigpOyJdfQ==
