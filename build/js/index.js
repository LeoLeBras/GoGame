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

                // Tiny territories
                this.cache = [];
                this.territories = [];
                this.territories['getBorders'] = [];
                this.territories['get'] = [];
                for (var i in this.territory) {
                    var territoryCache = this.territory[i].findBorderTerritory();
                    if (this.cache.indexOf(JSON.stringify(territoryCache)) == -1) {
                        this.territories['getBorders'].push(territoryCache);
                        this.cache.push(JSON.stringify(territoryCache));
                    }
                }

                // Verification of encirclement territories
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = this.territories['getBorders'][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var territory = _step.value;

                        this.cache = 0;

                        // Test
                        var _iteratorNormalCompletion2 = true;
                        var _didIteratorError2 = false;
                        var _iteratorError2 = undefined;

                        try {
                            for (var _iterator2 = territory[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
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
                        if (this.cache == territory.length) {

                            // Deubg
                            console.log('**');
                            console.log('Enemy territory circled !');
                            console.log(territory);

                            // Delete each rock
                            var _iteratorNormalCompletion3 = true;
                            var _didIteratorError3 = false;
                            var _iteratorError3 = undefined;

                            try {
                                for (var _iterator3 = territory[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
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
        key: 'findAllTerritory',
        value: function findAllTerritory() {
            this.findTerritory();
            return this.territory;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2J1aWxkZXIuanMiLCJEOi9Ecm9wYm94L1NpdGVzL3d3dy9Hb0dhbWUvc3JjL2pzL2FwcC9nYW1lcGxheS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2luZGV4LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvc2F2ZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL3Njb3JlLmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9hcHAvdGVycml0b3J5LmpzIiwiRDovRHJvcGJveC9TaXRlcy93d3cvR29HYW1lL3NyYy9qcy9mYWtlXzlhOGIxNGM2LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztJQ2dCTSxPQUFPOzs7Ozs7OztBQVFFLGFBUlQsT0FBTyxDQVFHLE9BQU8sRUFBQzs4QkFSbEIsT0FBTzs7QUFTTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUVuRCxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxD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QUksQ0FBQyxDQUFDLFVBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLElBQ2pELElBQUksQ0FBQyxHQUFHLE9BQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFHLElBQUksSUFBSSxDQUFDLEtBQUssSUFDakQsSUFBSSxDQUFDLEdBQUcsTUFBSSxJQUFJLENBQUMsQ0FBQyxVQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUcsSUFBSSxJQUFJLENBQUMsS0FBSyxJQUNqRCxJQUFJLENBQUMsR0FBRyxPQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQ3JEOzs7QUFHSSxvQkFBRyxJQUFJLENBQUMsR0FBRyxNQUFJLElBQUksQ0FBQyxDQUFDLFVBQUksSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUEsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUM7QUFDakQsd0JBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsNkJBQWMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztpQkFDbkY7QUFDRCxvQkFBRyxJQUFJLENBQUMsR0FBRyxPQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFBLFNBQUksSUFBSSxDQUFDLENBQUMsQ0FBRyxJQUFJLElBQUksQ0FBQyxLQUFLLEVBQUM7QUFDakQsd0JBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLEdBQUcsNkJBQWMsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztp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QUU7QUFDRixZQUFJLEVBQUUsSUFBSTtBQUNWLGVBQU8sRUFBRSxrQkFBa0I7QUFDM0IsZ0JBQVEsRUFBRSxFQUFFO0FBQ1osdUJBQWUsRUFBRSxPQUFPO0FBQ3hCLG1CQUFXLEVBQUUsT0FBTztBQUNwQixtQkFBVyxFQUFFLENBQUMsRUFDakI7QUFDRCxRQUFJLEVBQUM7QUFDRCxZQUFJLEVBQUUsRUFBRTtBQUNSLGVBQU8sRUFBRSxNQUFNO0FBQ2YsZUFBTyxFQUFFLE9BQU8sRUFDbkI7Q0FDSixDQUFDOzs7QUFHRixJQUFJLE1BQU0sR0FBRyw0QkFBUyxPQUFPLENBQUMsQ0FBQztBQUMvQixNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiIC8qKlxyXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxyXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcclxuICAqIEhFVElDIFAyMDE5XHJcbiAgKlxyXG4gICogQnVpbGRlciBtb2R1bGVcclxuICAqXHJcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxyXG4gICpcclxuICAqIENvcHlyaWdodCAyMDE1XHJcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICAqXHJcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxyXG4gICovXHJcblxyXG5jbGFzcyBCdWlsZGVye1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEluaXQgb3B0aW9uc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBhcnJheSBvcHRpb25zXHJcbiAgICAgKi8gICAgIFxyXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyl7XHJcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XHJcbiAgICAgICAgdGhpcy5ncmlkYm9yZGVyV2lkdGggPSBvcHRpb25zWydncmlkJ10uYm9yZGVyV2lkdGg7XHJcblxyXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XHJcbiAgICAgICAgdGhpcy5ncmlkU2l6ZSA9IChwYXJzZUludCh0aGlzLmdyaWQpICsgMSkgKiB0aGlzLmNlbGxTaXplO1xyXG5cclxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydnb2JhbiddLmVsZW1lbnQpO1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5ID0gU3ByaW50KG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudCk7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZCA9IFNwcmludChvcHRpb25zWydncmlkJ10uZWxlbWVudCk7XHJcblxyXG4gICAgICAgIHRoaXMuZ3JpZENhbnZhcyA9IHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdGhpcy5nYW1lcGxheUNhbnZhcyA9IHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQnVpbGQgdGhlIGdvYmFuXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBjc3Mgc3R5bGUgb2YgdGhlIGdvYmFuXHJcbiAgICAgKi8gIFxyXG4gICAgYnVpbGRHb2Jhbigpe1xyXG4gICAgICAgIHRoaXMuJGdvYmFuLmNzcyh7XHJcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxyXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemUsXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBCdWlsZCB0aGUgZ2FtZXBsYXkgY2FudmFzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBjYW52YXNcclxuICAgICAqLyAgXHJcbiAgICBidWlsZEdhbWVwbGF5KCl7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcclxuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5jc3Moe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIHRoZSBncmlkXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBjYW52YXMgd2l0aCBhIGdyaWQgZHJhd25cclxuICAgICAqLyAgXHJcbiAgICBidWlsZEdyaWQoKXtcclxuXHJcbiAgICAgICAgLy8gU2V0IHNpemUgb2YgY2FudmFzXHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0ud2lkdGggPSB0aGlzLmdyaWRTaXplO1xyXG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLmhlaWdodCA9IHRoaXMuZ3JpZFNpemU7XHJcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5jc3Moe1xyXG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcclxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgLy8gSW5pdCB0aGUgY2FudmFzXHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLmdyaWRDYW52YXM7XHJcblxyXG4gICAgICAgIC8vIERyYXcgZWFjaCBsaW5lcyBvZiB0aGUgZ3JpZFxyXG4gICAgICAgIGZvcih2YXIgeCA9IDE7IHggPD0gdGhpcy5ncmlkIDsgeCsrKXtcclxuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgYy5tb3ZlVG8odGhpcy5jZWxsU2l6ZSwgdGhpcy5jZWxsU2l6ZSAqIHgpO1xyXG4gICAgICAgICAgICBjLmxpbmVUbyh0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSwgdGhpcy5jZWxsU2l6ZSAqIHgpO1xyXG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xyXG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IodmFyIHkgPSAxOyB5IDw9IHRoaXMuZ3JpZCA7IHkrKyl7XHJcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgICAgIGMubW92ZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmNlbGxTaXplKTtcclxuICAgICAgICAgICAgYy5saW5lVG8odGhpcy5jZWxsU2l6ZSAqIHksIHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplKTtcclxuICAgICAgICAgICAgYy5saW5lV2lkdGggPSB0aGlzLmdyaWRib3JkZXJXaWR0aDtcclxuICAgICAgICAgICAgYy5zdHJva2UoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEJ1aWxkIGFsbCBlbGVtZW50c1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBydW4oKXtcclxuICAgICAgICB0aGlzLmJ1aWxkR29iYW4oKTtcclxuICAgICAgICB0aGlzLmJ1aWxkR2FtZXBsYXkoKTtcclxuICAgICAgICB0aGlzLmJ1aWxkR3JpZCgpO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBCdWlsZGVyOyIsIiAvKipcclxuICAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cclxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXHJcbiAgKiBIRVRJQyBQMjAxOVxyXG4gICpcclxuICAqIEdhbWVwbGF5IG1vZHVsZVxyXG4gICpcclxuICAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZXIpXHJcbiAgKlxyXG4gICogQ29weXJpZ2h0IDIwMTVcclxuICAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxyXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxyXG4gICpcclxuICAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XHJcbiAgKi9cclxuXHJcbmltcG9ydCBUZXJyaXRvcnkgZnJvbSBcIi4vdGVycml0b3J5LmpzXCI7XHJcblxyXG5jbGFzcyBHYW1lcGxheXtcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBJbml0IHBhcmFtc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBhcnJheSBvcHRpb25zXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpe1xyXG5cclxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydlbGVtZW50J10pO1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kZ29iYW4uZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XHJcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcclxuXHJcbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xyXG4gICAgICAgIHRoaXMucm9ja1BsYXllcjEgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMTtcclxuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIyID0gb3B0aW9uc1sncm9jayddLnBsYXllcjI7XHJcblxyXG4gICAgICAgIHRoaXMucGxheWVyID0gMTtcclxuICAgICAgICB0aGlzLmVuZW15ID0gdGhpcy5wbGF5ZXIrKztcclxuXHJcbiAgICAgICAgdGhpcy50YWIgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcnJpdG9yaWVzID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBbXTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gW107XHJcblxyXG4gICAgICAgIC8vIEluaXRpYWx5c2UgdGhlIHRhYlxyXG4gICAgICAgIGZvcih2YXIgeCA9IDE7IHggPD0gdGhpcy5ncmlkIDsgeCsrKXtcclxuICAgICAgICAgICAgZm9yKHZhciB5ID0gMTsgeSA8PSB0aGlzLmdyaWQgOyB5Kyspe1xyXG4gICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7eH07JHt5fWBdID0gMDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTGlzdGVuIGV2ZW50IG9uIHRoZSBnYW1lcGxheSBcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgbGlzdGVubmVyKCl7XHJcblxyXG4gICAgICAgIC8vIFRoZSBwbGF5ZXIgY2xpY2sgb24gdGhlIGdvYmFuIHRvIHBsYXlcclxuICAgICAgICBTcHJpbnQodGhpcy4kZ29iYW4pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICBpZih0aGlzLmNyZWF0ZShlLmxheWVyWCwgZS5sYXllclkpKXtcclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgLy8gRGVidWdcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipgKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb2xvciA9IHRoaXMucm9ja1BsYXllcjE7XHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLnBsYXllciA9PSAyKXtcclxuICAgICAgICAgICAgICAgICAgICBjb2xvciA9IHRoaXMucm9ja1BsYXllcjI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgSm91ZXVyICR7dGhpcy5wbGF5ZXJ9ICgke2NvbG9yfSkgZW4gJHt0aGlzLnh9OyR7dGhpcy55fWApO1xyXG5cclxuICAgICAgICAgICAgICAgIHRoaXMucmV3cml0ZUdvYmFuKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllciA9ICgodGhpcy5wbGF5ZXIrKykgJSAyKSArIDE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVuZW15ID0gKCh0aGlzLmVuZW15KyspICUgMikgKyAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgd2UgYXJlIGluIGEgY2FzZSBvZiBzdWljaWRlXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGNoZWNrU3VpY2lkZSgpe1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB3ZSBhcmUgaW4gYSBjYXNlIG9mIEtPXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGNoZWNrS08oKXtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbXMgY29vcmRpbmF0ZXMgY2xpY2tcclxuICAgICAqIEByZXR1cm4gYSByb2NrIGRyYXduIG9uIHRoZSBjYW52YXNcclxuICAgICAqLyAgXHJcbiAgICBjcmVhdGUobGF5ZXJYLCBsYXllclkpe1xyXG5cclxuICAgICAgICAvLyBTZXQgY29vcmRpbmF0ZXMgXHJcbiAgICAgICAgdGhpcy54ID0gTWF0aC5mbG9vcigobGF5ZXJYICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XHJcbiAgICAgICAgdGhpcy55ID0gTWF0aC5mbG9vcigobGF5ZXJZICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XHJcblxyXG4gICAgICAgIC8vIFNldCBjb2xvclxyXG4gICAgICAgIHZhciBjb2xvciA9IHRoaXMucm9ja1BsYXllcjE7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5ZXIgPT0gMil7XHJcbiAgICAgICAgICAgIGNvbG9yID0gdGhpcy5yb2NrUGxheWVyMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENoZWNrIGlmIHdlIGFyZSBvbiB0aGUgZ29iYW5cclxuICAgICAgICBpZigxIDw9IHRoaXMueCAmJiB0aGlzLnggPD0gdGhpcy5ncmlkICYmIDEgPD0gdGhpcy55ICYmIHRoaXMueSA8PSB0aGlzLmdyaWQgKXtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSBwbGF5ZXIgY2FuIHBsYXkgYXQgdGhpcyBwbGFjZVxyXG4gICAgICAgICAgICBpZighdGhpcy5jaGVja1N1aWNpZGUoKSAmJiAhdGhpcy5jaGVja0tPKCkgJiYgdGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueX1gXSA9PSAwKXtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBEcmF3IHRoZSByb2NrXHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IHRoaXMuY2FudmFzO1xyXG4gICAgICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGMuYXJjKHRoaXMueCAqIHRoaXMuY2VsbFNpemUsIHRoaXMueSAqIHRoaXMuY2VsbFNpemUsIHRoaXMucm9ja1NpemUgLyAyLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgYy5jbG9zZVBhdGgoKTtcclxuICAgICAgICAgICAgICAgIGMuZmlsbFN0eWxlID0gY29sb3I7XHJcbiAgICAgICAgICAgICAgICBjLmZpbGwoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTYXZlIGluIHRoZSB0YWJcclxuICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnl9YF0gPSB0aGlzLnBsYXllcjtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV3cml0ZSBnb2JhbiB3aXRoIHRoZSBsYXN0IGFjdGlvbiBvZiB0aGUgcGxheWVyXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIHJld3JpdGVHb2Jhbigpe1xyXG5cclxuICAgICAgICAvLyBJbml0IHRlcnJpdG9yeVxyXG4gICAgICAgIHRoaXMudGVycml0b3J5ID0gW107XHJcblxyXG4gICAgICAgIC8vIENoZWsgaWYgdGhlcmUgYXJlIGVubmVtaWVzIGFyb3VuZCB0aGUgbGFzdCByb2NrIHBsYWNlZFxyXG4gICAgICAgIGlmKFxyXG4gICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55IC0gMX1gXSA9PSB0aGlzLmVuZW15IHx8XHJcbiAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueCArIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkgfHxcclxuICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueSArIDF9YF0gPT0gdGhpcy5lbmVteSB8fFxyXG4gICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnggLSAxfTske3RoaXMueX1gXSA9PSB0aGlzLmVuZW15KVxyXG4gICAgICAgIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFJldHVybiB0aGUgdGVycml0b3J5IG9mIHRoZSBuZWlnaGJvcnMgXHJcbiAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgLSAxfWBdID09IHRoaXMuZW5lbXkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy50ZXJyaXRvcnlbJ3RvcCddID0gbmV3IFRlcnJpdG9yeSh0aGlzLnRhYiwgdGhpcy5lbmVteSwgdGhpcy54LCB0aGlzLnkgLSAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0aGlzLnRhYltgJHt0aGlzLnggKyAxfTske3RoaXMueX1gXSA9PSB0aGlzLmVuZW15KXtcclxuICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3J5WydyaWdodCddID0gbmV3IFRlcnJpdG9yeSh0aGlzLnRhYiwgdGhpcy5lbmVteSwgdGhpcy54ICsgMSwgdGhpcy55KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZih0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55ICsgMX1gXSA9PSB0aGlzLmVuZW15KXtcclxuICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3J5Wydib3R0b20nXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCwgdGhpcy55ICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7dGhpcy54IC0gMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRlcnJpdG9yeVsnbGVmdCddID0gbmV3IFRlcnJpdG9yeSh0aGlzLnRhYiwgdGhpcy5lbmVteSwgdGhpcy54IC0gMSwgdGhpcy55KTtcclxuICAgICAgICAgICAgfSBcclxuXHJcbiAgICAgICAgICAgIC8vIFRpbnkgdGVycml0b3JpZXNcclxuICAgICAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnRlcnJpdG9yaWVzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudGVycml0b3JpZXNbJ2dldEJvcmRlcnMnXSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnRlcnJpdG9yaWVzWydnZXQnXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgaW4gdGhpcy50ZXJyaXRvcnkpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHRlcnJpdG9yeUNhY2hlID0gdGhpcy50ZXJyaXRvcnlbaV0uZmluZEJvcmRlclRlcnJpdG9yeSgpO1xyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbmRleE9mKEpTT04uc3RyaW5naWZ5KHRlcnJpdG9yeUNhY2hlKSkgPT0gLTEpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3JpZXNbJ2dldEJvcmRlcnMnXS5wdXNoKHRlcnJpdG9yeUNhY2hlKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2goSlNPTi5zdHJpbmdpZnkodGVycml0b3J5Q2FjaGUpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gVmVyaWZpY2F0aW9uIG9mIGVuY2lyY2xlbWVudCB0ZXJyaXRvcmllc1xyXG4gICAgICAgICAgICBmb3IobGV0IHRlcnJpdG9yeSBvZiB0aGlzLnRlcnJpdG9yaWVzWydnZXRCb3JkZXJzJ10pe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWNoZSA9IDA7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVGVzdFxyXG4gICAgICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIHRlcnJpdG9yeSl7XHJcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZGV4ID0gcm9jay5sYXN0SW5kZXhPZignOycpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxldCB4ID0gcGFyc2VJbnQocm9jay5zdWJzdHIoMCwgaW5kZXgpKTtcclxuICAgICAgICAgICAgICAgICAgICBsZXQgeSA9IHBhcnNlSW50KHJvY2suc3Vic3RyaW5nKGluZGV4ICsgMSkpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRhYltgJHt4fTske3kgLSAxfWBdICE9IDAgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt4ICsgMX07JHt5fWBdICE9IDAgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt4fTske3kgKyAxfWBdICE9IDAgJiZcclxuICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt4IC0gMX07JHt5fWBdICE9IDApXHJcbiAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlKys7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRoZSB0ZXJyaXRvcnkgaXMgY2lyY2xlZFxyXG4gICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZSA9PSB0ZXJyaXRvcnkubGVuZ3RoKXtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRGV1YmdcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnKionKTtcclxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRW5lbXkgdGVycml0b3J5IGNpcmNsZWQgIScpO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHRlcnJpdG9yeSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIERlbGV0ZSBlYWNoIHJvY2tcclxuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHJvY2tEaWVkIG9mIHRlcnJpdG9yeSl7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBJbiB0aGUgdGFiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudGFiW3JvY2tEaWVkXSA9IDAgO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT24gdGhlIGludGVyZmFjZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgaW5kZXggPSByb2NrRGllZC5sYXN0SW5kZXhPZignOycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnggPSBwYXJzZUludChyb2NrRGllZC5zdWJzdHIoMCwgaW5kZXgpKSAqIHRoaXMuY2VsbFNpemUgLSAxIC0gdGhpcy5yb2NrU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMueSA9IHBhcnNlSW50KHJvY2tEaWVkLnN1YnN0cmluZyhpbmRleCArIDEpKSAqIHRoaXMuY2VsbFNpemUgLSAxIC0gdGhpcy5yb2NrU2l6ZSAvIDI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmNsZWFyUmVjdCh0aGlzLngsdGhpcy55LHRoaXMucm9ja1NpemUgKyAyLCB0aGlzLnJvY2tTaXplICsgMik7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBHYW1lcGxheTsiLCIgLyoqXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EgZXQgTMOpbyBMZSBCcmFzXG4gICogSEVUSUMgUDIwMTlcbiAgKiBcbiAgKiBJbmRleFxuICAqXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcbiAgKlxuICAqIENvcHlyaWdodCAyMDE1XG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICAqXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcbiAgKi9cblxuaW1wb3J0IEJ1aWxkZXIgZnJvbSBcIi4vYnVpbGRlci5qc1wiO1xuaW1wb3J0IEdhbWVwbGF5IGZyb20gXCIuL2dhbWVwbGF5LmpzXCI7XG5pbXBvcnQgU2F2ZSBmcm9tIFwiLi9zYXZlLmpzXCI7XG5pbXBvcnQgU2NvcmUgZnJvbSBcIi4vc2NvcmUuanNcIjtcblxuY2xhc3MgR2FtZXtcblxuICAgIC8qKlxuICAgICAqIEluaXQgb3B0aW9uc1xuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnMgKG9wdGlvbmFsKVxuICAgICAqIEByZXR1cm4gXG4gICAgICovICAgICBcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKXtcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuZ3JpZEJvcmRlcldpZHRoID0gb3B0aW9uc1snZ3JpZCddLmJvcmRlcldpZHRoO1xuXG4gICAgICAgIHRoaXMuJGdvYmFuID0gb3B0aW9uc1snZ29iYW4nXS5lbGVtZW50O1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkID0gb3B0aW9uc1snZ3JpZCddLmVsZW1lbnQ7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5ID0gb3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50O1xuXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIxID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBnYW1lXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHJ1bigpe1xuXG4gICAgICAgIC8vIEJ1aWxkZXJcbiAgICAgICAgdmFyIEdhbWVCdWlsZGVyID0gbmV3IEJ1aWxkZXIoe1xuICAgICAgICAgIGdvYmFuOiB7XG4gICAgICAgICAgICAgIGVsZW1lbnQ6IHRoaXMuJGdvYmFuXG4gICAgICAgICAgfSxcbiAgICAgICAgICBnYW1lcGxheToge1xuICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9nYW1lcGxheVxuICAgICAgICAgIH0sXG4gICAgICAgICAgZ3JpZDoge1xuICAgICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9ncmlkLFxuICAgICAgICAgICAgICBuYnJlOiB0aGlzLmdyaWQsXG4gICAgICAgICAgICAgIGNlbGxTaXplOiB0aGlzLmNlbGxTaXplLFxuICAgICAgICAgICAgICBib3JkZXJXaWR0aCA6IHRoaXMuZ3JpZEJvcmRlcldpZHRoLFxuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIEdhbWVCdWlsZGVyLnJ1bigpO1xuXG5cbiAgICAgICAgLy8gR2FtZXBsYXlcbiAgICAgICAgdmFyIEdhbWVHYW1lcGxheSA9IG5ldyBHYW1lcGxheSh7XG4gICAgICAgICAgICBlbGVtZW50OiB0aGlzLiRnb2Jhbl9nYW1lcGxheSxcbiAgICAgICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICAgICAgICBuYnJlOiB0aGlzLmdyaWQsXG4gICAgICAgICAgICAgICAgY2VsbFNpemU6IHRoaXMuY2VsbFNpemVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByb2NrOiB7XG4gICAgICAgICAgICAgICAgc2l6ZTogdGhpcy5yb2NrU2l6ZSxcbiAgICAgICAgICAgICAgICBwbGF5ZXIxOiB0aGlzLnJvY2tQbGF5ZXIxLFxuICAgICAgICAgICAgICAgIHBsYXllcjI6IHRoaXMucm9ja1BsYXllcjIsXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBHYW1lR2FtZXBsYXkubGlzdGVubmVyKCk7XG5cbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcblxuIiwiIC8qKlxyXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxyXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcclxuICAqIEhFVElDIFAyMDE5XHJcbiAgKlxyXG4gICogU2F2ZSBtb2R1bGVcclxuICAqXHJcbiAgKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVyKVxyXG4gICpcclxuICAqIENvcHlyaWdodCAyMDE1XHJcbiAgKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcclxuICAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcclxuICAqXHJcbiAgKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxyXG4gICovXHJcblxyXG5leHBvcnQgY2xhc3MgU2NvcmV7XHJcblxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLnNjb3JlID0gW107XHJcbiAgICB9XHJcblxyXG59IiwiIC8qKlxyXG4gICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxyXG4gICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSBldCBMw6lvIExlIEJyYXNcclxuICAqIEhFVElDIFAyMDE5XHJcbiAgKlxyXG4gICogU2NvcmUgbW9kdWxlXHJcbiAgKlxyXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcclxuICAqXHJcbiAgKiBDb3B5cmlnaHQgMjAxNVxyXG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXHJcbiAgKlxyXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcclxuICAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFNjb3Jle1xyXG5cclxuXHJcbn0iLCIgLyoqXHJcbiAgKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXHJcbiAgKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xyXG4gICogSEVUSUMgUDIwMTlcclxuICAqXHJcbiAgKiBUZXJyaXRvcnkgbW9kdWxlXHJcbiAgKlxyXG4gICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlcilcclxuICAqXHJcbiAgKiBDb3B5cmlnaHQgMjAxNVxyXG4gICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXHJcbiAgKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXHJcbiAgKlxyXG4gICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcclxuICAqL1xyXG5cclxuZXhwb3J0IGNsYXNzIFRlcnJpdG9yeXtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcih0YWIsIGVuZW15LCB4LCB5KXtcclxuICAgICAgICB0aGlzLnRhYiA9IHRhYjtcclxuICAgICAgICB0aGlzLmVuZW15ID0gZW5lbXk7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuc3RhcnQgPSBgJHt0aGlzLnh9OyR7dGhpcy55fWA7XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xyXG4gICAgICAgIHRoaXMuYXJvdW5kID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBbXTtcclxuICAgICAgICB0aGlzLmJvcmRlclRlcnJpdG9yeSA9IFtdO1xyXG4gICAgICAgIHRoaXMuaW5kZXhHb0JhY2s7XHJcbiAgICAgICAgdGhpcy5uZXdSb2NrID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kVGVycml0b3J5KCl7XHJcblxyXG4gICAgICAgIC8vIEluaXQgYXJvdW5kIHJvY2tzXHJcbiAgICAgICAgdGhpcy5hcm91bmQ9IFtdO1xyXG5cclxuICAgICAgICAvLyBTYXZlXHJcbiAgICAgICAgaWYodGhpcy5uZXdSb2NrKXtcclxuICAgICAgICAgICAgdGhpcy5jYWNoZVtgJHt0aGlzLnh9OyR7dGhpcy55fWBdID0gJ2NoZWNrJztcclxuICAgICAgICAgICAgdGhpcy5pbmRleEdvQmFjayA9IHRoaXMudGVycml0b3J5Lmxlbmd0aDtcclxuICAgICAgICAgICAgdGhpcy50ZXJyaXRvcnkucHVzaChgJHt0aGlzLnh9OyR7dGhpcy55fWApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gV2UgY2hlY2sgcm9ja3MgYXJvdW5kXHJcbiAgICAgICAgZm9yKHZhciBpID0gMTsgaSA8PSA0OyBpKyspe1xyXG4gICAgICAgICAgICBzd2l0Y2goaSl7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueSAtIDF9YF0gPT0gdGhpcy5lbmVteSAmJiB0aGlzLmNhY2hlW2Ake3RoaXMueH07JHt0aGlzLnkgLSAxfWBdICAhPSAnY2hlY2snKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcm91bmQucHVzaChgJHt0aGlzLnh9OyR7dGhpcy55IC0gMX1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRoaXMudGFiW2Ake3RoaXMueCArIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkgJiYgdGhpcy5jYWNoZVtgJHt0aGlzLnggKyAxfTske3RoaXMueX1gXSAgIT0gJ2NoZWNrJyl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuYXJvdW5kLnB1c2goYCR7dGhpcy54ICsgMX07JHt0aGlzLnl9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICBpZih0aGlzLnRhYltgJHt0aGlzLnh9OyR7dGhpcy55ICsgMX1gXSA9PSB0aGlzLmVuZW15ICYmIHRoaXMuY2FjaGVbYCR7dGhpcy54fTske3RoaXMueSArIDF9YF0gICE9ICdjaGVjaycpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmFyb3VuZC5wdXNoKGAke3RoaXMueH07JHt0aGlzLnkgKyAxfWApO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7dGhpcy54IC0gMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSAmJiB0aGlzLmNhY2hlW2Ake3RoaXMueCAtIDF9OyR7dGhpcy55fWBdICAhPSAnY2hlY2snKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5hcm91bmQucHVzaChgJHt0aGlzLnggLSAxfTske3RoaXMueX1gKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIElmIG5vIGVuZW1pZXNcclxuICAgICAgICBpZih0aGlzLmFyb3VuZC5sZW5ndGggPT0gMCl7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB3ZSBjYW4gZ28gYmFjayB0byBmaW5kIG1vcmUgbmV3IHJvY2tzXHJcbiAgICAgICAgICAgIGlmKCEodGhpcy5zdGFydCA9PSBgJHt0aGlzLnh9OyR7dGhpcy55fWApKXtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBTYWlkIHdlIGdvIGJhY2tcclxuICAgICAgICAgICAgICAgIHRoaXMubmV3Um9jayA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEdvQmFjayA9IHRoaXMuaW5kZXhHb0JhY2sgLSAxO1xyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAvLyBTZXQgbmV3IGNvb3JkaW5hdGVzIGZvciB0aGUgbmV4dCBqdW1wXHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnRlcnJpdG9yeVt0aGlzLmluZGV4R29CYWNrXS5sYXN0SW5kZXhPZignOycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy54ID0gcGFyc2VJbnQodGhpcy50ZXJyaXRvcnlbdGhpcy5pbmRleEdvQmFja10uc3Vic3RyKDAsIGluZGV4KSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBwYXJzZUludCh0aGlzLnRlcnJpdG9yeVt0aGlzLmluZGV4R29CYWNrXS5zdWJzdHJpbmcoaW5kZXggKyAxKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gSnVtcCBieSByZWN1cnNpb24gdG8gYW4gYW5vdGhlciByb2NrXHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbmRUZXJyaXRvcnkoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsc2V7XHJcblxyXG4gICAgICAgICAgICAvLyBDaGVjayBvbmUgZW5lbXlcclxuICAgICAgICAgICAgdGhpcy5yYW5kb20gPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiB0aGlzLmFyb3VuZC5sZW5ndGgpO1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IG5ldyBjb29yZGluYXRlcyBmb3IgdGhlIG5leHQganVtcFxyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmFyb3VuZFt0aGlzLnJhbmRvbV0ubGFzdEluZGV4T2YoJzsnKTtcclxuICAgICAgICAgICAgdGhpcy54ID0gcGFyc2VJbnQodGhpcy5hcm91bmRbdGhpcy5yYW5kb21dLnN1YnN0cigwLCBpbmRleCkpO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBwYXJzZUludCh0aGlzLmFyb3VuZFt0aGlzLnJhbmRvbV0uc3Vic3RyaW5nKGluZGV4ICsgMSkpO1xyXG5cclxuICAgICAgICAgICAgLy8gSnVtcCBieSByZWN1cnNpb24gdG8gYW4gYW5vdGhlciByb2NrXHJcbiAgICAgICAgICAgIHRoaXMubmV3Um9jayA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMuZmluZFRlcnJpdG9yeSgpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZmluZEFsbFRlcnJpdG9yeSgpe1xyXG4gICAgICAgIHRoaXMuZmluZFRlcnJpdG9yeSgpO1xyXG4gICAgICAgIHJldHVybiB0aGlzLnRlcnJpdG9yeTtcclxuICAgIH1cclxuXHJcbiAgICBmaW5kQm9yZGVyVGVycml0b3J5KCl7XHJcblxyXG4gICAgICAgIHRoaXMuZmluZFRlcnJpdG9yeSgpO1xyXG5cclxuICAgICAgICBmb3IodmFyIGl0ZW0gb2YgdGhpcy50ZXJyaXRvcnkpe1xyXG5cclxuICAgICAgICAgICAgLy8gU2V0IGNvb3JkaW5hdGVzIG9mIHRoZSBjdXJyZW50IHJvY2tcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gaXRlbS5sYXN0SW5kZXhPZignOycpO1xyXG4gICAgICAgICAgICB0aGlzLnggPSBwYXJzZUludChpdGVtLnN1YnN0cigwLCBpbmRleCkpO1xyXG4gICAgICAgICAgICB0aGlzLnkgPSBwYXJzZUludChpdGVtLnN1YnN0cmluZyhpbmRleCArIDEpKTtcclxuXHJcbiAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSByb2NrIGlzIG5vdCB0b3RhbGx5IGFyb3VuZCB0byBrbm93IGlmIGl0J3Mgb24gdGhlIGJvcmRlclxyXG4gICAgICAgICAgICBpZighKHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgLSAxfWBdID09IHRoaXMuZW5lbXkgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueCArIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgKyAxfWBdID09IHRoaXMuZW5lbXkgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueCAtIDF9OyR7dGhpcy55fWBdID09IHRoaXMuZW5lbXkpKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyVGVycml0b3J5LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmJvcmRlclRlcnJpdG9yeS5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRlcnJpdG9yeTsgIiwiLyoqXG4gKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXG4gKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhIGV0IEzDqW8gTGUgQnJhc1xuICogSEVUSUMgUDIwMTlcbiAqXG4gKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVsZXIpXG4gKlxuICogQ29weXJpZ2h0IDIwMTVcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICpcbiAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gKi9cblxuLy8gSW1wb3J0IHRoZSBhcHBcbmltcG9ydCBHYW1lIGZyb20gXCIuL2FwcC9pbmRleC5qc1wiO1xuXG4vLyBTZXQgb3B0aW9uc1xudmFyIG9wdGlvbnMgPSB7XG4gICAgZ29iYW46IHtcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuJyxcbiAgICB9LFxuICAgIGdhbWVwbGF5OiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9nYW1lcGxheScsXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICAgIG5icmU6ICcxOScsXG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9ncmlkJyxcbiAgICAgICAgY2VsbFNpemU6IDQwLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gICAgICAgIGJvcmRlckNvbG9yOiAnYmxhY2snLFxuICAgICAgICBib3JkZXJXaWR0aDogMixcbiAgICB9LFxuICAgIHJvY2s6e1xuICAgICAgICBzaXplOiAyMCxcbiAgICAgICAgcGxheWVyMTogJ2dyZXknLFxuICAgICAgICBwbGF5ZXIyOiAnYmxhY2snLFxuICAgIH1cbn07XG5cbi8vIEluaXRpYWxpemUgYW5kIHJ1biB0aGUgZ2FtZVxudmFyIEdvR2FtZSA9IG5ldyBHYW1lKG9wdGlvbnMpO1xuR29HYW1lLnJ1bigpOyJdfQ==
