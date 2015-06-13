(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _get = function get(_x2, _x3, _x4) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x2,
    property = _x3,
    receiver = _x4; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x2 = parent; _x3 = property; _x4 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

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

var Chain = (function () {

    /**
     * Constructor
     *
     * @param name of the current player
     */

    function Chain() {
        _classCallCheck(this, Chain);

        this.rocks = [];
        this.state = 'alive';
        this.borders = [];
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
         * Remove
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
        value: function getBorders(rocks) {

            var player = rocks[this.rocks[0].x][this.rocks[0].y].getPlayer();

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = this.rocks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var rock = _step.value;

                    if (rocks[rock.x][rock.y].getNeighboringIntersections(rocks, 'current').length != 4) {
                        this.borders.push(rock);
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

            return this.borders.sort();
        }
    }, {
        key: 'isDead',

        /**
         * Check if the territory is dead
         *
         * @return true or false
         */
        value: function isDead(rocks) {

            this.getLiberties(rocks);

            if (this.liberties == 0) {
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
        value: function getLiberties(rocks) {

            // Get borders of the territory
            this.liberties = 0;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.getBorders(rocks)[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var rock = _step2.value;

                    if (rocks[rock.x][rock.y].getNeighboringIntersections(rocks).length != 4) {
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

            console.log(this.liberties);

            return this.liberties;
        }
    }]);

    return Chain;
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

        this.tab = [];
        this.chains = [];
        this.cache = [];

        for (this.x = 1; this.x <= this.grid; this.x++) {
            this.tab[this.x] = [];
            for (this.y = 1; this.y <= this.grid; this.y++) {
                this.tab[this.x][this.y] = new Rock(this.x, this.y);
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
                if (this.rock.canPlay(this.player, this.tab)) {

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
         * Save this.rock in this.tab
         *
         */
        value: function setRock() {
            this.tab[this.x][this.y] = this.rock;
        }
    }, {
        key: 'getRock',

        /**
         * Use this.rock instead of this.tab[this.x][this.y]
         *
         */
        value: function getRock() {
            this.rock = this.tab[this.x][this.y];
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
            var neighbors = this.rock.getNeighboringIntersections(this.tab, 'current');

            if (neighbors.length != 0) {

                // Get chains from neighborings intersections       
                var chains = [];
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = neighbors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var _rock = _step3.value;

                        if (chains.indexOf(_rock.getChain()) == -1) {
                            chains.push(_rock.getChain());
                        }
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

                // CASE 1 : Add the rock to the chain
                if (chains.length == 1) {
                    var chain = chains[0]; // Set index of the chain
                }

                // CASE 2 : Join chains
                else {
                    chains = chains.sort();
                    var joinChain = chains[0];
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = chains.reverse()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _chain = _step4.value;

                            if (_chain != joinChain) {
                                var _iteratorNormalCompletion5 = true;
                                var _didIteratorError5 = false;
                                var _iteratorError5 = undefined;

                                try {
                                    for (var _iterator5 = this.chains[_chain].getRocks()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                        var _rock2 = _step5.value;

                                        this.tab[_rock2.x][_rock2.y].setChain(joinChain);
                                        this.chains[joinChain].addRock(_rock2);
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

                                this.chains[_chain].remove();
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
            this.tab[this.x][this.y].setChain(chain);
        }
    }, {
        key: 'handleGoban',

        /**
         * Handle the goban with the new territories
         *
         */
        value: function handleGoban() {

            var neighbors = this.rock.getNeighboringIntersections(this.tab, 'ennemy');

            if (neighbors.length != 0) {

                // Get chains from neighborings intersections       
                var chains = [];
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = neighbors[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var rock = _step6.value;

                        if (chains.indexOf(rock.getChain()) == -1) {
                            chains.push(rock.getChain());
                        }
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

                var _iteratorNormalCompletion7 = true;
                var _didIteratorError7 = false;
                var _iteratorError7 = undefined;

                try {
                    for (var _iterator7 = chains[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var chain = _step7.value;

                        if (this.chains[chain].isDead(this.tab)) {
                            console.log('Dead');
                            var _iteratorNormalCompletion8 = true;
                            var _didIteratorError8 = false;
                            var _iteratorError8 = undefined;

                            try {
                                for (var _iterator8 = this.chains[chain].getRocks()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
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
            }
        }
    }]);

    return Gameplay;
})();

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

var Player = (function () {

    /**
     * Constructor
     *
     * @param name of the current player
     */

    function Player(player) {
        _classCallCheck(this, Player);

        switch (player) {
            case 'current':
                this.name = 1;
                break;
            case 'ennemy':
                this.name = 2;
                break;
        }
    }

    _createClass(Player, [{
        key: 'next',

        /**
         * Next player
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
         * @param tab (array)
         * @return neighboring intersections (array)
         */
        value: function getNeighboringIntersections(tab) {
            var player = arguments[1] === undefined ? 'all' : arguments[1];

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

                if (tab[x] != undefined && tab[x][y] != undefined) {
                    var rock = tab[x][y];
                    if (rock.getPlayer() != 0) {
                        this.cache.push(rock);
                    }
                }
            }

            switch (player) {
                case 'current':
                    player = tab[this.x][this.y].getPlayer();
                    break;
                case 'ennemy':
                    player = (tab[this.x][this.y].getPlayer() + 2) % 2 + 1;
                    break;
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

var Save = (function (_Gameplay) {
    function Save() {
        _classCallCheck(this, Save);

        _get(Object.getPrototypeOf(Save.prototype), 'constructor', this).call(this);
        this.score = [];
    }

    _inherits(Save, _Gameplay);

    return Save;
})(Gameplay);

var Score = function Score() {
    _classCallCheck(this, Score);
};

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

var GoGame = new Game(options);
GoGame.run();

//this.tab[rock.x][rock.y].remove();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2Zha2VfYzEyNTAzYWQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7SUNBTSxPQUFPOzs7Ozs7O0FBTUUsYUFOVCxPQUFPLEdBTUk7OEJBTlgsT0FBTzs7QUFPTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUVuRCxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQzs7QUFFMUQsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLFlBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzRCxZQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRW5ELFlBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElB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Qy9CLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJjbGFzcyBCdWlsZGVye1xuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqLyAgICAgXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuZ3JpZGJvcmRlcldpZHRoID0gb3B0aW9uc1snZ3JpZCddLmJvcmRlcldpZHRoO1xuXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG4gICAgICAgIHRoaXMuZ3JpZFNpemUgPSAocGFyc2VJbnQodGhpcy5ncmlkKSArIDEpICogdGhpcy5jZWxsU2l6ZTtcblxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydnb2JhbiddLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheSA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkID0gU3ByaW50KG9wdGlvbnNbJ2dyaWQnXS5lbGVtZW50KTtcblxuICAgICAgICB0aGlzLmdyaWRDYW52YXMgPSB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0aGlzLmdhbWVwbGF5Q2FudmFzID0gdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdvYmFuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNzcyBzdHlsZSBvZiB0aGUgZ29iYW5cbiAgICAgKi8gIFxuICAgIGJ1aWxkR29iYW4oKXtcbiAgICAgICAgdGhpcy4kZ29iYW4uY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplLFxuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB0aGUgZ2FtZXBsYXkgY2FudmFzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNhbnZhc1xuICAgICAqLyAgXG4gICAgYnVpbGRHYW1lcGxheSgpe1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0ud2lkdGggPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplXG4gICAgICAgIH0pXG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdyaWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gY2FudmFzIHdpdGggYSBncmlkIGRyYXduXG4gICAgICovICBcbiAgICBidWlsZEdyaWQoKXtcblxuICAgICAgICAvLyBTZXQgc2l6ZSBvZiBjYW52YXNcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0ud2lkdGggPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS5oZWlnaHQgPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEluaXQgdGhlIGNhbnZhc1xuICAgICAgICB2YXIgYyA9IHRoaXMuZ3JpZENhbnZhcztcblxuICAgICAgICAvLyBEcmF3IGVhY2ggbGluZXMgb2YgdGhlIGdyaWRcbiAgICAgICAgZm9yKHZhciB4ID0gMTsgeCA8PSB0aGlzLmdyaWQgOyB4Kyspe1xuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGMubW92ZVRvKHRoaXMuY2VsbFNpemUsIHRoaXMuY2VsbFNpemUgKiB4KTtcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xuICAgICAgICAgICAgYy5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IodmFyIHkgPSAxOyB5IDw9IHRoaXMuZ3JpZCA7IHkrKyl7XG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgYy5tb3ZlVG8odGhpcy5jZWxsU2l6ZSAqIHksIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgYy5saW5lVG8odGhpcy5jZWxsU2l6ZSAqIHksIHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gdGhpcy5ncmlkYm9yZGVyV2lkdGg7XG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGFsbCBlbGVtZW50c1xuICAgICAqXG4gICAgICovICBcbiAgICBydW4oKXtcbiAgICAgICAgdGhpcy5idWlsZEdvYmFuKCk7XG4gICAgICAgIHRoaXMuYnVpbGRHYW1lcGxheSgpO1xuICAgICAgICB0aGlzLmJ1aWxkR3JpZCgpO1xuICAgIH1cblxufVxuY2xhc3MgQ2hhaW57XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLnJvY2tzID0gW107XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdhbGl2ZSc7XHJcbiAgICAgICAgdGhpcy5ib3JkZXJzID0gW107XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBhZGRSb2NrKHJvY2spe1xyXG4gICAgXHR0aGlzLnJvY2tzLnB1c2gocm9jayk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgcm9ja3NcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0Um9ja3MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb2Nrcy5zb3J0KCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmVcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgcmVtb3ZlKCl7XHJcbiAgICAgICAgdGhpcy5yb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSAnZGVhZCc7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIGJvcmRlcnMgb2YgdGhlIGNoYWluXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBhcnJheVxyXG4gICAgICovIFxyXG4gICAgZ2V0Qm9yZGVycyhyb2Nrcyl7XHJcblxyXG4gICAgICAgIHZhciBwbGF5ZXIgPSByb2Nrc1t0aGlzLnJvY2tzWzBdLnhdW3RoaXMucm9ja3NbMF0ueV0uZ2V0UGxheWVyKCk7XHJcblxyXG4gICAgICAgIGZvcihsZXQgcm9jayBvZiB0aGlzLnJvY2tzKXtcclxuICAgICAgICAgICAgaWYocm9ja3Nbcm9jay54XVtyb2NrLnldLmdldE5laWdoYm9yaW5nSW50ZXJzZWN0aW9ucyhyb2NrcywgJ2N1cnJlbnQnKS5sZW5ndGggIT0gNCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvcmRlcnMucHVzaChyb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVycy5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB0aGUgdGVycml0b3J5IGlzIGRlYWRcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRydWUgb3IgZmFsc2VcclxuICAgICAqLyBcclxuICAgIGlzRGVhZChyb2Nrcyl7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0TGliZXJ0aWVzKHJvY2tzKTtcclxuXHJcbiAgICAgICAgaWYodGhpcy5saWJlcnRpZXMgPT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGxpYmVydGllcyBvZiB0aGUgdGVycml0b3JpZXNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMubGliZXJ0aWVzIChudW1iZXIpXHJcbiAgICAgKi8gXHJcbiAgICBnZXRMaWJlcnRpZXMocm9ja3Mpe1xyXG5cclxuICAgICAgICAvLyBHZXQgYm9yZGVycyBvZiB0aGUgdGVycml0b3J5XHJcbiAgICAgICAgdGhpcy5saWJlcnRpZXMgPSAwO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGZvcihsZXQgcm9jayBvZiB0aGlzLmdldEJvcmRlcnMocm9ja3MpKXtcclxuICAgICAgICAgICAgaWYocm9ja3Nbcm9jay54XVtyb2NrLnldLmdldE5laWdoYm9yaW5nSW50ZXJzZWN0aW9ucyhyb2NrcykubGVuZ3RoICE9IDQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5saWJlcnRpZXMrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5saWJlcnRpZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5saWJlcnRpZXM7XHJcblxyXG4gICAgfVxyXG5cclxufVxuY2xhc3MgR2FtZXBsYXl7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnNcbiAgICAgKi8gICBcbiAgICBjb25zdHJ1Y3Rvcigpe1xuXG4gICAgICAgIHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudCk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kZ29iYW4uZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcblxuICAgICAgICB0aGlzLnJvY2s7XG4gICAgICAgIHRoaXMucm9ja1NpemUgPSBvcHRpb25zWydyb2NrJ10uc2l6ZTtcbiAgICAgICAgdGhpcy5yb2NrUGxheWVyMSA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIxO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIyID0gb3B0aW9uc1sncm9jayddLnBsYXllcjI7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKCdjdXJyZW50Jyk7XG4gICAgICAgIHRoaXMuZW5uZW15ID0gbmV3IFBsYXllcignZW5uZW15Jyk7XG5cbiAgICAgICAgdGhpcy50YWIgPSBbXTtcbiAgICAgICAgdGhpcy5jaGFpbnMgPSBbXTtcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xuXG4gICAgICAgIGZvcih0aGlzLng9IDE7IHRoaXMueCA8PSB0aGlzLmdyaWQgOyB0aGlzLngrKyl7XG4gICAgICAgICAgICB0aGlzLnRhYlt0aGlzLnhdID0gW107XG4gICAgICAgICAgICBmb3IodGhpcy55ID0gMTsgdGhpcy55IDw9IHRoaXMuZ3JpZCA7IHRoaXMueSsrKXtcbiAgICAgICAgICAgICAgICB0aGlzLnRhYlt0aGlzLnhdW3RoaXMueV0gPSBuZXcgUm9jayh0aGlzLngsIHRoaXMueSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgfVxuXG5cblxuXG4gICAgXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIExpc3RlbiBldmVudCBvbiB0aGUgZ2FtZXBsYXkgKGRpc3BhdGNoZXIpXG4gICAgICpcbiAgICAgKi8gIFxuICAgIGxpc3Rlbm5lcigpe1xuXG4gICAgICAgIC8vIENsaWNrIG9uIHRoZSBnb2JhblxuICAgICAgICBTcHJpbnQodGhpcy4kZ29iYW4pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgdGhpcy5jbGljayhlKTtcbiAgICAgICAgfS5iaW5kKHRoaXMpKTtcblxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxheWVyIGNsaWNrIG9uIHRoZSBnb2JhbiB0byBwdXQgYSByb2NrXG4gICAgICpcbiAgICAgKi8gIFxuICAgIGNsaWNrKGUpe1xuXG4gICAgICAgIC8vIFNldCBjdXJyZW50IHJvY2tcbiAgICAgICAgdGhpcy54ID0gTWF0aC5mbG9vcigoZS5sYXllclggKyB0aGlzLmNlbGxTaXplIC8gMikgLyB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgdGhpcy55ID0gTWF0aC5mbG9vcigoZS5sYXllclkgKyB0aGlzLmNlbGxTaXplIC8gMikgLyB0aGlzLmNlbGxTaXplKTtcblxuICAgICAgICAvLyBJZiB3ZSBhcmUgb24gdGhlIGdvYmFuXG4gICAgICAgIGlmKDEgPD0gdGhpcy54ICYmIHRoaXMueCA8PSB0aGlzLmdyaWQgJiYgMSA8PSB0aGlzLnkgJiYgdGhpcy55IDw9IHRoaXMuZ3JpZCApe1xuICAgICAgICAgICAgdGhpcy5nZXRSb2NrKCk7XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSByb2NrIGNhbiBiZSBwbGFjZWQgaGVyZSwgaGFuZGxlIGFjdGlvbnNcbiAgICAgICAgICAgIGlmKHRoaXMucm9jay5jYW5QbGF5KHRoaXMucGxheWVyLCB0aGlzLnRhYikpe1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIERlYnVnXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJyoqKionKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUGxheWVyICR7dGhpcy5wbGF5ZXIuZ2V0KCl9IGVuICR7dGhpcy54fTske3RoaXMueX1gKTtcblxuICAgICAgICAgICAgICAgIHRoaXMucm9jay5jcmVhdGUodGhpcy5wbGF5ZXIpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Um9jaygpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQ2hhaW5zKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5oYW5kbGVHb2JhbigpO1xuICAgICAgICAgICAgICAgIHRoaXMucGxheWVyLm5leHQoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVubmVteS5uZXh0KCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuICAgIFxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBTYXZlIHRoaXMucm9jayBpbiB0aGlzLnRhYlxuICAgICAqXG4gICAgICovICBcbiAgICBzZXRSb2NrKCl7XG4gICAgICAgIHRoaXMudGFiW3RoaXMueF1bdGhpcy55XSA9IHRoaXMucm9jaztcbiAgICB9XG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIFVzZSB0aGlzLnJvY2sgaW5zdGVhZCBvZiB0aGlzLnRhYlt0aGlzLnhdW3RoaXMueV1cbiAgICAgKlxuICAgICAqLyAgXG4gICAgZ2V0Um9jaygpe1xuICAgICAgICB0aGlzLnJvY2sgPSB0aGlzLnRhYlt0aGlzLnhdW3RoaXMueV07XG4gICAgfVxuXG5cblxuXG4gICAgXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSBjaGFpbnNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgaGFuZGxlQ2hhaW5zKCl7XG5cbiAgICAgICAgLy8gR2V0IG5laWdoYm9yc1xuICAgICAgICB2YXIgbmVpZ2hib3JzID0gdGhpcy5yb2NrLmdldE5laWdoYm9yaW5nSW50ZXJzZWN0aW9ucyh0aGlzLnRhYiwgJ2N1cnJlbnQnKTtcblxuICAgICAgICBpZihuZWlnaGJvcnMubGVuZ3RoICE9IDApe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHZXQgY2hhaW5zIGZyb20gbmVpZ2hib3JpbmdzIGludGVyc2VjdGlvbnMgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNoYWlucyA9IFtdO1xuICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIG5laWdoYm9ycyl7XG4gICAgICAgICAgICAgICAgaWYoY2hhaW5zLmluZGV4T2Yocm9jay5nZXRDaGFpbigpKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNoYWlucy5wdXNoKHJvY2suZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDQVNFIDEgOiBBZGQgdGhlIHJvY2sgdG8gdGhlIGNoYWluXG4gICAgICAgICAgICBpZihjaGFpbnMubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgICAgIHZhciBjaGFpbiA9IGNoYWluc1swXTsgLy8gU2V0IGluZGV4IG9mIHRoZSBjaGFpblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDQVNFIDIgOiBKb2luIGNoYWluc1xuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjaGFpbnMgPSBjaGFpbnMuc29ydCgpO1xuICAgICAgICAgICAgICAgIGxldCBqb2luQ2hhaW4gPSBjaGFpbnNbMF07XG4gICAgICAgICAgICAgICAgZm9yKGxldCBjaGFpbiBvZiBjaGFpbnMucmV2ZXJzZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2hhaW4gIT0gam9pbkNoYWluKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiB0aGlzLmNoYWluc1tjaGFpbl0uZ2V0Um9ja3MoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJbcm9jay54XVtyb2NrLnldLnNldENoYWluKGpvaW5DaGFpbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFpbnNbam9pbkNoYWluXS5hZGRSb2NrKHJvY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFpbnNbY2hhaW5dLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNoYWluID0gam9pbkNoYWluOyAvLyBTZXQgaW5kZXggb2YgdGhlIGNoYWluXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDQVNFIDMgOiBDcmVhdGUgbmV3IGNoYWluXG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2YXIgY2hhaW4gPSB0aGlzLmNoYWlucy5sZW5ndGg7IC8vIFNldCBpbmRleCBvZiB0aGUgY2hhaW5cbiAgICAgICAgICAgIHRoaXMuY2hhaW5zW2NoYWluXSA9IG5ldyBDaGFpbigpOyAvLyBDcmVhdGUgbmV3IGNoYWluIG9iamVjdFxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGN1cnJlbnQgcm9jayB0byB0aGUgY2hhaW5cbiAgICAgICAgdmFyIHJvY2sgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLnJvY2sueCxcbiAgICAgICAgICAgIHk6IHRoaXMucm9jay55XG4gICAgICAgIH07ICAgICAgICBcbiAgICAgICAgdGhpcy5jaGFpbnNbY2hhaW5dLmFkZFJvY2socm9jayk7XG4gICAgICAgIHRoaXMudGFiW3RoaXMueF1bdGhpcy55XS5zZXRDaGFpbihjaGFpbik7XG5cbiAgICB9XG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgZ29iYW4gd2l0aCB0aGUgbmV3IHRlcnJpdG9yaWVzXG4gICAgICpcbiAgICAgKi8gIFxuICAgIGhhbmRsZUdvYmFuKCl7XG5cbiAgICAgICAgdmFyIG5laWdoYm9ycyA9IHRoaXMucm9jay5nZXROZWlnaGJvcmluZ0ludGVyc2VjdGlvbnModGhpcy50YWIsICdlbm5lbXknKTtcblxuICAgICAgICBpZihuZWlnaGJvcnMubGVuZ3RoICE9IDApe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHZXQgY2hhaW5zIGZyb20gbmVpZ2hib3JpbmdzIGludGVyc2VjdGlvbnMgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNoYWlucyA9IFtdO1xuICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIG5laWdoYm9ycyl7XG4gICAgICAgICAgICAgICAgaWYoY2hhaW5zLmluZGV4T2Yocm9jay5nZXRDaGFpbigpKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNoYWlucy5wdXNoKHJvY2suZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IobGV0IGNoYWluIG9mIGNoYWlucyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jaGFpbnNbY2hhaW5dLmlzRGVhZCh0aGlzLnRhYikpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRGVhZCcpO1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHJvY2sgb2YgdGhpcy5jaGFpbnNbY2hhaW5dLmdldFJvY2tzKCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgLy90aGlzLnRhYltyb2NrLnhdW3JvY2sueV0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIEdhbWV7XG5cbiAgICAvKipcbiAgICAgKiBJbml0IG9wdGlvbnNcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJheSBvcHRpb25zIChvcHRpb25hbClcbiAgICAgKiBAcmV0dXJuIFxuICAgICAqLyAgICAgXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogUnVuIHRoZSBnYW1lXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHJ1bigpe1xuXG4gICAgICAgIC8vIEJ1aWxkZXJcbiAgICAgICAgdmFyIEdhbWVCdWlsZGVyID0gbmV3IEJ1aWxkZXIoKTtcbiAgICAgICAgR2FtZUJ1aWxkZXIucnVuKCk7XG5cbiAgICAgICAgLy8gR2FtZXBsYXlcbiAgICAgICAgdmFyIEdhbWVHYW1lcGxheSA9IG5ldyBHYW1lcGxheSgpO1xuICAgICAgICBHYW1lR2FtZXBsYXkubGlzdGVubmVyKCk7XG5cbiAgICB9XG59XG5jbGFzcyBQbGF5ZXJ7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IocGxheWVyKXtcclxuICAgICAgICBzd2l0Y2gocGxheWVyKXtcclxuICAgICAgICAgICAgY2FzZSAnY3VycmVudCc6IFxyXG4gICAgICAgICAgICAgICAgdGhpcy5uYW1lID0gMTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdlbm5lbXknOiBcclxuICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IDI7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOZXh0IHBsYXllclxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBuZXh0KCl7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gKCh0aGlzLm5hbWUrKykgJSAyKSArIDE7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgcGxheWVyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLm5hbWVcclxuICAgICAqLyAgXHJcbiAgICBnZXQoKXtcclxuICAgIFx0cmV0dXJuIHRoaXMubmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAgICAgXHJcbn1cbmNsYXNzIFJvY2t7XHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHggYW5kIHkgKG51bWJlcilcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IoeCwgeSl7XHJcblxyXG4gICAgICAgIHRoaXMuY2hhaW4gPSAwO1xyXG4gICAgICAgIHRoaXMueCA9IHg7XHJcbiAgICAgICAgdGhpcy55ID0geTtcclxuICAgICAgICB0aGlzLnBsYXllciA9IDA7XHJcbiAgICAgICAgdGhpcy5jb2xvcjtcclxuXHJcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcclxuICAgICAgICB0aGlzLnJvY2tTaXplID0gb3B0aW9uc1sncm9jayddLnNpemU7XHJcbiAgICAgICAgdGhpcy5jYW52YXMgPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KS5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcclxuXHJcbiAgICAgICAgdGhpcy5jaGFpbnM7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIFxyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB3ZSBhcmUgaW4gYSBjYXNlIG9mIHN1aWNpZGVcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgY2hlY2tTdWljaWRlKCl7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDaGVjayBpZiB3ZSBhcmUgaW4gYSBjYXNlIG9mIEtPXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGNoZWNrS08oKXtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgdGhlIHBsYXllciBjYW4gcGxheSBoZXJlXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGNhblBsYXkocGxheWVyLCB0YWIpe1xyXG5cclxuICAgICAgICBpZighdGhpcy5jaGVja1N1aWNpZGUoKSAmJiAhdGhpcy5jaGVja0tPKCkgJiYgdGhpcy5nZXRQbGF5ZXIoKSA9PSAwKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIFxyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSByb2NrXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGNyZWF0ZShwbGF5ZXIpe1xyXG5cclxuICAgICAgICAvLyBTZXQgcGxheWVyXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXIuZ2V0KCk7XHJcblxyXG4gICAgICAgIC8vIFNldCBjb2xvclxyXG4gICAgICAgIHRoaXMuY29sb3IgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMTtcclxuICAgICAgICBpZih0aGlzLnBsYXllciA9PSAyKXtcclxuICAgICAgICAgICAgdGhpcy5jb2xvciA9ICBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIERyYXdcclxuICAgICAgICB2YXIgYyA9IHRoaXMuY2FudmFzO1xyXG4gICAgICAgIGMuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgYy5hcmModGhpcy54ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy55ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy5yb2NrU2l6ZSAvIDIsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICAgICAgYy5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjLmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgYy5maWxsKCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgXHJcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBuZWlnaGJvcmluZyBpbnRlcnNlY3Rpb25zXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHRhYiAoYXJyYXkpXHJcbiAgICAgKiBAcmV0dXJuIG5laWdoYm9yaW5nIGludGVyc2VjdGlvbnMgKGFycmF5KVxyXG4gICAgICovICBcclxuICAgIGdldE5laWdoYm9yaW5nSW50ZXJzZWN0aW9ucyh0YWIsIHBsYXllciA9ICdhbGwnKXtcclxuXHJcbiAgICAgICAgdGhpcy5uZWlnaGJvcmluZ0ludGVyc2VjdGlvbnMgPSBbXTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaT0xIDsgaSA8PSA0IDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIGxldCB5ID0gdGhpcy55O1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoKGkpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHkgPSB5IC0gMTsgLy8gdG9wXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHgrKzsgLy8gcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgeSsrOyAvLyBib3R0b21cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IHggLSAxOyAvLyBsZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHRhYlt4XSAhPSB1bmRlZmluZWQgJiYgdGFiW3hdW3ldICE9IHVuZGVmaW5lZCl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm9jayA9IHRhYlt4XVt5XTtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2suZ2V0UGxheWVyKCkgIT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBzd2l0Y2gocGxheWVyKXtcclxuICAgICAgICAgICAgY2FzZSAnY3VycmVudCc6XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSB0YWJbdGhpcy54XVt0aGlzLnldLmdldFBsYXllcigpO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIGNhc2UgJ2VubmVteSc6XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSAoKHRhYlt0aGlzLnhdW3RoaXMueV0uZ2V0UGxheWVyKCkgKyAyKSAlIDIpICsgMTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGxheWVyICE9ICdhbGwnKXtcclxuICAgICAgICAgICAgZm9yKGxldCBpIGluIHRoaXMuY2FjaGUpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvY2sgPSB0aGlzLmNhY2hlW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYocm9jay5nZXRQbGF5ZXIoKSA9PSBwbGF5ZXIpe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmVpZ2hib3JpbmdJbnRlcnNlY3Rpb25zLnB1c2gocm9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5uZWlnaGJvcmluZ0ludGVyc2VjdGlvbnMgPSB0aGlzLmNhY2hlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JpbmdJbnRlcnNlY3Rpb25zLnNvcnQoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgXHJcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgcGxheWVyIFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5wbGF5ZXJcclxuICAgICAqLyAgXHJcbiAgICBnZXRQbGF5ZXIoKXsgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYXllcjtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGNoYWluIFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjaGFpbiAobnVtYmVyKVxyXG4gICAgICovICBcclxuICAgIHNldENoYWluKGNoYWluKXsgIFxyXG4gICAgICAgIHRoaXMuY2hhaW4gPSBjaGFpbjsgXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBjaGFpbiBcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMuY2hhaW5cclxuICAgICAqLyAgXHJcbiAgICBnZXRDaGFpbigpeyAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW47XHJcbiAgICB9XHJcblxyXG59XHJcblxuY2xhc3MgU2F2ZSBleHRlbmRzIEdhbWVwbGF5e1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICBcdHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc2NvcmUgPSBbXTtcbiAgICB9XG5cbn1cbmNsYXNzIFNjb3Jle1xuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgfVxufVxuXG4vKipcbiAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cbiAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EsIFRIw6lvIEtudXR6IGV0IEzDqW8gTGUgQnJhc1xuICogSEVUSUMgUDIwMTlcbiAqXG4gKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVsZXIpXG4gKlxuICogQ29weXJpZ2h0IDIwMTVcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICpcbiAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gKi9cblxudmFyIG9wdGlvbnMgPSB7XG4gICAgZ29iYW46IHtcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuJ1xuICAgIH0sXG4gICAgZ2FtZXBsYXk6IHtcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuX2dhbWVwbGF5J1xuICAgIH0sXG4gICAgZ3JpZDoge1xuICAgICAgICBuYnJlOiAnMTknLFxuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW5fZ3JpZCcsXG4gICAgICAgIGNlbGxTaXplOiA0MCxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICAgICAgICBib3JkZXJDb2xvcjogJ2JsYWNrJyxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDJcbiAgICB9LFxuICAgIHJvY2s6e1xuICAgICAgICBzaXplOiAyMCxcbiAgICAgICAgcGxheWVyMTogJ2dyZXknLFxuICAgICAgICBwbGF5ZXIyOiAnYmxhY2snXG4gICAgfVxufTtcblxudmFyIEdvR2FtZSA9IG5ldyBHYW1lKG9wdGlvbnMpO1xuR29HYW1lLnJ1bigpO1xuIl19
