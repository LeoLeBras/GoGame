(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x3,
    property = _x4,
    receiver = _x5; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var Game = (function () {

    /**
     * Init options
     *
     * @param array options (optional)
     * @return 
     */

    function Game() {
        _classCallCheck(this, Game);
    }

    _createClass(Game, [{
        key: 'run',

        /**
         * Run the game
         *
         */
        value: function run() {

            // Builder
            var GameBuilder = new Builder();
            GameBuilder.run();

            // Gameplay
            var GameGameplay = new Gameplay();
            GameGameplay.listenner();
        }
    }]);

    return Game;
})();

var Builder = (function () {

    /**
     * Constructor
     *
     */

    function Builder() {
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

var Gameplay = (function () {

    /**
     * Constructor
     *
     * @param array options
     */

    function Gameplay() {
        _classCallCheck(this, Gameplay);

        this.$goban = Sprint(options['gameplay'].element);
        this.canvas = this.$goban.dom[0].getContext('2d');

        this.grid = options['grid'].nbre;
        this.cellSize = options['grid'].cellSize;

        this.rock;
        this.rockSize = options['rock'].size;
        this.rockPlayer1 = options['rock'].player1;
        this.rockPlayer2 = options['rock'].player2;

        this.player = new Player('current');
        this.ennemy = new Player('ennemy');

        this.chains = [];
        this.cache = [];

        for (this.x = 1; this.x <= this.grid; this.x++) {
            rocks[this.x] = [];
            for (this.y = 1; this.y <= this.grid; this.y++) {
                rocks[this.x][this.y] = new Rock(this.x, this.y);
            }
        }
    }

    _createClass(Gameplay, [{
        key: 'listenner',

        /* ------------------------------------- */

        /**
         * Listen event on the gameplay (dispatcher)
         *
         */
        value: function listenner() {

            // Click on the goban
            Sprint(this.$goban).on('click', (function (e) {
                this.click(e);
            }).bind(this));
        }
    }, {
        key: 'click',

        /**
         * The player click on the goban to put a rock
         *
         */
        value: function click(e) {

            // Set current rock
            this.x = Math.floor((e.layerX + this.cellSize / 2) / this.cellSize);
            this.y = Math.floor((e.layerY + this.cellSize / 2) / this.cellSize);

            // If we are on the goban
            if (1 <= this.x && this.x <= this.grid && 1 <= this.y && this.y <= this.grid) {
                this.getRock();

                // If the rock can be placed here, handle actions
                if (this.rock.canPlay(this.player)) {

                    // Debug
                    console.log('****');
                    console.log('Player ' + this.player.get() + ' en ' + this.x + ';' + this.y);

                    this.rock.create(this.player);
                    this.setRock();
                    this.handleChains();
                    this.handleGoban();
                    this.player.next();
                    this.ennemy.next();
                }
            }
        }
    }, {
        key: 'setRock',

        /* ------------------------------------- */

        /**
         * Save this.rock in rocks
         *
         */
        value: function setRock() {
            rocks[this.x][this.y] = this.rock;
        }
    }, {
        key: 'getRock',

        /**
         * Use this.rock instead of rocks[this.x][this.y]
         *
         */
        value: function getRock() {
            this.rock = rocks[this.x][this.y];
        }
    }, {
        key: 'handleChains',

        /* ------------------------------------- */

        /**
         * Handle chains
         *
         */
        value: function handleChains() {

            // Get neighbors
            var neighbors = this.rock.getNeighboringIntersections('current');

            if (neighbors.length != 0) {

                // Get chains from neighborings intersections       
                var _chains = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = neighbors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var _rock = _step.value;

                        if (_chains.indexOf(_rock.getChain()) == -1) {
                            _chains.push(_rock.getChain());
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

                // CASE 1 : Add the rock to the chain
                if (_chains.length == 1) {
                    var chain = _chains[0]; // Set index of the chain
                }

                // CASE 2 : Join chains
                else {
                    _chains = _chains.sort();
                    var joinChain = _chains[0];
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = _chains.reverse()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _chain = _step2.value;

                            if (_chain != joinChain) {
                                var _iteratorNormalCompletion3 = true;
                                var _didIteratorError3 = false;
                                var _iteratorError3 = undefined;

                                try {
                                    for (var _iterator3 = this.chains[_chain].getRocks()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                        var _rock2 = _step3.value;

                                        rocks[_rock2.x][_rock2.y].setChain(joinChain);
                                        this.chains[joinChain].addRock(_rock2);
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

                                this.chains[_chain].remove();
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

                    var chain = joinChain; // Set index of the chain
                }
            }

            // CASE 3 : Create new chain
            else {
                var chain = this.chains.length; // Set index of the chain
                this.chains[chain] = new Chain(); // Create new chain object
            }

            // Add current rock to the chain
            var rock = {
                x: this.rock.x,
                y: this.rock.y
            };
            this.chains[chain].addRock(rock);
            rocks[this.x][this.y].setChain(chain);
        }
    }, {
        key: 'handleGoban',

        /**
         * Handle the goban with the new territories
         *
         */
        value: function handleGoban() {

            var neighbors = this.rock.getNeighboringIntersections('ennemy');

            if (neighbors.length != 0) {

                // Get chains from neighborings intersections       
                var _chains2 = [];
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = neighbors[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var rock = _step4.value;

                        if (_chains2.indexOf(rock.getChain()) == -1) {
                            _chains2.push(rock.getChain());
                        }
                    }
                } catch (err) {
                    _didIteratorError4 = true;
                    _iteratorError4 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion4 && _iterator4['return']) {
                            _iterator4['return']();
                        }
                    } finally {
                        if (_didIteratorError4) {
                            throw _iteratorError4;
                        }
                    }
                }

                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = _chains2[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var chain = _step5.value;

                        if (this.chains[chain].isDead(this.tab)) {
                            console.log('Dead');
                            var _iteratorNormalCompletion6 = true;
                            var _didIteratorError6 = false;
                            var _iteratorError6 = undefined;

                            try {
                                for (var _iterator6 = this.chains[chain].getRocks()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                                    var rock = _step6.value;
                                }
                            } catch (err) {
                                _didIteratorError6 = true;
                                _iteratorError6 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion6 && _iterator6['return']) {
                                        _iterator6['return']();
                                    }
                                } finally {
                                    if (_didIteratorError6) {
                                        throw _iteratorError6;
                                    }
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError5 = true;
                    _iteratorError5 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion5 && _iterator5['return']) {
                            _iterator5['return']();
                        }
                    } finally {
                        if (_didIteratorError5) {
                            throw _iteratorError5;
                        }
                    }
                }
            }
        }
    }]);

    return Gameplay;
})();

var Save = (function (_Gameplay) {
    function Save() {
        _classCallCheck(this, Save);

        _get(Object.getPrototypeOf(Save.prototype), 'constructor', this).call(this);
        this.score = [];
    }

    _inherits(Save, _Gameplay);

    return Save;
})(Gameplay);

var Score = (function (_Gameplay2) {
    function Score() {
        _classCallCheck(this, Score);

        _get(Object.getPrototypeOf(Score.prototype), 'constructor', this).call(this);
    }

    _inherits(Score, _Gameplay2);

    return Score;
})(Gameplay);

var chains = [];

var Chain = (function () {

    /**
     * Constructor
     *
     */

    function Chain() {
        _classCallCheck(this, Chain);

        this.rocks = [];
        this.border = [];
        this.territory = [];
        this.state = 'alive';
    }

    _createClass(Chain, [{
        key: 'addRock',

        /**
         * Add rock
         *
         */
        value: function addRock(rock) {
            this.rocks.push(rock);
        }
    }, {
        key: 'getRocks',

        /**
         * Get rocks
         *
         */
        value: function getRocks() {
            return this.rocks.sort();
        }
    }, {
        key: 'remove',

        /**
         * Remove a chain
         *
         */
        value: function remove() {
            this.rocks = [];
            this.state = 'dead';
        }
    }, {
        key: 'getBorders',

        /**
         * Return borders of the chain
         *
         * @return array
         */
        value: function getBorders() {
            var param = arguments[0] === undefined ? 'objects' : arguments[0];

            var player = rocks[this.rocks[0].x][this.rocks[0].y].getPlayer();

            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {
                for (var _iterator7 = this.rocks[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var rock = _step7.value;

                    if (rocks[rock.x][rock.y].getNeighboringIntersections(rocks, 'current').length != 4) {
                        this.border.push(rock);
                    }
                }
            } catch (err) {
                _didIteratorError7 = true;
                _iteratorError7 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion7 && _iterator7['return']) {
                        _iterator7['return']();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            if (param == 'count') {
                return this.border.length;
            }

            return this.border.sort();
        }
    }, {
        key: 'isDead',

        /**
         * Check if the territory is dead
         *
         * @return true or false
         */
        value: function isDead() {
            if (this.getLiberties() == 0) {
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
            this.liberties = 0;

            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this.getBorders(rocks)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var rock = _step8.value;
                }
            } catch (err) {
                _didIteratorError8 = true;
                _iteratorError8 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion8 && _iterator8['return']) {
                        _iterator8['return']();
                    }
                } finally {
                    if (_didIteratorError8) {
                        throw _iteratorError8;
                    }
                }
            }

            console.log(this.liberties);

            return this.liberties;
        }
    }]);

    return Chain;
})();

var players = [];

var Player = (function () {

    /**
     * Constructor
     *
     * @param name of the current player
     */

    function Player(player) {
        _classCallCheck(this, Player);

        this.name = 1;
        if (player == 'ennemy') {
            this.name = 2;
        }
    }

    _createClass(Player, [{
        key: 'next',

        /**
         * Switch to the next player
         *
         */
        value: function next() {
            this.name = this.name++ % 2 + 1;
        }
    }, {
        key: 'get',

        /**
         * Get player
         *
         * @return this.name
         */
        value: function get() {
            return this.name;
        }
    }]);

    return Player;
})();

var rocks = [];

var Rock = (function () {

    /**
     * Constructor
     *
     * @param x and y (number)
     */

    function Rock(x, y) {
        _classCallCheck(this, Rock);

        this.chain = 0;
        this.x = x;
        this.y = y;
        this.player = 0;
        this.color;
        this.cellSize = options['grid'].cellSize;
        this.rockSize = options['rock'].size;
        this.canvas = Sprint(options['gameplay'].element).dom[0].getContext('2d');
        this.chains;
    }

    _createClass(Rock, [{
        key: 'checkSuicide',

        /* ------------------------------------- */

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
        key: 'canPlay',

        /**
         * Check if the player can play here
         *
         */
        value: function canPlay(player, tab) {

            if (!this.checkSuicide() && !this.checkKO() && this.getPlayer() == 0) {
                return true;
            } else {
                return false;
            }
        }
    }, {
        key: 'create',

        /* ------------------------------------- */

        /**
         * Create a rock
         *
         */
        value: function create(player) {

            // Set player
            this.player = player.get();

            // Set color
            this.color = options['rock'].player1;
            if (this.player == 2) {
                this.color = options['rock'].player2;
            }

            // Draw
            var c = this.canvas;
            c.beginPath();
            c.arc(this.x * this.cellSize, this.y * this.cellSize, this.rockSize / 2, 0, 2 * Math.PI, false);
            c.closePath();
            c.fillStyle = this.color;
            c.fill();
        }
    }, {
        key: 'getNeighboringIntersections',

        /* ------------------------------------- */

        /**
         * Get neighboring intersections
         *
         * @param player (string)
         * @return neighboring intersections (array)
         */
        value: function getNeighboringIntersections() {
            var player = arguments[0] === undefined ? 'all' : arguments[0];

            this.neighboringIntersections = [];
            this.cache = [];

            for (var i = 1; i <= 4; i++) {
                var x = this.x;
                var y = this.y;

                switch (i) {
                    case 1:
                        y = y - 1; // top
                        break;

                    case 2:
                        x++; // right
                        break;

                    case 3:
                        y++; // bottom
                        break;

                    case 4:
                        x = x - 1; // left
                        break;
                }

                if (rocks[x] != undefined && rocks[x][y] != undefined) {
                    var rock = rocks[x][y];
                    if (rock.getPlayer() != 0) {
                        this.cache.push(rock);
                    }
                }
            }

            if (player == 'curren') {
                player = rocks[this.x][this.y].getPlayer();
            } else {
                player = (rocks[this.x][this.y].getPlayer() + 2) % 2 + 1;
            }

            if (player != 'all') {
                for (var i in this.cache) {
                    var rock = this.cache[i];
                    if (rock.getPlayer() == player) {
                        this.neighboringIntersections.push(rock);
                    }
                }
            } else {
                this.neighboringIntersections = this.cache;
            }

            return this.neighboringIntersections.sort();
        }
    }, {
        key: 'getPlayer',

        /* ------------------------------------- */

        /**
         * Get the player 
         *
         * @return this.player
         */
        value: function getPlayer() {
            return this.player;
        }
    }, {
        key: 'setChain',

        /**
         * Set chain 
         *
         * @param chain (number)
         */
        value: function setChain(chain) {
            this.chain = chain;
        }
    }, {
        key: 'getChain',

        /**
         * Get chain 
         *
         * @return this.chain
         */
        value: function getChain() {
            return this.chain;
        }
    }]);

    return Rock;
})();

/**
 * Minions in da’ game, brotha 😎
 * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa, THéo Knutz et Léo Le Bras
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

var GoGame = new Game();
GoGame.run();

//this.tab[rock.x][rock.y].remove();

//this.liberties += rocks[rock.x][rock.y].getLiberties();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2Zha2VfNzRkNGI5ZTQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7SUNBTSxJQUFJOzs7Ozs7Ozs7QUFRSyxhQVJULElBQUksR0FRTzs4QkFSWCxJQUFJO0tBU0w7O2lCQVRDLElBQUk7Ozs7Ozs7ZUFvQkgsZUFBRTs7O0FBR0QsZ0JBQUksV0FBVyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDaEMsdUJBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQzs7O0FBR2xCLGdCQUFJLFlBQVksR0FBRyxJQUFJLFFBQVEsRUFBRSxDQUFDO0FBQ2xDLHdCQUFZLENBQUMsU0FBUyxFQUFFLENBQUM7U0FFNUI7OztXQTlCQyxJQUFJOzs7SUFnQ0osT0FBTzs7Ozs7OztBQU1FLGFBTlQsT0FBTyxHQU1JOzhCQU5YLE9BQU87O0FBT0wsWUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2pDLFlBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQzs7QUFFbkQsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7O0FBRTFELFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMs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QkFBd0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDO2FBQzlDOztBQUVELG1CQUFPLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUUvQzs7Ozs7Ozs7Ozs7ZUFrQlEscUJBQUU7QUFDUCxtQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3RCOzs7Ozs7Ozs7ZUFZTyxrQkFBQyxLQUFLLEVBQUM7QUFDWCxnQkFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDdEI7Ozs7Ozs7OztlQVlPLG9CQUFFO0FBQ04sbUJBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNyQjs7O1dBdk9DLElBQUk7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMFBWLElBQUksT0FBTyxHQUFHO0FBQ1YsU0FBSyxFQUFFO0FBQ0gsZUFBTyxFQUFFLGFBQWE7S0FDekI7QUFDRCxZQUFRLEVBQUU7QUFDTixlQUFPLEVBQUUsc0JBQXNCO0tBQ2xDO0FBQ0QsUUFBSSxFQUFFO0FBQ0YsWUFBSSxFQUFFLElBQUk7QUFDVixlQUFPLEVBQUUsa0JBQWtCO0FBQzNCLGdCQUFRLEVBQUUsRUFBRTtBQUNaLHVCQUFlLEVBQUUsT0FBTztBQUN4QixtQkFBVyxFQUFFLE9BQU87QUFDcEIsbUJBQVcsRUFBRSxDQUFDO0tBQ2pCO0FBQ0QsUUFBSSxFQUFDO0FBQ0QsWUFBSSxFQUFFLEVBQUU7QUFDUixlQUFPLEVBQUUsTUFBTTtBQUNmLGVBQU8sRUFBRSxPQUFPO0tBQ25CO0NBQ0osQ0FBQzs7QUFFRixJQUFJLE1BQU0sR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDO0FBQ3hCLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBHYW1le1xuXG4gICAgLyoqXG4gICAgICogSW5pdCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9ucyAob3B0aW9uYWwpXG4gICAgICogQHJldHVybiBcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIFJ1biB0aGUgZ2FtZVxuICAgICAqXG4gICAgICovICBcbiAgICBydW4oKXtcblxuICAgICAgICAvLyBCdWlsZGVyXG4gICAgICAgIHZhciBHYW1lQnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gICAgICAgIEdhbWVCdWlsZGVyLnJ1bigpO1xuXG4gICAgICAgIC8vIEdhbWVwbGF5XG4gICAgICAgIHZhciBHYW1lR2FtZXBsYXkgPSBuZXcgR2FtZXBsYXkoKTtcbiAgICAgICAgR2FtZUdhbWVwbGF5Lmxpc3Rlbm5lcigpO1xuXG4gICAgfVxufVxuY2xhc3MgQnVpbGRlcntcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xuICAgICAgICB0aGlzLmdyaWRib3JkZXJXaWR0aCA9IG9wdGlvbnNbJ2dyaWQnXS5ib3JkZXJXaWR0aDtcblxuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuICAgICAgICB0aGlzLmdyaWRTaXplID0gKHBhcnNlSW50KHRoaXMuZ3JpZCkgKyAxKSAqIHRoaXMuY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ29iYW4nXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkgPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZCA9IFNwcmludChvcHRpb25zWydncmlkJ10uZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5ncmlkQ2FudmFzID0gdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5nYW1lcGxheUNhbnZhcyA9IHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBnb2JhblxuICAgICAqXG4gICAgICogQHJldHVybiBjc3Mgc3R5bGUgb2YgdGhlIGdvYmFuXG4gICAgICovICBcbiAgICBidWlsZEdvYmFuKCl7XG4gICAgICAgIHRoaXMuJGdvYmFuLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdhbWVwbGF5IGNhbnZhc1xuICAgICAqXG4gICAgICogQHJldHVybiBjYW52YXNcbiAgICAgKi8gIFxuICAgIGJ1aWxkR2FtZXBsYXkoKXtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmhlaWdodCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxuICAgICAgICB9KVxuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBncmlkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNhbnZhcyB3aXRoIGEgZ3JpZCBkcmF3blxuICAgICAqLyAgXG4gICAgYnVpbGRHcmlkKCl7XG5cbiAgICAgICAgLy8gU2V0IHNpemUgb2YgY2FudmFzXG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBJbml0IHRoZSBjYW52YXNcbiAgICAgICAgdmFyIGMgPSB0aGlzLmdyaWRDYW52YXM7XG5cbiAgICAgICAgLy8gRHJhdyBlYWNoIGxpbmVzIG9mIHRoZSBncmlkXG4gICAgICAgIGZvcih2YXIgeCA9IDE7IHggPD0gdGhpcy5ncmlkIDsgeCsrKXtcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XG4gICAgICAgICAgICBjLmxpbmVUbyh0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSwgdGhpcy5jZWxsU2l6ZSAqIHgpO1xuICAgICAgICAgICAgYy5saW5lV2lkdGggPSB0aGlzLmdyaWRib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciB5ID0gMTsgeSA8PSB0aGlzLmdyaWQgOyB5Kyspe1xuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGMubW92ZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xuICAgICAgICAgICAgYy5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhbGwgZWxlbWVudHNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgcnVuKCl7XG4gICAgICAgIHRoaXMuYnVpbGRHb2JhbigpO1xuICAgICAgICB0aGlzLmJ1aWxkR2FtZXBsYXkoKTtcbiAgICAgICAgdGhpcy5idWlsZEdyaWQoKTtcbiAgICB9XG5cbn1cbmNsYXNzIEdhbWVwbGF5e1xuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJheSBvcHRpb25zXG4gICAgICovICAgXG4gICAgY29uc3RydWN0b3IoKXtcblxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJGdvYmFuLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy5yb2NrO1xuICAgICAgICB0aGlzLnJvY2tTaXplID0gb3B0aW9uc1sncm9jayddLnNpemU7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjEgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMTtcbiAgICAgICAgdGhpcy5yb2NrUGxheWVyMiA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIyO1xuXG4gICAgICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcignY3VycmVudCcpO1xuICAgICAgICB0aGlzLmVubmVteSA9IG5ldyBQbGF5ZXIoJ2VubmVteScpO1xuXG4gICAgICAgIHRoaXMuY2hhaW5zID0gW107XG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcblxuICAgICAgICBmb3IodGhpcy54PSAxOyB0aGlzLnggPD0gdGhpcy5ncmlkIDsgdGhpcy54Kyspe1xuICAgICAgICAgICAgcm9ja3NbdGhpcy54XSA9IFtdO1xuICAgICAgICAgICAgZm9yKHRoaXMueSA9IDE7IHRoaXMueSA8PSB0aGlzLmdyaWQgOyB0aGlzLnkrKyl7XG4gICAgICAgICAgICAgICAgcm9ja3NbdGhpcy54XVt0aGlzLnldID0gbmV3IFJvY2sodGhpcy54LCB0aGlzLnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxuXG5cblxuICAgIFxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gZXZlbnQgb24gdGhlIGdhbWVwbGF5IChkaXNwYXRjaGVyKVxuICAgICAqXG4gICAgICovICBcbiAgICBsaXN0ZW5uZXIoKXtcblxuICAgICAgICAvLyBDbGljayBvbiB0aGUgZ29iYW5cbiAgICAgICAgU3ByaW50KHRoaXMuJGdvYmFuKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHRoaXMuY2xpY2soZSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogVGhlIHBsYXllciBjbGljayBvbiB0aGUgZ29iYW4gdG8gcHV0IGEgcm9ja1xuICAgICAqXG4gICAgICovICBcbiAgICBjbGljayhlKXtcblxuICAgICAgICAvLyBTZXQgY3VycmVudCByb2NrXG4gICAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IoKGUubGF5ZXJYICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IoKGUubGF5ZXJZICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG5cbiAgICAgICAgLy8gSWYgd2UgYXJlIG9uIHRoZSBnb2JhblxuICAgICAgICBpZigxIDw9IHRoaXMueCAmJiB0aGlzLnggPD0gdGhpcy5ncmlkICYmIDEgPD0gdGhpcy55ICYmIHRoaXMueSA8PSB0aGlzLmdyaWQgKXtcbiAgICAgICAgICAgIHRoaXMuZ2V0Um9jaygpO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgcm9jayBjYW4gYmUgcGxhY2VkIGhlcmUsIGhhbmRsZSBhY3Rpb25zXG4gICAgICAgICAgICBpZih0aGlzLnJvY2suY2FuUGxheSh0aGlzLnBsYXllcikpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIERlYnVnXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyoqKionKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUGxheWVyICR7dGhpcy5wbGF5ZXIuZ2V0KCl9IGVuICR7dGhpcy54fTske3RoaXMueX1gKTtcblxuICAgICAgICAgICAgICAgIHRoaXMucm9jay5jcmVhdGUodGhpcy5wbGF5ZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Um9jaygpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2hhaW5zKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVHb2JhbigpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLm5leHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVubmVteS5uZXh0KCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuICAgIFxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBTYXZlIHRoaXMucm9jayBpbiByb2Nrc1xuICAgICAqXG4gICAgICovICBcbiAgICBzZXRSb2NrKCl7XG4gICAgICAgIHJvY2tzW3RoaXMueF1bdGhpcy55XSA9IHRoaXMucm9jaztcbiAgICB9XG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGlzLnJvY2sgaW5zdGVhZCBvZiByb2Nrc1t0aGlzLnhdW3RoaXMueV1cbiAgICAgKlxuICAgICAqLyAgXG4gICAgZ2V0Um9jaygpe1xuICAgICAgICB0aGlzLnJvY2sgPSByb2Nrc1t0aGlzLnhdW3RoaXMueV07XG4gICAgfVxuXG5cblxuXG4gICAgXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBjaGFpbnNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgaGFuZGxlQ2hhaW5zKCl7XG5cbiAgICAgICAgLy8gR2V0IG5laWdoYm9yc1xuICAgICAgICB2YXIgbmVpZ2hib3JzID0gdGhpcy5yb2NrLmdldE5laWdoYm9yaW5nSW50ZXJzZWN0aW9ucygnY3VycmVudCcpO1xuXG4gICAgICAgIGlmKG5laWdoYm9ycy5sZW5ndGggIT0gMCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEdldCBjaGFpbnMgZnJvbSBuZWlnaGJvcmluZ3MgaW50ZXJzZWN0aW9ucyAgICAgICAgXG4gICAgICAgICAgICBsZXQgY2hhaW5zID0gW107XG4gICAgICAgICAgICBmb3IobGV0IHJvY2sgb2YgbmVpZ2hib3JzKXtcbiAgICAgICAgICAgICAgICBpZihjaGFpbnMuaW5kZXhPZihyb2NrLmdldENoYWluKCkpID09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW5zLnB1c2gocm9jay5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENBU0UgMSA6IEFkZCB0aGUgcm9jayB0byB0aGUgY2hhaW5cbiAgICAgICAgICAgIGlmKGNoYWlucy5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgICAgICAgdmFyIGNoYWluID0gY2hhaW5zWzBdOyAvLyBTZXQgaW5kZXggb2YgdGhlIGNoYWluXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENBU0UgMiA6IEpvaW4gY2hhaW5zXG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGNoYWlucyA9IGNoYWlucy5zb3J0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGpvaW5DaGFpbiA9IGNoYWluc1swXTtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGNoYWluIG9mIGNoYWlucy5yZXZlcnNlKCkpe1xuICAgICAgICAgICAgICAgICAgICBpZihjaGFpbiAhPSBqb2luQ2hhaW4pe1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIHRoaXMuY2hhaW5zW2NoYWluXS5nZXRSb2NrcygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2Nrc1tyb2NrLnhdW3JvY2sueV0uc2V0Q2hhaW4oam9pbkNoYWluKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYWluc1tqb2luQ2hhaW5dLmFkZFJvY2socm9jayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYWluc1tjaGFpbl0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2hhaW4gPSBqb2luQ2hhaW47IC8vIFNldCBpbmRleCBvZiB0aGUgY2hhaW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENBU0UgMyA6IENyZWF0ZSBuZXcgY2hhaW5cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZhciBjaGFpbiA9IHRoaXMuY2hhaW5zLmxlbmd0aDsgLy8gU2V0IGluZGV4IG9mIHRoZSBjaGFpblxuICAgICAgICAgICAgdGhpcy5jaGFpbnNbY2hhaW5dID0gbmV3IENoYWluKCk7IC8vIENyZWF0ZSBuZXcgY2hhaW4gb2JqZWN0XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgY3VycmVudCByb2NrIHRvIHRoZSBjaGFpblxuICAgICAgICB2YXIgcm9jayA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMucm9jay54LFxuICAgICAgICAgICAgeTogdGhpcy5yb2NrLnlcbiAgICAgICAgfTsgICAgICAgIFxuICAgICAgICB0aGlzLmNoYWluc1tjaGFpbl0uYWRkUm9jayhyb2NrKTtcbiAgICAgICAgcm9ja3NbdGhpcy54XVt0aGlzLnldLnNldENoYWluKGNoYWluKTtcblxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBnb2JhbiB3aXRoIHRoZSBuZXcgdGVycml0b3JpZXNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgaGFuZGxlR29iYW4oKXtcblxuICAgICAgICB2YXIgbmVpZ2hib3JzID0gdGhpcy5yb2NrLmdldE5laWdoYm9yaW5nSW50ZXJzZWN0aW9ucygnZW5uZW15Jyk7XG5cbiAgICAgICAgaWYobmVpZ2hib3JzLmxlbmd0aCAhPSAwKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gR2V0IGNoYWlucyBmcm9tIG5laWdoYm9yaW5ncyBpbnRlcnNlY3Rpb25zICAgICAgICBcbiAgICAgICAgICAgIGxldCBjaGFpbnMgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKGNoYWlucy5pbmRleE9mKHJvY2suZ2V0Q2hhaW4oKSkgPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBjaGFpbnMucHVzaChyb2NrLmdldENoYWluKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGxldCBjaGFpbiBvZiBjaGFpbnMpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2hhaW5zW2NoYWluXS5pc0RlYWQodGhpcy50YWIpKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RlYWQnKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIHRoaXMuY2hhaW5zW2NoYWluXS5nZXRSb2NrcygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy50YWJbcm9jay54XVtyb2NrLnldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBTYXZlIGV4dGVuZHMgR2FtZXBsYXl7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgIFx0c3VwZXIoKTtcbiAgICAgICAgdGhpcy5zY29yZSA9IFtdO1xuICAgIH1cblxufVxuY2xhc3MgU2NvcmUgZXh0ZW5kcyBHYW1lcGxheXtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgXHRzdXBlcigpO1xuICAgIH1cbiAgICBcbn1cblxudmFyIGNoYWlucyA9IFtdO1xyXG5cclxuY2xhc3MgQ2hhaW57XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcblxyXG4gICAgICAgIHRoaXMucm9ja3MgPSBbXTtcclxuICAgICAgICB0aGlzLmJvcmRlciA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVycml0b3J5ID0gW107XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdhbGl2ZSc7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIHJvY2tcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgYWRkUm9jayhyb2NrKXtcclxuICAgIFx0dGhpcy5yb2Nrcy5wdXNoKHJvY2spO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHJvY2tzXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGdldFJvY2tzKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm9ja3Muc29ydCgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGEgY2hhaW5cclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgcmVtb3ZlKCl7XHJcbiAgICAgICAgdGhpcy5yb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSAnZGVhZCc7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIGJvcmRlcnMgb2YgdGhlIGNoYWluXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBhcnJheVxyXG4gICAgICovIFxyXG4gICAgZ2V0Qm9yZGVycyhwYXJhbSA9ICdvYmplY3RzJyl7XHJcblxyXG4gICAgICAgIHZhciBwbGF5ZXIgPSByb2Nrc1t0aGlzLnJvY2tzWzBdLnhdW3RoaXMucm9ja3NbMF0ueV0uZ2V0UGxheWVyKCk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgcm9jayBvZiB0aGlzLnJvY2tzKXtcclxuICAgICAgICAgICAgaWYocm9ja3Nbcm9jay54XVtyb2NrLnldLmdldE5laWdoYm9yaW5nSW50ZXJzZWN0aW9ucyhyb2NrcywgJ2N1cnJlbnQnKS5sZW5ndGggIT0gNCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvcmRlci5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwYXJhbSA9PSAnY291bnQnKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVyLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmJvcmRlci5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB0aGUgdGVycml0b3J5IGlzIGRlYWRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRydWUgb3IgZmFsc2VcclxuICAgICAqLyBcclxuICAgIGlzRGVhZCgpe1xyXG4gICAgICAgIGlmKHRoaXMuZ2V0TGliZXJ0aWVzKCkgPT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgbGliZXJ0aWVzIG9mIHRoZSB0ZXJyaXRvcmllc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5saWJlcnRpZXMgKG51bWJlcilcclxuICAgICAqLyBcclxuICAgIGdldExpYmVydGllcygpe1xyXG5cclxuICAgICAgICAvLyBHZXQgYm9yZGVycyBvZiB0aGUgdGVycml0b3J5XHJcbiAgICAgICAgdGhpcy5saWJlcnRpZXMgPSAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgcm9jayBvZiB0aGlzLmdldEJvcmRlcnMocm9ja3MpKXtcclxuICAgICAgICAgICAgLy90aGlzLmxpYmVydGllcyArPSByb2Nrc1tyb2NrLnhdW3JvY2sueV0uZ2V0TGliZXJ0aWVzKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmxpYmVydGllcyk7XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmxpYmVydGllcztcclxuXHJcbiAgICB9XHJcblxyXG59XG52YXIgcGxheWVycyA9IFtdO1xyXG5cclxuY2xhc3MgUGxheWVye1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGxheWVyXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcil7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gMTtcclxuICAgICAgICBpZihwbGF5ZXIgPT0gJ2VubmVteScpe1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN3aXRjaCB0byB0aGUgbmV4dCBwbGF5ZXJcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgbmV4dCgpe1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICgodGhpcy5uYW1lKyspICUgMikgKyAxO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHBsYXllclxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5uYW1lXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0KCl7XHJcbiAgICBcdHJldHVybiB0aGlzLm5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIFxyXG59XG52YXIgcm9ja3MgPSBbXTtcclxuXHJcbmNsYXNzIFJvY2t7XHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHggYW5kIHkgKG51bWJlcilcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IoeCwgeSl7XHJcblxyXG4gICAgICAgIHRoaXMuY2hhaW4gPSAwO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLnBsYXllciA9IDA7XHJcbiAgICAgICAgdGhpcy5jb2xvcjtcclxuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xyXG4gICAgICAgIHRoaXMucm9ja1NpemUgPSBvcHRpb25zWydyb2NrJ10uc2l6ZTtcclxuICAgICAgICB0aGlzLmNhbnZhcyA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xyXG4gICAgICAgIHRoaXMuY2hhaW5zO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICBcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgd2UgYXJlIGluIGEgY2FzZSBvZiBzdWljaWRlXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGNoZWNrU3VpY2lkZSgpe1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgd2UgYXJlIGluIGEgY2FzZSBvZiBLT1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBjaGVja0tPKCl7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSBwbGF5ZXIgY2FuIHBsYXkgaGVyZVxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBjYW5QbGF5KHBsYXllciwgdGFiKXtcclxuXHJcbiAgICAgICAgaWYoIXRoaXMuY2hlY2tTdWljaWRlKCkgJiYgIXRoaXMuY2hlY2tLTygpICYmIHRoaXMuZ2V0UGxheWVyKCkgPT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICBcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBjcmVhdGUocGxheWVyKXtcclxuXHJcbiAgICAgICAgLy8gU2V0IHBsYXllclxyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyLmdldCgpO1xyXG5cclxuICAgICAgICAvLyBTZXQgY29sb3JcclxuICAgICAgICB0aGlzLmNvbG9yID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5ZXIgPT0gMil7XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3IgPSAgb3B0aW9uc1sncm9jayddLnBsYXllcjI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBEcmF3XHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLmNhbnZhcztcclxuICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGMuYXJjKHRoaXMueCAqIHRoaXMuY2VsbFNpemUsIHRoaXMueSAqIHRoaXMuY2VsbFNpemUsIHRoaXMucm9ja1NpemUgLyAyLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgICAgIGMuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgYy5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgIGMuZmlsbCgpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIFxyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgbmVpZ2hib3JpbmcgaW50ZXJzZWN0aW9uc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBwbGF5ZXIgKHN0cmluZylcclxuICAgICAqIEByZXR1cm4gbmVpZ2hib3JpbmcgaW50ZXJzZWN0aW9ucyAoYXJyYXkpXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0TmVpZ2hib3JpbmdJbnRlcnNlY3Rpb25zKHBsYXllciA9ICdhbGwnKXtcclxuXHJcbiAgICAgICAgdGhpcy5uZWlnaGJvcmluZ0ludGVyc2VjdGlvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaT0xIDsgaSA8PSA0IDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIGxldCB5ID0gdGhpcy55O1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoKGkpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHkgPSB5IC0gMTsgLy8gdG9wXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHgrKzsgLy8gcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgeSsrOyAvLyBib3R0b21cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IHggLSAxOyAvLyBsZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHJvY2tzW3hdICE9IHVuZGVmaW5lZCAmJiByb2Nrc1t4XVt5XSAhPSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvY2sgPSByb2Nrc1t4XVt5XTtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2suZ2V0UGxheWVyKCkgIT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwbGF5ZXIgPT0gJ2N1cnJlbicpe1xyXG4gICAgICAgICAgICBwbGF5ZXIgPSByb2Nrc1t0aGlzLnhdW3RoaXMueV0uZ2V0UGxheWVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHBsYXllciA9ICgocm9ja3NbdGhpcy54XVt0aGlzLnldLmdldFBsYXllcigpICsgMikgJSAyKSArIDE7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwbGF5ZXIgIT0gJ2FsbCcpe1xyXG4gICAgICAgICAgICBmb3IobGV0IGkgaW4gdGhpcy5jYWNoZSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm9jayA9IHRoaXMuY2FjaGVbaV07XHJcbiAgICAgICAgICAgICAgICBpZihyb2NrLmdldFBsYXllcigpID09IHBsYXllcil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZWlnaGJvcmluZ0ludGVyc2VjdGlvbnMucHVzaChyb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLm5laWdoYm9yaW5nSW50ZXJzZWN0aW9ucyA9IHRoaXMuY2FjaGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5uZWlnaGJvcmluZ0ludGVyc2VjdGlvbnMuc29ydCgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICBcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHRoZSBwbGF5ZXIgXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLnBsYXllclxyXG4gICAgICovICBcclxuICAgIGdldFBsYXllcigpeyAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxheWVyO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZXQgY2hhaW4gXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNoYWluIChudW1iZXIpXHJcbiAgICAgKi8gIFxyXG4gICAgc2V0Q2hhaW4oY2hhaW4peyAgXHJcbiAgICAgICAgdGhpcy5jaGFpbiA9IGNoYWluOyBcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGNoYWluIFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5jaGFpblxyXG4gICAgICovICBcclxuICAgIGdldENoYWluKCl7ICBcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbjtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxuLyoqXG4gKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXG4gKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhLCBUSMOpbyBLbnV0eiBldCBMw6lvIExlIEJyYXNcbiAqIEhFVElDIFAyMDE5XG4gKlxuICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlbGVyKVxuICpcbiAqIENvcHlyaWdodCAyMDE1XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqXG4gKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICovXG5cbnZhciBvcHRpb25zID0ge1xuICAgIGdvYmFuOiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2JhbidcbiAgICB9LFxuICAgIGdhbWVwbGF5OiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9nYW1lcGxheSdcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgICAgbmJyZTogJzE5JyxcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuX2dyaWQnLFxuICAgICAgICBjZWxsU2l6ZTogNDAsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICdibGFjaycsXG4gICAgICAgIGJvcmRlcldpZHRoOiAyXG4gICAgfSxcbiAgICByb2NrOntcbiAgICAgICAgc2l6ZTogMjAsXG4gICAgICAgIHBsYXllcjE6ICdncmV5JyxcbiAgICAgICAgcGxheWVyMjogJ2JsYWNrJ1xuICAgIH1cbn07XG5cbnZhciBHb0dhbWUgPSBuZXcgR2FtZSgpO1xuR29HYW1lLnJ1bigpOyJdfQ==
