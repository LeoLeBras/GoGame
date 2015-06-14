(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function GoGame() {
    var GameBuilder = new Builder();
    GameBuilder.run();
    var GameGameplay = new Gameplay();
    GameGameplay.listenner();
}

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
        key: 'switchPlayers',
        value: function switchPlayers() {

            this.player.next();
            this.ennemy.next();
        }
    }, {
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

            // If the player can play here
            if (1 <= this.x && this.x <= this.grid && 1 <= this.y && this.y <= this.grid && rocks[this.x][this.y].getPlayer() == 0) {

                // Debug
                console.log('****');
                console.log('Player ' + this.player.get() + ' en ' + this.x + ';' + this.y);

                rocks[this.x][this.y].create(this.player);
                this.handleChains();
                this.handleGoban();
                this.switchPlayers();
            }
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
            var neighbors = rocks[this.x][this.y].getNeighboringRocks('current');

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
                x: this.x,
                y: this.y
            };
            this.chains[chain].addRock(rock);
            rocks[this.x][this.y].setChain(chain);
        }
    }, {
        key: 'handleGoban',

        /**
         * Handle the goban with the new chain
         *
         */
        value: function handleGoban() {

            var neighbors = rocks[this.x][this.y].getNeighboringRocks('ennemy');

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

                        if (this.chains[chain].getLiberties() == 0) {
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

var Save = function Save() {
    _classCallCheck(this, Save);
};

var Score = function Score() {
    _classCallCheck(this, Score);
};

var GameplayDispatcher = (function () {
    function GameplayDispatcher() {
        _classCallCheck(this, GameplayDispatcher);

        this.$goban = Sprint(options['gameplay'].element);
        var Gameplay = new GameplayActions();
        this.listenner();
    }

    _createClass(GameplayDispatcher, [{
        key: 'listenner',
        value: function listenner() {

            Sprint(this.$goban).on('click', (function (e) {
                if (Gameplay.click(e)) {
                    Gameplay.handleChain();
                    Gameplay.handleGoban();
                    Gameplay.switchPlayers();
                }
            }).bind(this));
        }
    }]);

    return GameplayDispatcher;
})();

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

                    if (rocks[rock.x][rock.y].getNeighboringRocks(rocks, 'current').length != 4) {
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
        key: 'getLiberties',

        /**
         * Get liberties of the territories
         *
         * @return this.liberties (number)
         */
        value: function getLiberties() {
            var param = arguments[0] === undefined ? 'objects' : arguments[0];

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

var player = 'dd';

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
            var select = arguments[0] === undefined ? 'current' : arguments[0];

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
        key: 'getNeighboringRocks',

        /* ------------------------------------- */

        /**
         * Get neighboring rocks
         *
         * @param select (string)
         * @return neighboring rocks (array)
         */
        value: function getNeighboringRocks() {
            var select = arguments[0] === undefined ? 'all' : arguments[0];

            this.neighboringRocks = [];
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

            if (select != 'all') {
                var _player = (rocks[this.x][this.y].getPlayer() + 2) % 2 + 1;
                if (select == 'current') {
                    _player = rocks[this.x][this.y].getPlayer();
                }

                for (var i in this.cache) {
                    var rock = this.cache[i];
                    if (rock.getPlayer() == _player) {
                        this.neighboringRocks.push(rock);
                    }
                }
            } else {
                this.neighboringRocks = this.cache;
            }

            return this.neighboringRocks.sort();
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

GoGame();

//this.tab[rock.x][rock.y].remove();

//this.liberties += rocks[rock.x][rock.y].getLiberties();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2Zha2VfZGE5NWNmNDguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxTQUFTLE1BQU0sR0FBRTtBQUNiLFFBQUksV0FBVyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDaEMsZUFBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksWUFBWSxHQUFHLElBQUksUUFBUSxFQUFFLENBQUM7QUFDbEMsZ0JBQVksQ0FBQyxTQUFTLEVBQUUsQ0FBQztDQUM1Qjs7SUFDSyxPQUFPOzs7Ozs7O0FBTUUsYUFOVCxPQUFPLEdBTUk7OEJBTlgsT0FBTzs7QUFPTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUVuRCxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQzs7QUFFMUQsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLFlBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMs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O2VBWU8sb0JBQUU7QUFDTixtQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3JCOzs7V0FsTEMsSUFBSTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxTVYsSUFBSSxPQUFPLEdBQUc7QUFDVixTQUFLLEVBQUU7QUFDSCxlQUFPLEVBQUUsYUFBYTtLQUN6QjtBQUNELFlBQVEsRUFBRTtBQUNOLGVBQU8sRUFBRSxzQkFBc0I7S0FDbEM7QUFDRCxRQUFJLEVBQUU7QUFDRixZQUFJLEVBQUUsSUFBSTtBQUNWLGVBQU8sRUFBRSxrQkFBa0I7QUFDM0IsZ0JBQVEsRUFBRSxFQUFFO0FBQ1osdUJBQWUsRUFBRSxPQUFPO0FBQ3hCLG1CQUFXLEVBQUUsT0FBTztBQUNwQixtQkFBVyxFQUFFLENBQUM7S0FDakI7QUFDRCxRQUFJLEVBQUM7QUFDRCxZQUFJLEVBQUUsRUFBRTtBQUNSLGVBQU8sRUFBRSxNQUFNO0FBQ2YsZUFBTyxFQUFFLE9BQU87S0FDbkI7Q0FDSixDQUFDOztBQUVGLE1BQU0sRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIEdvR2FtZSgpe1xuICAgIHZhciBHYW1lQnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gICAgR2FtZUJ1aWxkZXIucnVuKCk7XG4gICAgdmFyIEdhbWVHYW1lcGxheSA9IG5ldyBHYW1lcGxheSgpO1xuICAgIEdhbWVHYW1lcGxheS5saXN0ZW5uZXIoKTtcbn1cbmNsYXNzIEJ1aWxkZXJ7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICovICAgICBcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcbiAgICAgICAgdGhpcy5ncmlkYm9yZGVyV2lkdGggPSBvcHRpb25zWydncmlkJ10uYm9yZGVyV2lkdGg7XG5cbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcbiAgICAgICAgdGhpcy5ncmlkU2l6ZSA9IChwYXJzZUludCh0aGlzLmdyaWQpICsgMSkgKiB0aGlzLmNlbGxTaXplO1xuXG4gICAgICAgIHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2dvYmFuJ10uZWxlbWVudCk7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5ID0gU3ByaW50KG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudCk7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQgPSBTcHJpbnQob3B0aW9uc1snZ3JpZCddLmVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuZ3JpZENhbnZhcyA9IHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIHRoaXMuZ2FtZXBsYXlDYW52YXMgPSB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB9XG5cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB0aGUgZ29iYW5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gY3NzIHN0eWxlIG9mIHRoZSBnb2JhblxuICAgICAqLyAgXG4gICAgYnVpbGRHb2Jhbigpe1xuICAgICAgICB0aGlzLiRnb2Jhbi5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBnYW1lcGxheSBjYW52YXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4gY2FudmFzXG4gICAgICovICBcbiAgICBidWlsZEdhbWVwbGF5KCl7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS5oZWlnaHQgPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcbiAgICAgICAgfSlcbiAgICB9XG5cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB0aGUgZ3JpZFxuICAgICAqXG4gICAgICogQHJldHVybiBjYW52YXMgd2l0aCBhIGdyaWQgZHJhd25cbiAgICAgKi8gIFxuICAgIGJ1aWxkR3JpZCgpe1xuXG4gICAgICAgIC8vIFNldCBzaXplIG9mIGNhbnZhc1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLmhlaWdodCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gSW5pdCB0aGUgY2FudmFzXG4gICAgICAgIHZhciBjID0gdGhpcy5ncmlkQ2FudmFzO1xuXG4gICAgICAgIC8vIERyYXcgZWFjaCBsaW5lcyBvZiB0aGUgZ3JpZFxuICAgICAgICBmb3IodmFyIHggPSAxOyB4IDw9IHRoaXMuZ3JpZCA7IHgrKyl7XG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgYy5tb3ZlVG8odGhpcy5jZWxsU2l6ZSwgdGhpcy5jZWxsU2l6ZSAqIHgpO1xuICAgICAgICAgICAgYy5saW5lVG8odGhpcy5ncmlkU2l6ZSAtIHRoaXMuY2VsbFNpemUsIHRoaXMuY2VsbFNpemUgKiB4KTtcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gdGhpcy5ncmlkYm9yZGVyV2lkdGg7XG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIgeSA9IDE7IHkgPD0gdGhpcy5ncmlkIDsgeSsrKXtcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplICogeSwgdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICBjLmxpbmVUbyh0aGlzLmNlbGxTaXplICogeSwgdGhpcy5ncmlkU2l6ZSAtIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgYy5saW5lV2lkdGggPSB0aGlzLmdyaWRib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgYWxsIGVsZW1lbnRzXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHJ1bigpe1xuICAgICAgICB0aGlzLmJ1aWxkR29iYW4oKTtcbiAgICAgICAgdGhpcy5idWlsZEdhbWVwbGF5KCk7XG4gICAgICAgIHRoaXMuYnVpbGRHcmlkKCk7XG4gICAgfVxuXG59XG5jbGFzcyBHYW1lcGxheXtcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9uc1xuICAgICAqLyAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRnb2Jhbi5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuXG4gICAgICAgIHRoaXMucm9jaztcbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIxID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcblxuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoJ2N1cnJlbnQnKTtcbiAgICAgICAgdGhpcy5lbm5lbXkgPSBuZXcgUGxheWVyKCdlbm5lbXknKTtcblxuICAgICAgICB0aGlzLmNoYWlucyA9IFtdO1xuICAgICAgICB0aGlzLmNhY2hlID0gW107XG5cbiAgICAgICAgZm9yKHRoaXMueD0gMTsgdGhpcy54IDw9IHRoaXMuZ3JpZCA7IHRoaXMueCsrKXtcbiAgICAgICAgICAgIHJvY2tzW3RoaXMueF0gPSBbXTtcbiAgICAgICAgICAgIGZvcih0aGlzLnkgPSAxOyB0aGlzLnkgPD0gdGhpcy5ncmlkIDsgdGhpcy55Kyspe1xuICAgICAgICAgICAgICAgIHJvY2tzW3RoaXMueF1bdGhpcy55XSA9IG5ldyBSb2NrKHRoaXMueCwgdGhpcy55KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICB9XG5cblxuc3dpdGNoUGxheWVycygpe1xuXG4gICAgICAgICAgICB0aGlzLnBsYXllci5uZXh0KCk7XG4gICAgICAgICAgICB0aGlzLmVubmVteS5uZXh0KCk7XG59XG5cblxuICAgIFxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gZXZlbnQgb24gdGhlIGdhbWVwbGF5IChkaXNwYXRjaGVyKVxuICAgICAqXG4gICAgICovICBcbiAgICBsaXN0ZW5uZXIoKXtcblxuICAgICAgICAvLyBDbGljayBvbiB0aGUgZ29iYW5cbiAgICAgICAgU3ByaW50KHRoaXMuJGdvYmFuKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHRoaXMuY2xpY2soZSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogVGhlIHBsYXllciBjbGljayBvbiB0aGUgZ29iYW4gdG8gcHV0IGEgcm9ja1xuICAgICAqXG4gICAgICovICBcbiAgICBjbGljayhlKXtcblxuICAgICAgICAvLyBTZXQgY3VycmVudCByb2NrXG4gICAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IoKGUubGF5ZXJYICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IoKGUubGF5ZXJZICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG5cbiAgICAgICAgLy8gSWYgdGhlIHBsYXllciBjYW4gcGxheSBoZXJlXG4gICAgICAgIGlmKDEgPD0gdGhpcy54ICYmIHRoaXMueCA8PSB0aGlzLmdyaWQgJiYgMSA8PSB0aGlzLnkgJiYgdGhpcy55IDw9IHRoaXMuZ3JpZCAmJiByb2Nrc1t0aGlzLnhdW3RoaXMueV0uZ2V0UGxheWVyKCkgPT0gMCl7XG5cbiAgICAgICAgICAgIC8vIERlYnVnXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnKioqKicpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFBsYXllciAke3RoaXMucGxheWVyLmdldCgpfSBlbiAke3RoaXMueH07JHt0aGlzLnl9YCk7XG5cbiAgICAgICAgICAgIHJvY2tzW3RoaXMueF1bdGhpcy55XS5jcmVhdGUodGhpcy5wbGF5ZXIpO1xuICAgICAgICAgICAgdGhpcy5oYW5kbGVDaGFpbnMoKTtcbiAgICAgICAgICAgIHRoaXMuaGFuZGxlR29iYW4oKTtcbiAgICAgICAgICAgIHRoaXMuc3dpdGNoUGxheWVycygpO1xuXG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cbiAgICBcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIGNoYWluc1xuICAgICAqXG4gICAgICovICBcbiAgICBoYW5kbGVDaGFpbnMoKXtcblxuICAgICAgICAvLyBHZXQgbmVpZ2hib3JzXG4gICAgICAgIHZhciBuZWlnaGJvcnMgPSByb2Nrc1t0aGlzLnhdW3RoaXMueV0uZ2V0TmVpZ2hib3JpbmdSb2NrcygnY3VycmVudCcpO1xuXG4gICAgICAgIGlmKG5laWdoYm9ycy5sZW5ndGggIT0gMCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEdldCBjaGFpbnMgZnJvbSBuZWlnaGJvcmluZ3MgaW50ZXJzZWN0aW9ucyAgICAgICAgXG4gICAgICAgICAgICBsZXQgY2hhaW5zID0gW107XG4gICAgICAgICAgICBmb3IobGV0IHJvY2sgb2YgbmVpZ2hib3JzKXtcbiAgICAgICAgICAgICAgICBpZihjaGFpbnMuaW5kZXhPZihyb2NrLmdldENoYWluKCkpID09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW5zLnB1c2gocm9jay5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENBU0UgMSA6IEFkZCB0aGUgcm9jayB0byB0aGUgY2hhaW5cbiAgICAgICAgICAgIGlmKGNoYWlucy5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgICAgICAgdmFyIGNoYWluID0gY2hhaW5zWzBdOyAvLyBTZXQgaW5kZXggb2YgdGhlIGNoYWluXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENBU0UgMiA6IEpvaW4gY2hhaW5zXG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGNoYWlucyA9IGNoYWlucy5zb3J0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGpvaW5DaGFpbiA9IGNoYWluc1swXTtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGNoYWluIG9mIGNoYWlucy5yZXZlcnNlKCkpe1xuICAgICAgICAgICAgICAgICAgICBpZihjaGFpbiAhPSBqb2luQ2hhaW4pe1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIHRoaXMuY2hhaW5zW2NoYWluXS5nZXRSb2NrcygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2Nrc1tyb2NrLnhdW3JvY2sueV0uc2V0Q2hhaW4oam9pbkNoYWluKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYWluc1tqb2luQ2hhaW5dLmFkZFJvY2socm9jayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYWluc1tjaGFpbl0ucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2hhaW4gPSBqb2luQ2hhaW47IC8vIFNldCBpbmRleCBvZiB0aGUgY2hhaW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENBU0UgMyA6IENyZWF0ZSBuZXcgY2hhaW5cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZhciBjaGFpbiA9IHRoaXMuY2hhaW5zLmxlbmd0aDsgLy8gU2V0IGluZGV4IG9mIHRoZSBjaGFpblxuICAgICAgICAgICAgdGhpcy5jaGFpbnNbY2hhaW5dID0gbmV3IENoYWluKCk7IC8vIENyZWF0ZSBuZXcgY2hhaW4gb2JqZWN0XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgY3VycmVudCByb2NrIHRvIHRoZSBjaGFpblxuICAgICAgICB2YXIgcm9jayA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMueCxcbiAgICAgICAgICAgIHk6IHRoaXMueVxuICAgICAgICB9OyAgICAgICAgXG4gICAgICAgIHRoaXMuY2hhaW5zW2NoYWluXS5hZGRSb2NrKHJvY2spO1xuICAgICAgICByb2Nrc1t0aGlzLnhdW3RoaXMueV0uc2V0Q2hhaW4oY2hhaW4pO1xuXG4gICAgfVxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGdvYmFuIHdpdGggdGhlIG5ldyBjaGFpblxuICAgICAqXG4gICAgICovICBcbiAgICBoYW5kbGVHb2Jhbigpe1xuXG4gICAgICAgIHZhciBuZWlnaGJvcnMgPSByb2Nrc1t0aGlzLnhdW3RoaXMueV0uZ2V0TmVpZ2hib3JpbmdSb2NrcygnZW5uZW15Jyk7XG5cbiAgICAgICAgaWYobmVpZ2hib3JzLmxlbmd0aCAhPSAwKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gR2V0IGNoYWlucyBmcm9tIG5laWdoYm9yaW5ncyBpbnRlcnNlY3Rpb25zICAgICAgICBcbiAgICAgICAgICAgIGxldCBjaGFpbnMgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKGNoYWlucy5pbmRleE9mKHJvY2suZ2V0Q2hhaW4oKSkgPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBjaGFpbnMucHVzaChyb2NrLmdldENoYWluKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGxldCBjaGFpbiBvZiBjaGFpbnMpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2hhaW5zW2NoYWluXS5nZXRMaWJlcnRpZXMoKSA9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0RlYWQnKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIHRoaXMuY2hhaW5zW2NoYWluXS5nZXRSb2NrcygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy50YWJbcm9jay54XVtyb2NrLnldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBTYXZle1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICB9XG5cbn1cbmNsYXNzIFNjb3Jle1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICB9XG4gICAgXG59XG5cbmNsYXNzIEdhbWVwbGF5RGlzcGF0Y2hlcntcclxuXHRcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICBcdHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudCk7XHJcbiAgICBcdHZhciBHYW1lcGxheSA9IG5ldyBHYW1lcGxheUFjdGlvbnMoKTtcclxuICAgIFx0dGhpcy5saXN0ZW5uZXIoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgbGlzdGVubmVyKCl7XHJcblxyXG4gICAgXHRTcHJpbnQodGhpcy4kZ29iYW4pLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xyXG4gICAgICAgICAgICBpZihHYW1lcGxheS5jbGljayhlKSl7XHJcbiAgICAgICAgICAgIFx0R2FtZXBsYXkuaGFuZGxlQ2hhaW4oKTtcclxuICAgICAgICAgICAgXHRHYW1lcGxheS5oYW5kbGVHb2JhbigpO1xyXG4gICAgICAgICAgICBcdEdhbWVwbGF5LnN3aXRjaFBsYXllcnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0uYmluZCh0aGlzKSk7XHJcblxyXG4gICAgfVxyXG5cclxufVxudmFyIGNoYWlucyA9IFtdO1xyXG5cclxuY2xhc3MgQ2hhaW57XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5yb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYm9yZGVyID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBbXTtcclxuICAgICAgICB0aGlzLnN0YXRlID0gJ2FsaXZlJztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCByb2NrXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGFkZFJvY2socm9jayl7XHJcbiAgICBcdHRoaXMucm9ja3MucHVzaChyb2NrKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCByb2Nrc1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBnZXRSb2Nrcygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvY2tzLnNvcnQoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhIGNoYWluXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIHJlbW92ZSgpe1xyXG4gICAgICAgIHRoaXMucm9ja3MgPSBbXTtcclxuICAgICAgICB0aGlzLnN0YXRlID0gJ2RlYWQnO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBib3JkZXJzIG9mIHRoZSBjaGFpblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gYXJyYXlcclxuICAgICAqLyBcclxuICAgIGdldEJvcmRlcnMocGFyYW0gPSAnb2JqZWN0cycpe1xyXG5cclxuICAgICAgICB2YXIgcGxheWVyID0gcm9ja3NbdGhpcy5yb2Nrc1swXS54XVt0aGlzLnJvY2tzWzBdLnldLmdldFBsYXllcigpO1xyXG5cclxuICAgICAgICBmb3IobGV0IHJvY2sgb2YgdGhpcy5yb2Nrcyl7XHJcbiAgICAgICAgICAgIGlmKHJvY2tzW3JvY2sueF1bcm9jay55XS5nZXROZWlnaGJvcmluZ1JvY2tzKHJvY2tzLCAnY3VycmVudCcpLmxlbmd0aCAhPSA0KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyLnB1c2gocm9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHBhcmFtID09ICdjb3VudCcpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib3JkZXIubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVyLnNvcnQoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBsaWJlcnRpZXMgb2YgdGhlIHRlcnJpdG9yaWVzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLmxpYmVydGllcyAobnVtYmVyKVxyXG4gICAgICovIFxyXG4gICAgZ2V0TGliZXJ0aWVzKHBhcmFtID0gJ29iamVjdHMnKXtcclxuXHJcbiAgICAgICAgLy8gR2V0IGJvcmRlcnMgb2YgdGhlIHRlcnJpdG9yeVxyXG4gICAgICAgIHRoaXMubGliZXJ0aWVzID0gMDtcclxuICAgICAgICBcclxuICAgICAgICBmb3IobGV0IHJvY2sgb2YgdGhpcy5nZXRCb3JkZXJzKHJvY2tzKSl7XHJcbiAgICAgICAgICAgIC8vdGhpcy5saWJlcnRpZXMgKz0gcm9ja3Nbcm9jay54XVtyb2NrLnldLmdldExpYmVydGllcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5saWJlcnRpZXMpO1xyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5saWJlcnRpZXM7XHJcblxyXG4gICAgfVxyXG5cclxufVxudmFyIHBsYXllciA9ICdkZCc7XHJcblxyXG5jbGFzcyBQbGF5ZXJ7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IocGxheWVyKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSAxO1xyXG4gICAgICAgIGlmKHBsYXllciA9PSAnZW5uZW15Jyl7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IDI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU3dpdGNoIHRvIHRoZSBuZXh0IHBsYXllclxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBuZXh0KCl7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gKCh0aGlzLm5hbWUrKykgJSAyKSArIDE7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgcGxheWVyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLm5hbWVcclxuICAgICAqLyAgXHJcbiAgICBnZXQoc2VsZWN0ID0gJ2N1cnJlbnQnKXtcclxuICAgIFx0cmV0dXJuIHRoaXMubmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAgICAgXHJcbn1cbnZhciByb2NrcyA9IFtdO1xyXG5cclxuY2xhc3MgUm9ja3tcclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geCBhbmQgeSAobnVtYmVyKVxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3Rvcih4LCB5KXtcclxuXHJcbiAgICAgICAgdGhpcy5jaGFpbiA9IDA7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gMDtcclxuICAgICAgICB0aGlzLmNvbG9yO1xyXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XHJcbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gU3ByaW50KG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudCkuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XHJcbiAgICAgICAgdGhpcy5jaGFpbnM7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIFxyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDcmVhdGUgYSByb2NrXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGNyZWF0ZShwbGF5ZXIpe1xyXG5cclxuICAgICAgICAvLyBTZXQgcGxheWVyXHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBwbGF5ZXIuZ2V0KCk7XHJcblxyXG4gICAgICAgIC8vIFNldCBjb2xvclxyXG4gICAgICAgIHRoaXMuY29sb3IgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMTtcclxuICAgICAgICBpZih0aGlzLnBsYXllciA9PSAyKXtcclxuICAgICAgICAgICAgdGhpcy5jb2xvciA9ICBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIERyYXdcclxuICAgICAgICB2YXIgYyA9IHRoaXMuY2FudmFzO1xyXG4gICAgICAgIGMuYmVnaW5QYXRoKCk7XHJcbiAgICAgICAgYy5hcmModGhpcy54ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy55ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy5yb2NrU2l6ZSAvIDIsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XHJcbiAgICAgICAgYy5jbG9zZVBhdGgoKTtcclxuICAgICAgICBjLmZpbGxTdHlsZSA9IHRoaXMuY29sb3I7XHJcbiAgICAgICAgYy5maWxsKCk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgXHJcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBuZWlnaGJvcmluZyByb2Nrc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzZWxlY3QgKHN0cmluZylcclxuICAgICAqIEByZXR1cm4gbmVpZ2hib3Jpbmcgcm9ja3MgKGFycmF5KVxyXG4gICAgICovICBcclxuICAgIGdldE5laWdoYm9yaW5nUm9ja3Moc2VsZWN0ID0gJ2FsbCcpe1xyXG5cclxuICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MgPSBbXTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaT0xIDsgaSA8PSA0IDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIGxldCB5ID0gdGhpcy55O1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoKGkpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHkgPSB5IC0gMTsgLy8gdG9wXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHgrKzsgLy8gcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgeSsrOyAvLyBib3R0b21cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IHggLSAxOyAvLyBsZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKHJvY2tzW3hdICE9IHVuZGVmaW5lZCAmJiByb2Nrc1t4XVt5XSAhPSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvY2sgPSByb2Nrc1t4XVt5XTtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2suZ2V0UGxheWVyKCkgIT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzZWxlY3QgIT0gJ2FsbCcpe1xyXG4gICAgICAgICAgICBsZXQgcGxheWVyID0gKChyb2Nrc1t0aGlzLnhdW3RoaXMueV0uZ2V0UGxheWVyKCkgKyAyKSAlIDIpICsgMTtcclxuICAgICAgICAgICAgaWYoc2VsZWN0ID09ICdjdXJyZW50Jyl7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSByb2Nrc1t0aGlzLnhdW3RoaXMueV0uZ2V0UGxheWVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgaSBpbiB0aGlzLmNhY2hlKXtcclxuICAgICAgICAgICAgICAgIGxldCByb2NrID0gdGhpcy5jYWNoZVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2suZ2V0UGxheWVyKCkgPT0gcGxheWVyKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MucHVzaChyb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MgPSB0aGlzLmNhY2hlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JpbmdSb2Nrcy5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIFxyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHBsYXllciBcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMucGxheWVyXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0UGxheWVyKCl7ICBcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXI7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBjaGFpbiBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2hhaW4gKG51bWJlcilcclxuICAgICAqLyAgXHJcbiAgICBzZXRDaGFpbihjaGFpbil7ICBcclxuICAgICAgICB0aGlzLmNoYWluID0gY2hhaW47IFxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgY2hhaW4gXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLmNoYWluXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0Q2hhaW4oKXsgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWluO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXG4vKipcbiAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cbiAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EsIFRIw6lvIEtudXR6IGV0IEzDqW8gTGUgQnJhc1xuICogSEVUSUMgUDIwMTlcbiAqXG4gKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVsZXIpXG4gKlxuICogQ29weXJpZ2h0IDIwMTVcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICpcbiAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gKi9cblxudmFyIG9wdGlvbnMgPSB7XG4gICAgZ29iYW46IHtcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuJ1xuICAgIH0sXG4gICAgZ2FtZXBsYXk6IHtcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuX2dhbWVwbGF5J1xuICAgIH0sXG4gICAgZ3JpZDoge1xuICAgICAgICBuYnJlOiAnMTknLFxuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW5fZ3JpZCcsXG4gICAgICAgIGNlbGxTaXplOiA0MCxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICAgICAgICBib3JkZXJDb2xvcjogJ2JsYWNrJyxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDJcbiAgICB9LFxuICAgIHJvY2s6e1xuICAgICAgICBzaXplOiAyMCxcbiAgICAgICAgcGxheWVyMTogJ2dyZXknLFxuICAgICAgICBwbGF5ZXIyOiAnYmxhY2snXG4gICAgfVxufTtcblxuR29HYW1lKCk7XG4iXX0=
