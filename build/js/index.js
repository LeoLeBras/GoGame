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
                    territory.findTerritory();
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

                        this.cache = 0;

                        // Test
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = territory.getBorders()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                                var rock = _step2.value;

                                var index = rock.lastIndexOf(';');
                                var x = parseInt(rock.substr(0, index));
                                var y = parseInt(rock.substring(index + 1));

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

                        // The territory is circled
                        if (this.cache == territory.getBorders().length) {

                            // Deubg
                            console.log('**');
                            console.log('Enemy territory circled !');
                            console.log(territory.get());

                            // Delete each rock
                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = territory.get()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                    var rockDied = _step3.value;

                                    // In the tab
                                    this.tab[rockDied] = 0;

                                    // On the interface
                                    var index = rockDied.lastIndexOf(';');
                                    this.x = parseInt(rockDied.substr(0, index)) * this.cellSize - 1 - this.rockSize / 2;
                                    this.y = parseInt(rockDied.substring(index + 1)) * this.cellSize - 1 - this.rockSize / 2;
                                    this.canvas.clearRect(this.x, this.y, this.rockSize + 2, this.rockSize + 2);
                                }
                            } catch (err) {
                                _didIteratorError3 = true;
                                _iteratorError3 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion3 && _iterator3['return']) {
                                        _iterator3['return']();
                                    }
                                } finally {
                                    if (_didIteratorError3) {
                                        throw _iteratorError3;
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
    }

    _createClass(Territory, [{
        key: 'findTerritory',
        value: function findTerritory() {

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
                    this.findTerritory();
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
                this.findTerritory();
            }
        }
    }, {
        key: 'get',

        /**
         * Return all the territory
         *
         * @return this.territory array
         */
        value: function get() {
            return this.territory.sort();
        }
    }, {
        key: 'getBorders',

        /**
         * Return borders of the territory
         *
         * @return this.territory array
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2J1aWxkZXIuanMiLCJEOi9Ecm9wYm94L1NpdGVzL3d3dy9Hb0dhbWUvc3JjL2pzL2FwcC9nYW1lcGxheS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2luZGV4LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvc2F2ZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL3Njb3JlLmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvdGVycml0b3J5LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9mYWtlX2EzMjUxMGQ3LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2dCTSxPQUFPOzs7Ozs7OztBQVFFLGFBUlQsT0FBTyxDQVFHLE9BQU8sRUFBQzs4QkFSbEIsT0FBTzs7QUFTTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUVuRCxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxD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QUksQ0FBQyxDQUFDLFVBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQ2pELElBQUksQ0FBQyxHQUFHLE9BQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFHLElBQUksSUFBSSxDQUFDLEtBQUssSUFDakQsSUFBSSxDQUFDLEdBQUcsTUFBSSxJQUFJLENBQUMsQ0FBQyxVQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUNqRCxJQUFJLENBQUMsR0FBRyxPQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQ3JEOzs7QUFHSSxvQkFBRyxJQUFJLENBQUMsR0FBRyxNQUFJLElBQUksQ0FBQyxDQUFDLFVBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUM7QUFDakQsd0JBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsNkJBQWMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDbkY7QUFDRCxvQkFBRyxJQUFJLENBQUMsR0FBRyxPQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUM7QUFDakQsd0JBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsNkJBQWMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztp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LENBQUM7U0FFdEM7OztXQW5JUSxTQUFTOzs7UUFBVCxTQUFTLEdBQVQsU0FBUzs7QUFzSXRCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsU0FBUyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzswQkN2SVYsZ0JBQWdCOzs7OztBQUdqQyxJQUFJLE9BQU8sR0FBRztBQUNWLFNBQUssRUFBRTtBQUNILGVBQU8sRUFBRSxhQUFhLEVBQ3pCO0FBQ0QsWUFBUSxFQUFFO0FBQ04sZUFBTyxFQUFFLHNCQUFzQixFQUNsQztBQUNELFFBQUksRUFBRTtBQUNGLFlBQUksRUFBRSxJQUFJO0FBQ1YsZUFBTyxFQUFFLGtCQUFrQjtBQUMzQixnQkFBUSxFQUFFLEVBQUU7QUFDWix1QkFBZSxFQUFFLE9BQU87QUFDeEIsbUJBQVcsRUFBRSxPQUFPO0FBQ3BCLG1CQUFXLEVBQUUsQ0FBQyxFQUNqQjtBQUNELFFBQUksRUFBQztBQUNELFlBQUksRUFBRSxFQUFFO0FBQ1IsZUFBTyxFQUFFLE1BQU07QUFDZixlQUFPLEVBQUUsT0FBTyxFQUNuQjtDQUNKLENBQUM7OztBQUdGLElBQUksTUFBTSxHQUFHLDRCQUFTLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIgLyoqXHJcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXHJcbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xyXG4gICogSEVUSUMgUDIwMTlcclxuICAqXHJcbiAgKiBCdWlsZGVyIG1vZHVsZVxyXG4gICpcclxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXHJcbiAgKlxyXG4gICogQ29weXJpZ2h0IDIwMTVcclxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4gICpcclxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XHJcbiAgKi9cclxuXHJcbmNsYXNzIEJ1aWxkZXJ7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSW5pdCBvcHRpb25zXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnNcclxuICAgICAqLyAgICAgXHJcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcclxuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcclxuICAgICAgICB0aGlzLmdyaWRib3JkZXJXaWR0aCA9IG9wdGlvbnNbJ2dyaWQnXS5ib3JkZXJXaWR0aDtcclxuXHJcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcclxuICAgICAgICB0aGlzLmdyaWRTaXplID0gKHBhcnNlSW50KHRoaXMuZ3JpZCkgKyAxKSAqIHRoaXMuY2VsbFNpemU7XHJcblxyXG4gICAgICAgIHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2dvYmFuJ10uZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkgPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkID0gU3ByaW50KG9wdGlvbnNbJ2dyaWQnXS5lbGVtZW50KTtcclxuXHJcbiAgICAgICAgdGhpcy5ncmlkQ2FudmFzID0gdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICB0aGlzLmdhbWVwbGF5Q2FudmFzID0gdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCdWlsZCB0aGUgZ29iYW5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGNzcyBzdHlsZSBvZiB0aGUgZ29iYW5cclxuICAgICAqLyAgXHJcbiAgICBidWlsZEdvYmFuKCl7XHJcbiAgICAgICAgdGhpcy4kZ29iYW4uY3NzKHtcclxuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXHJcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIHRoZSBnYW1lcGxheSBjYW52YXNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGNhbnZhc1xyXG4gICAgICovICBcclxuICAgIGJ1aWxkR2FtZXBsYXkoKXtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0ud2lkdGggPSB0aGlzLmdyaWRTaXplO1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS5oZWlnaHQgPSB0aGlzLmdyaWRTaXplO1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmNzcyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVpbGQgdGhlIGdyaWRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGNhbnZhcyB3aXRoIGEgZ3JpZCBkcmF3blxyXG4gICAgICovICBcclxuICAgIGJ1aWxkR3JpZCgpe1xyXG5cclxuICAgICAgICAvLyBTZXQgc2l6ZSBvZiBjYW52YXNcclxuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmNzcyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcclxuICAgICAgICB9KVxyXG5cclxuICAgICAgICAvLyBJbml0IHRoZSBjYW52YXNcclxuICAgICAgICB2YXIgYyA9IHRoaXMuZ3JpZENhbnZhcztcclxuXHJcbiAgICAgICAgLy8gRHJhdyBlYWNoIGxpbmVzIG9mIHRoZSBncmlkXHJcbiAgICAgICAgZm9yKHZhciB4ID0gMTsgeCA8PSB0aGlzLmdyaWQgOyB4Kyspe1xyXG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XHJcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XHJcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gdGhpcy5ncmlkYm9yZGVyV2lkdGg7XHJcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvcih2YXIgeSA9IDE7IHkgPD0gdGhpcy5ncmlkIDsgeSsrKXtcclxuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgYy5tb3ZlVG8odGhpcy5jZWxsU2l6ZSAqIHksIHRoaXMuY2VsbFNpemUpO1xyXG4gICAgICAgICAgICBjLmxpbmVUbyh0aGlzLmNlbGxTaXplICogeSwgdGhpcy5ncmlkU2l6ZSAtIHRoaXMuY2VsbFNpemUpO1xyXG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xyXG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVpbGQgYWxsIGVsZW1lbnRzXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIHJ1bigpe1xyXG4gICAgICAgIHRoaXMuYnVpbGRHb2JhbigpO1xyXG4gICAgICAgIHRoaXMuYnVpbGRHYW1lcGxheSgpO1xyXG4gICAgICAgIHRoaXMuYnVpbGRHcmlkKCk7XHJcbiAgICB9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEJ1aWxkZXI7IiwiIC8qKlxyXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxyXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcclxuICAqIEhFVElDIFAyMDE5XHJcbiAgKlxyXG4gICogR2FtZXBsYXkgbW9kdWxlXHJcbiAgKlxyXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcclxuICAqXHJcbiAgKiBDb3B5cmlnaHQgMjAxNVxyXG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXHJcbiAgKlxyXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcclxuICAqL1xyXG5cclxuaW1wb3J0IFRlcnJpdG9yeSBmcm9tIFwiLi90ZXJyaXRvcnkuanNcIjtcclxuXHJcbmNsYXNzIEdhbWVwbGF5e1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXQgcGFyYW1zXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnNcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XHJcblxyXG4gICAgICAgIHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2VsZW1lbnQnXSk7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRnb2Jhbi5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcclxuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xyXG5cclxuICAgICAgICB0aGlzLnJvY2tTaXplID0gb3B0aW9uc1sncm9jayddLnNpemU7XHJcbiAgICAgICAgdGhpcy5yb2NrUGxheWVyMSA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIxO1xyXG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcclxuXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSAxO1xyXG4gICAgICAgIHRoaXMuZW5lbXkgPSB0aGlzLnBsYXllcisrO1xyXG5cclxuICAgICAgICB0aGlzLnRhYiA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVycml0b3JpZXMgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gSW5pdGlhbHlzZSB0aGUgdGFiXHJcbiAgICAgICAgZm9yKHZhciB4ID0gMTsgeCA8PSB0aGlzLmdyaWQgOyB4Kyspe1xyXG4gICAgICAgICAgICBmb3IodmFyIHkgPSAxOyB5IDw9IHRoaXMuZ3JpZCA7IHkrKyl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt4fTske3l9YF0gPSAwO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBMaXN0ZW4gZXZlbnQgb24gdGhlIGdhbWVwbGF5IFxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBsaXN0ZW5uZXIoKXtcclxuXHJcbiAgICAgICAgLy8gVGhlIHBsYXllciBjbGljayBvbiB0aGUgZ29iYW4gdG8gcGxheVxyXG4gICAgICAgIFNwcmludCh0aGlzLiRnb2Jhbikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuY3JlYXRlKGUubGF5ZXJYLCBlLmxheWVyWSkpe1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBEZWJ1Z1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKmApO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbG9yID0gdGhpcy5yb2NrUGxheWVyMTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMucGxheWVyID09IDIpe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbG9yID0gdGhpcy5yb2NrUGxheWVyMjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBKb3VldXIgJHt0aGlzLnBsYXllcn0gKCR7Y29sb3J9KSBlbiAke3RoaXMueH07JHt0aGlzLnl9YCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXdyaXRlR29iYW4oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyID0gKCh0aGlzLnBsYXllcisrKSAlIDIpICsgMTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZW5lbXkgPSAoKHRoaXMuZW5lbXkrKykgJSAyKSArIDE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9LmJpbmQodGhpcykpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB3ZSBhcmUgaW4gYSBjYXNlIG9mIHN1aWNpZGVcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgY2hlY2tTdWljaWRlKCl7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHdlIGFyZSBpbiBhIGNhc2Ugb2YgS09cclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgY2hlY2tLTygpe1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSByb2NrXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtcyBjb29yZGluYXRlcyBjbGlja1xyXG4gICAgICogQHJldHVybiBhIHJvY2sgZHJhd24gb24gdGhlIGNhbnZhc1xyXG4gICAgICovICBcclxuICAgIGNyZWF0ZShsYXllclgsIGxheWVyWSl7XHJcblxyXG4gICAgICAgIC8vIFNldCBjb29yZGluYXRlcyBcclxuICAgICAgICB0aGlzLnggPSBNYXRoLmZsb29yKChsYXllclggKyB0aGlzLmNlbGxTaXplIC8gMikgLyB0aGlzLmNlbGxTaXplKTtcclxuICAgICAgICB0aGlzLnkgPSBNYXRoLmZsb29yKChsYXllclkgKyB0aGlzLmNlbGxTaXplIC8gMikgLyB0aGlzLmNlbGxTaXplKTtcclxuXHJcbiAgICAgICAgLy8gU2V0IGNvbG9yXHJcbiAgICAgICAgdmFyIGNvbG9yID0gdGhpcy5yb2NrUGxheWVyMTtcclxuICAgICAgICBpZih0aGlzLnBsYXllciA9PSAyKXtcclxuICAgICAgICAgICAgY29sb3IgPSB0aGlzLnJvY2tQbGF5ZXIyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ2hlY2sgaWYgd2UgYXJlIG9uIHRoZSBnb2JhblxyXG4gICAgICAgIGlmKDEgPD0gdGhpcy54ICYmIHRoaXMueCA8PSB0aGlzLmdyaWQgJiYgMSA8PSB0aGlzLnkgJiYgdGhpcy55IDw9IHRoaXMuZ3JpZCApe1xyXG5cclxuICAgICAgICAgICAgLy8gQ2hlY2sgaWYgdGhlIHBsYXllciBjYW4gcGxheSBhdCB0aGlzIHBsYWNlXHJcbiAgICAgICAgICAgIGlmKCF0aGlzLmNoZWNrU3VpY2lkZSgpICYmICF0aGlzLmNoZWNrS08oKSAmJiB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55fWBdID09IDApe1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIERyYXcgdGhlIHJvY2tcclxuICAgICAgICAgICAgICAgIHZhciBjID0gdGhpcy5jYW52YXM7XHJcbiAgICAgICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgYy5hcmModGhpcy54ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy55ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy5yb2NrU2l6ZSAvIDIsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICBjLmNsb3NlUGF0aCgpO1xyXG4gICAgICAgICAgICAgICAgYy5maWxsU3R5bGUgPSBjb2xvcjtcclxuICAgICAgICAgICAgICAgIGMuZmlsbCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNhdmUgaW4gdGhlIHRhYlxyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueX1gXSA9IHRoaXMucGxheWVyO1xyXG5cclxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXdyaXRlIGdvYmFuIHdpdGggdGhlIGxhc3QgYWN0aW9uIG9mIHRoZSBwbGF5ZXJcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgcmV3cml0ZUdvYmFuKCl7XHJcblxyXG4gICAgICAgIC8vIEluaXQgdGVycml0b3J5XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBbXTtcclxuXHJcbiAgICAgICAgLy8gQ2hlayBpZiB0aGVyZSBhcmUgZW5uZW1pZXMgYXJvdW5kIHRoZSBsYXN0IHJvY2sgcGxhY2VkXHJcbiAgICAgICAgaWYoXHJcbiAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgLSAxfWBdID09IHRoaXMuZW5lbXkgfHxcclxuICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSB8fFxyXG4gICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55ICsgMX1gXSA9PSB0aGlzLmVuZW15IHx8XHJcbiAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueCAtIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkpXHJcbiAgICAgICAge1xyXG5cclxuICAgICAgICAgICAgLy8gUmV0dXJuIHRoZSB0ZXJyaXRvcnkgb2YgdGhlIG5laWdoYm9ycyBcclxuICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueSAtIDF9YF0gPT0gdGhpcy5lbmVteSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRlcnJpdG9yeVsndG9wJ10gPSBuZXcgVGVycml0b3J5KHRoaXMudGFiLCB0aGlzLmVuZW15LCB0aGlzLngsIHRoaXMueSAtIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3RoaXMueCArIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXJyaXRvcnlbJ3JpZ2h0J10gPSBuZXcgVGVycml0b3J5KHRoaXMudGFiLCB0aGlzLmVuZW15LCB0aGlzLnggKyAxLCB0aGlzLnkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgKyAxfWBdID09IHRoaXMuZW5lbXkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXJyaXRvcnlbJ2JvdHRvbSddID0gbmV3IFRlcnJpdG9yeSh0aGlzLnRhYiwgdGhpcy5lbmVteSwgdGhpcy54LCB0aGlzLnkgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0aGlzLnRhYltgJHt0aGlzLnggLSAxfTske3RoaXMueX1gXSA9PSB0aGlzLmVuZW15KXtcclxuICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3J5WydsZWZ0J10gPSBuZXcgVGVycml0b3J5KHRoaXMudGFiLCB0aGlzLmVuZW15LCB0aGlzLnggLSAxLCB0aGlzLnkpO1xyXG4gICAgICAgICAgICB9IFxyXG5cclxuICAgICAgICAgICAgLy8gVGlueSB0ZXJyaXRvcmllcyAoZGVsZXRlIGJvdWJsb24pXHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy50ZXJyaXRvcmllcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgaW4gdGhpcy50ZXJyaXRvcnkpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlcnJpdG9yeSA9IHRoaXMudGVycml0b3J5W2ldO1xyXG4gICAgICAgICAgICAgICAgdGVycml0b3J5LmZpbmRUZXJyaXRvcnkoKTtcclxuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2FjaGUuaW5kZXhPZihKU09OLnN0cmluZ2lmeSh0ZXJyaXRvcnkuZ2V0KCkpKSA9PSAtMSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50ZXJyaXRvcmllcy5wdXNoKHRlcnJpdG9yeSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKEpTT04uc3RyaW5naWZ5KHRlcnJpdG9yeS5nZXQoKSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBWZXJpZmljYXRpb24gb2YgZW5jaXJjbGVtZW50IHRlcnJpdG9yaWVzXHJcbiAgICAgICAgICAgIGZvcihsZXQgdGVycml0b3J5IG9mIHRoaXMudGVycml0b3JpZXMpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZSA9IDA7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIFRlc3RcclxuICAgICAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiB0ZXJyaXRvcnkuZ2V0Qm9yZGVycygpKXtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSByb2NrLmxhc3RJbmRleE9mKCc7Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IHggPSBwYXJzZUludChyb2NrLnN1YnN0cigwLCBpbmRleCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB5ID0gcGFyc2VJbnQocm9jay5zdWJzdHJpbmcoaW5kZXggKyAxKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3h9OyR7eSAtIDF9YF0gIT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3ggKyAxfTske3l9YF0gIT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3h9OyR7eSArIDF9YF0gIT0gMCAmJlxyXG4gICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3ggLSAxfTske3l9YF0gIT0gMClcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUrKztcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVGhlIHRlcnJpdG9yeSBpcyBjaXJjbGVkXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmNhY2hlID09IHRlcnJpdG9yeS5nZXRCb3JkZXJzKCkubGVuZ3RoKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGV1YmdcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnKionKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRW5lbXkgdGVycml0b3J5IGNpcmNsZWQgIScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRlcnJpdG9yeS5nZXQoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBlYWNoIHJvY2tcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHJvY2tEaWVkIG9mIHRlcnJpdG9yeS5nZXQoKSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJbiB0aGUgdGFiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFiW3JvY2tEaWVkXSA9IDAgO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT24gdGhlIGludGVyZmFjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSByb2NrRGllZC5sYXN0SW5kZXhPZignOycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnggPSBwYXJzZUludChyb2NrRGllZC5zdWJzdHIoMCwgaW5kZXgpKSAqIHRoaXMuY2VsbFNpemUgLSAxIC0gdGhpcy5yb2NrU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSA9IHBhcnNlSW50KHJvY2tEaWVkLnN1YnN0cmluZyhpbmRleCArIDEpKSAqIHRoaXMuY2VsbFNpemUgLSAxIC0gdGhpcy5yb2NrU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmNsZWFyUmVjdCh0aGlzLngsdGhpcy55LHRoaXMucm9ja1NpemUgKyAyLCB0aGlzLnJvY2tTaXplICsgMik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lcGxheTsiLCIgLyoqXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gICogSEVUSUMgUDIwMTlcbiAgKiBcbiAgKiBJbmRleFxuICAqXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcbiAgKlxuICAqIENvcHlyaWdodCAyMDE1XG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICAqXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcbiAgKi9cblxuaW1wb3J0IEJ1aWxkZXIgZnJvbSBcIi4vYnVpbGRlci5qc1wiO1xuaW1wb3J0IEdhbWVwbGF5IGZyb20gXCIuL2dhbWVwbGF5LmpzXCI7XG5pbXBvcnQgU2F2ZSBmcm9tIFwiLi9zYXZlLmpzXCI7XG5pbXBvcnQgU2NvcmUgZnJvbSBcIi4vc2NvcmUuanNcIjtcblxuY2xhc3MgR2FtZXtcblxuICAgIC8qKlxuICAgICAqIEluaXQgb3B0aW9uc1xuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgICAqIEByZXR1cm4gXG4gICAgICovICAgICBcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuZ3JpZEJvcmRlcldpZHRoID0gb3B0aW9uc1snZ3JpZCddLmJvcmRlcldpZHRoO1xuXG4gICAgICAgIHRoaXMuJGdvYmFuID0gb3B0aW9uc1snZ29iYW4nXS5lbGVtZW50O1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkID0gb3B0aW9uc1snZ3JpZCddLmVsZW1lbnQ7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5ID0gb3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50O1xuXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIxID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBnYW1lXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHJ1bigpe1xuXG4gICAgICAgIC8vIEJ1aWxkZXJcbiAgICAgICAgdmFyIEdhbWVCdWlsZGVyID0gbmV3IEJ1aWxkZXIoe1xuICAgICAgICAgIGdvYmFuOiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuJGdvYmFuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnYW1lcGxheToge1xuICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9nYW1lcGxheVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ3JpZDoge1xuICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9ncmlkLFxuICAgICAgICAgICAgICBuYnJlOiB0aGlzLmdyaWQsXG4gICAgICAgICAgICAgIGNlbGxTaXplOiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICBib3JkZXJXaWR0aCA6IHRoaXMuZ3JpZEJvcmRlcldpZHRoLFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIEdhbWVCdWlsZGVyLnJ1bigpO1xuXG5cbiAgICAgICAgLy8gR2FtZXBsYXlcbiAgICAgICAgdmFyIEdhbWVHYW1lcGxheSA9IG5ldyBHYW1lcGxheSh7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9nYW1lcGxheSxcbiAgICAgICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICAgICAgICBuYnJlOiB0aGlzLmdyaWQsXG4gICAgICAgICAgICAgICAgY2VsbFNpemU6IHRoaXMuY2VsbFNpemVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb2NrOiB7XG4gICAgICAgICAgICAgICAgc2l6ZTogdGhpcy5yb2NrU2l6ZSxcbiAgICAgICAgICAgICAgICBwbGF5ZXIxOiB0aGlzLnJvY2tQbGF5ZXIxLFxuICAgICAgICAgICAgICAgIHBsYXllcjI6IHRoaXMucm9ja1BsYXllcjIsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBHYW1lR2FtZXBsYXkubGlzdGVubmVyKCk7XG5cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcblxuIiwiIC8qKlxyXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxyXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcclxuICAqIEhFVElDIFAyMDE5XHJcbiAgKlxyXG4gICogU2F2ZSBtb2R1bGVcclxuICAqXHJcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxyXG4gICpcclxuICAqIENvcHlyaWdodCAyMDE1XHJcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICAqXHJcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxyXG4gICovXHJcblxyXG5leHBvcnQgY2xhc3MgU2NvcmV7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLnNjb3JlID0gW107XHJcbiAgICB9XHJcblxyXG59IiwiIC8qKlxyXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxyXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcclxuICAqIEhFVElDIFAyMDE5XHJcbiAgKlxyXG4gICogU2NvcmUgbW9kdWxlXHJcbiAgKlxyXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcclxuICAqXHJcbiAgKiBDb3B5cmlnaHQgMjAxNVxyXG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXHJcbiAgKlxyXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcclxuICAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjb3Jle1xyXG5cclxuXHJcbn0iLCIgLyoqXHJcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXHJcbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xyXG4gICogSEVUSUMgUDIwMTlcclxuICAqXHJcbiAgKiBUZXJyaXRvcnkgbW9kdWxlXHJcbiAgKlxyXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcclxuICAqXHJcbiAgKiBDb3B5cmlnaHQgMjAxNVxyXG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXHJcbiAgKlxyXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcclxuICAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeXtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YWIsIGVuZW15LCB4LCB5KXtcclxuICAgICAgICB0aGlzLnRhYiA9IHRhYjtcclxuICAgICAgICB0aGlzLmVuZW15ID0gZW5lbXk7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuc3RhcnQgPSBgJHt0aGlzLnh9OyR7dGhpcy55fWA7XHJcbiAgICAgICAgdGhpcy5jb29yZGluYXRlO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcclxuICAgICAgICB0aGlzLmFyb3VuZCA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVycml0b3J5ID0gW107XHJcbiAgICAgICAgdGhpcy5ib3JkZXJUZXJyaXRvcnkgPSBbXTtcclxuICAgICAgICB0aGlzLmluZGV4R29CYWNrO1xyXG4gICAgICAgIHRoaXMubmV3Um9jayA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZmluZFRlcnJpdG9yeSgpe1xyXG5cclxuICAgICAgICAvLyBJbml0IGFyb3VuZCByb2Nrc1xyXG4gICAgICAgIHRoaXMuYXJvdW5kPSBbXTtcclxuXHJcbiAgICAgICAgLy8gU2F2ZVxyXG4gICAgICAgIGlmKHRoaXMubmV3Um9jayl7XHJcbiAgICAgICAgICAgIHRoaXMuY2FjaGVbYCR7dGhpcy54fTske3RoaXMueX1gXSA9ICdjaGVjayc7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kZXhHb0JhY2sgPSB0aGlzLnRlcnJpdG9yeS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHRoaXMudGVycml0b3J5LnB1c2goYCR7dGhpcy54fTske3RoaXMueX1gKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIFdlIGNoZWNrIHJvY2tzIGFyb3VuZFxyXG4gICAgICAgIGZvcih2YXIgaSA9IDE7IGkgPD0gNDsgaSsrKXtcclxuICAgICAgICAgICAgc3dpdGNoKGkpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueH07JHt0aGlzLnkgLSAxfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueCArIDF9OyR7dGhpcy55fWA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueH07JHt0aGlzLnkgKyAxfWA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueCAtIDF9OyR7dGhpcy55fWA7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICBpZih0aGlzLnRhYlt0aGlzLmNvb3JkaW5hdGVdID09IHRoaXMuZW5lbXkgJiYgdGhpcy5jYWNoZVt0aGlzLmNvb3JkaW5hdGVdICAhPSAnY2hlY2snKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJvdW5kLnB1c2godGhpcy5jb29yZGluYXRlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gSWYgbm8gZW5lbWllc1xyXG4gICAgICAgIGlmKHRoaXMuYXJvdW5kLmxlbmd0aCA9PSAwKXtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHdlIGNhbiBnbyBiYWNrIHRvIGZpbmQgbW9yZSBuZXcgcm9ja3NcclxuICAgICAgICAgICAgaWYoISh0aGlzLnN0YXJ0ID09IGAke3RoaXMueH07JHt0aGlzLnl9YCkpe1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFNhaWQgd2UgZ28gYmFja1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdSb2NrID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmluZGV4R29CYWNrID0gdGhpcy5pbmRleEdvQmFjayAtIDE7XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIC8vIFNldCBuZXcgY29vcmRpbmF0ZXMgZm9yIHRoZSBuZXh0IGp1bXBcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMudGVycml0b3J5W3RoaXMuaW5kZXhHb0JhY2tdLmxhc3RJbmRleE9mKCc7Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnggPSBwYXJzZUludCh0aGlzLnRlcnJpdG9yeVt0aGlzLmluZGV4R29CYWNrXS5zdWJzdHIoMCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IHBhcnNlSW50KHRoaXMudGVycml0b3J5W3RoaXMuaW5kZXhHb0JhY2tdLnN1YnN0cmluZyhpbmRleCArIDEpKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBKdW1wIGJ5IHJlY3Vyc2lvbiB0byBhbiBhbm90aGVyIHJvY2tcclxuICAgICAgICAgICAgICAgIHRoaXMuZmluZFRlcnJpdG9yeSgpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxzZXtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIG9uZSBlbmVteVxyXG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuYXJvdW5kLmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgbmV3IGNvb3JkaW5hdGVzIGZvciB0aGUgbmV4dCBqdW1wXHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuYXJvdW5kW3RoaXMucmFuZG9tXS5sYXN0SW5kZXhPZignOycpO1xyXG4gICAgICAgICAgICB0aGlzLnggPSBwYXJzZUludCh0aGlzLmFyb3VuZFt0aGlzLnJhbmRvbV0uc3Vic3RyKDAsIGluZGV4KSk7XHJcbiAgICAgICAgICAgIHRoaXMueSA9IHBhcnNlSW50KHRoaXMuYXJvdW5kW3RoaXMucmFuZG9tXS5zdWJzdHJpbmcoaW5kZXggKyAxKSk7XHJcblxyXG4gICAgICAgICAgICAvLyBKdW1wIGJ5IHJlY3Vyc2lvbiB0byBhbiBhbm90aGVyIHJvY2tcclxuICAgICAgICAgICAgdGhpcy5uZXdSb2NrID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5maW5kVGVycml0b3J5KCk7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gYWxsIHRoZSB0ZXJyaXRvcnlcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMudGVycml0b3J5IGFycmF5XHJcbiAgICAgKi8gXHJcbiAgICBnZXQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy50ZXJyaXRvcnkuc29ydCgpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBib3JkZXJzIG9mIHRoZSB0ZXJyaXRvcnlcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMudGVycml0b3J5IGFycmF5XHJcbiAgICAgKi8gXHJcbiAgICBnZXRCb3JkZXJzKCl7XHJcblxyXG4gICAgICAgIGlmKHRoaXMuYm9yZGVyVGVycml0b3J5Lmxlbmd0aCA9PSAwKXtcclxuICAgICAgICAgICAgZm9yKHZhciBpdGVtIG9mIHRoaXMudGVycml0b3J5KXtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgY29vcmRpbmF0ZXMgb2YgdGhlIGN1cnJlbnQgcm9ja1xyXG4gICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gaXRlbS5sYXN0SW5kZXhPZignOycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gcGFyc2VJbnQoaXRlbS5zdWJzdHIoMCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMueSA9IHBhcnNlSW50KGl0ZW0uc3Vic3RyaW5nKGluZGV4ICsgMSkpO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSByb2NrIGlzIG5vdCB0b3RhbGx5IGFyb3VuZCB0byBrbm93IGlmIGl0J3Mgb24gdGhlIGJvcmRlclxyXG4gICAgICAgICAgICAgICAgaWYoISh0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55IC0gMX1gXSA9PSB0aGlzLmVuZW15ICYmXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSAmJlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgKyAxfWBdID09IHRoaXMuZW5lbXkgJiZcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnggLSAxfTske3RoaXMueX1gXSA9PSB0aGlzLmVuZW15KSl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ib3JkZXJUZXJyaXRvcnkucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVyVGVycml0b3J5LnNvcnQoKTtcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGVycml0b3J5OyAiLCIvKipcbiAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cbiAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gKiBIRVRJQyBQMjAxOVxuICpcbiAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZWxlcilcbiAqXG4gKiBDb3B5cmlnaHQgMjAxNVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKlxuICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcbiAqL1xuXG4vLyBJbXBvcnQgdGhlIGFwcFxuaW1wb3J0IEdhbWUgZnJvbSBcIi4vYXBwL2luZGV4LmpzXCI7XG5cbi8vIFNldCBvcHRpb25zXG52YXIgb3B0aW9ucyA9IHtcbiAgICBnb2Jhbjoge1xuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW4nLFxuICAgIH0sXG4gICAgZ2FtZXBsYXk6IHtcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuX2dhbWVwbGF5JyxcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgICAgbmJyZTogJzE5JyxcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuX2dyaWQnLFxuICAgICAgICBjZWxsU2l6ZTogNDAsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICdibGFjaycsXG4gICAgICAgIGJvcmRlcldpZHRoOiAyLFxuICAgIH0sXG4gICAgcm9jazp7XG4gICAgICAgIHNpemU6IDIwLFxuICAgICAgICBwbGF5ZXIxOiAnZ3JleScsXG4gICAgICAgIHBsYXllcjI6ICdibGFjaycsXG4gICAgfVxufTtcblxuLy8gSW5pdGlhbGl6ZSBhbmQgcnVuIHRoZSBnYW1lXG52YXIgR29HYW1lID0gbmV3IEdhbWUob3B0aW9ucyk7XG5Hb0dhbWUucnVuKCk7Il19
