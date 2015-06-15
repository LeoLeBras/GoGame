(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function GoGame() {

    var GameBuilder = new Builder();
    GameBuilder.run();
    var Gameplay = new GameplayDispatcher();
    Gameplay.listenner();
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

var GameplayActions = (function () {

    /**
     * Constructor
     *
     * @param array options
     */

    function GameplayActions() {
        _classCallCheck(this, GameplayActions);

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

        this.cache = [];

        for (this.x = 1; this.x <= this.grid; this.x++) {
            for (this.y = 1; this.y <= this.grid; this.y++) {
                rocks.add({
                    x: this.x,
                    y: this.y
                });
            }
        }
    }

    _createClass(GameplayActions, [{
        key: 'switchPlayers',

        /**
         * Switch players
         *
         */
        value: function switchPlayers() {
            this.player.next();
            this.ennemy.next();
        }
    }, {
        key: 'getRock',

        /**
         * Get object of the current rock
         *
         * @parma type (string)
         * @return rock (object)
         */
        value: function getRock() {
            var type = arguments[0] === undefined ? 'complete' : arguments[0];

            var rock = {
                x: this.x,
                y: this.y
            };

            if (type == 'simple') {
                return rock;
            }

            return rocks.select(rock);
        }
    }, {
        key: 'addRock',

        /**
         * The player click on the goban to put a rock
         *
         */
        value: function addRock(e) {

            // Set current rock
            this.x = Math.floor((e.layerX + this.cellSize / 2) / this.cellSize);
            this.y = Math.floor((e.layerY + this.cellSize / 2) / this.cellSize);

            // If the player can play here
            if (1 <= this.x && this.x <= this.grid && 1 <= this.y && this.y <= this.grid && this.getRock().getPlayer() == 0) {

                // Debug
                console.log('****');
                console.log('Player ' + this.player.get() + ' en ' + this.x + ';' + this.y);

                this.getRock().add(this.player);

                var color = options['rock'].player1;
                if (this.player.get() == 2) {
                    color = options['rock'].player2;
                }

                var c = this.canvas;
                c.beginPath();
                c.arc(this.x * this.cellSize, this.y * this.cellSize, this.rockSize / 2, 0, 2 * Math.PI, false);
                c.closePath();
                c.fillStyle = color;
                c.fill();

                return true;
            }

            return false;
        }
    }, {
        key: 'updateChains',

        /**
         * Update chains
         *
         */
        value: function updateChains() {

            // Get neighbors
            var neighbors = this.getRock().getNeighboringRocks('current');

            if (neighbors.length != 0) {

                // Get chains from neighborings intersections       
                var chainsOfNeighbors = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = neighbors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var rock = _step.value;

                        if (chainsOfNeighbors.indexOf(rock.getChain()) == -1) {
                            chainsOfNeighbors.push(rock.getChain());
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
                if (chainsOfNeighbors.length == 1) {
                    var chain = chainsOfNeighbors[0]; // Set index of the chain
                }

                // CASE 2 : Join chains
                else {
                    chainsOfNeighbors = chainsOfNeighbors.sort();
                    var joinChain = chainsOfNeighbors[0];
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = chainsOfNeighbors.reverse()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var _chain = _step2.value;

                            if (_chain != joinChain) {
                                var _iteratorNormalCompletion3 = true;
                                var _didIteratorError3 = false;
                                var _iteratorError3 = undefined;

                                try {
                                    for (var _iterator3 = chains.select(_chain).getRocks()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                        var rock = _step3.value;

                                        rocks.select(rock).setChain(joinChain);
                                        chains.select(joinChain).addRock(rock);
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

                                chains.select(_chain).remove();
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
                var chain = chains.count();
                chains.add(chain);
            }

            // Add current rock to the chain
            chains.select(chain).addRock(this.getRock('simple'));
            this.getRock().setChain(chain);
        }
    }, {
        key: 'updateGoban',

        /**
         * Handle the goban with the update of chains
         *
         */
        value: function updateGoban() {

            var neighbors = this.getRock().getNeighboringRocks('ennemy');

            if (neighbors.length != 0) {

                // Get chains from neighborings intersections       
                var chainsOfNeighbors = [];
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = neighbors[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var rock = _step4.value;

                        if (chainsOfNeighbors.indexOf(rock.getChain()) == -1) {
                            chainsOfNeighbors.push(rock.getChain());
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
                    for (var _iterator5 = chainsOfNeighbors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var chain = _step5.value;

                        if (chains.select(chain).getLiberties() == 0) {
                            console.log('Remove chain ' + chain);
                            var _iteratorNormalCompletion6 = true;
                            var _didIteratorError6 = false;
                            var _iteratorError6 = undefined;

                            try {
                                for (var _iterator6 = chains.select(chain).getRocks()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
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

    return GameplayActions;
})();

var Save = (function () {
    function Save() {
        _classCallCheck(this, Save);
    }

    _createClass(Save, [{
        key: 'update',
        value: function update() {}
    }]);

    return Save;
})();

var Score = function Score() {
    _classCallCheck(this, Score);
};

var GameplayDispatcher = (function () {
    function GameplayDispatcher() {
        _classCallCheck(this, GameplayDispatcher);

        this.$goban = Sprint(options['gameplay'].element);
        this.Gameplay = new GameplayActions();
        this.listenner();
    }

    _createClass(GameplayDispatcher, [{
        key: 'listenner',
        value: function listenner() {
            var _this = this;

            Sprint(this.$goban).on('click', function (e) {
                if (_this.Gameplay.addRock(e)) {
                    _this.Gameplay.updateChains();
                    _this.Gameplay.updateGoban();
                    _this.Gameplay.switchPlayers();
                }
            }, this);
        }
    }]);

    return GameplayDispatcher;
})();

var Chains = (function () {

    /**
     * Constructor
     *
     */

    function Chains() {
        _classCallCheck(this, Chains);

        this.chains = [];
    }

    _createClass(Chains, [{
        key: 'add',

        /**
         * Add a chain
         *
         * @param chain (string)
         */
        value: function add(chain) {
            this.chains[chain] = new Chain(chain);
        }
    }, {
        key: 'select',

        /**
         * Select a chain
         *
         * @param chain (chain)
         * @return chain object selected
         */
        value: function select(chain) {
            return this.chains[chain];
        }
    }, {
        key: 'count',

        /**
         * Count chains
         *
         * @return this.chains.length
         */
        value: function count() {
            return this.chains.length;
        }
    }]);

    return Chains;
})();

var Chain = (function () {

    /**
     * Constructor
     *
     */

    function Chain(name) {
        _classCallCheck(this, Chain);

        this.rocks = [];
        this.border = [];
        this.territory = [];
        this.name = name;
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
            var _iteratorNormalCompletion7 = true;
            var _didIteratorError7 = false;
            var _iteratorError7 = undefined;

            try {

                for (var _iterator7 = this.rocks[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                    var rock = _step7.value;

                    if (rocks.select({ x: rock.x, y: rock.y }).getNeighboringRocks(rocks, 'current').length != 4) {
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

            this.liberties = 0;
            var _iteratorNormalCompletion8 = true;
            var _didIteratorError8 = false;
            var _iteratorError8 = undefined;

            try {
                for (var _iterator8 = this.getBorders(rocks)[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                    var rock = _step8.value;

                    this.liberties += rocks.select(rock).getLiberties();
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

            return this.liberties;
        }
    }]);

    return Chain;
})();

var chains = new Chains();
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

var Rocks = (function () {

    /**
     * Constructor
     *
     */

    function Rocks() {
        _classCallCheck(this, Rocks);

        this.rocks = [];
    }

    _createClass(Rocks, [{
        key: 'add',

        /**
         * Add a rock
         *
         * @param rock (object) {x: x, y:y}
         */
        value: function add(rock) {
            if (this.rocks[rock.x] == undefined) {
                this.rocks[rock.x] = [];
            }
            this.rocks[rock.x][rock.y] = new Rock(rock);
        }
    }, {
        key: 'select',

        /**
         * Select a rock
         *
         * @param rock (object) {x: x, y:y}
         * @return rock object selected
         */
        value: function select(rock) {
            if (this.rocks[rock.x] != undefined && this.rocks[rock.x][rock.y] != undefined) {
                return this.rocks[rock.x][rock.y];
            }
            return false;
        }
    }]);

    return Rocks;
})();

var Rock = (function () {

    /**
     * Constructor
     *
     * @param x and y (number)
     */

    function Rock(rock) {
        _classCallCheck(this, Rock);

        this.chain = 0;
        this.x = rock.x;
        this.y = rock.y;
        this.player = 0;
    }

    _createClass(Rock, [{
        key: 'add',

        /**
         * Add a rock
         *
         */
        value: function add(player) {
            this.player = player.get();
        }
    }, {
        key: 'getNeighboringRocks',

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

                var rock = rocks.select({ x: x, y: y });

                if (rock && rock.getPlayer() != 0) {
                    this.cache.push(rock);
                }
            }

            if (select != 'all') {
                var _player = (this.getPlayer() + 2) % 2 + 1;
                if (select == 'current') {
                    _player = this.getPlayer();
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
        key: 'getLiberties',

        /**
         * Get liberties
         *
         * @return liberties
         */
        value: function getLiberties() {
            return 4 - this.getNeighboringRocks().length;
        }
    }, {
        key: 'getPlayer',

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

var rocks = new Rocks();

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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2Zha2VfN2Q5YWZkNzEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7QUNBQSxTQUFTLE1BQU0sR0FBRTs7QUFFYixRQUFJLFdBQVcsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0FBQ2hDLGVBQVcsQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNsQixRQUFJLFFBQVEsR0FBRyxJQUFJLGtCQUFrQixFQUFFLENBQUM7QUFDeEMsWUFBUSxDQUFDLFNBQVMsRUFBRSxDQUFDO0NBQ3hCOztJQUNLLE9BQU87Ozs7Ozs7QUFNRSxhQU5ULE9BQU8sR0FNSTs4QkFOWCxPQUFPOztBQU9MLFlBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNqQyxZQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUM7O0FBRW5ELFlBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUN6QyxZQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDOztBQUUxRCxZQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0MsWUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FB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O2FBQ3RDOztBQUVELG1CQUFPLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUV2Qzs7Ozs7Ozs7O2VBWVcsd0JBQUU7QUFDVixtQkFBUSxDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUMsTUFBTSxDQUFFO1NBQ2xEOzs7Ozs7Ozs7ZUFZUSxxQkFBRTtBQUNQLG1CQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDdEI7Ozs7Ozs7OztlQVlPLGtCQUFDLEtBQUssRUFBQztBQUNYLGdCQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUN0Qjs7Ozs7Ozs7O2VBWU8sb0JBQUU7QUFDTixtQkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDO1NBQ3JCOzs7V0FySkMsSUFBSTs7O0FBMEpWLElBQUksS0FBSyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQnhCLElBQUksT0FBTyxHQUFHO0FBQ1YsU0FBSyxFQUFFO0FBQ0gsZUFBTyxFQUFFLGFBQWE7S0FDekI7QUFDRCxZQUFRLEVBQUU7QUFDTixlQUFPLEVBQUUsc0JBQXNCO0tBQ2xDO0FBQ0QsUUFBSSxFQUFFO0FBQ0YsWUFBSSxFQUFFLElBQUk7QUFDVixlQUFPLEVBQUUsa0JBQWtCO0FBQzNCLGdCQUFRLEVBQUUsRUFBRTtBQUNaLHVCQUFlLEVBQUUsT0FBTztBQUN4QixtQkFBVyxFQUFFLE9BQU87QUFDcEIsbUJBQVcsRUFBRSxDQUFDO0tBQ2pCO0FBQ0QsUUFBSSxFQUFDO0FBQ0QsWUFBSSxFQUFFLEVBQUU7QUFDUixlQUFPLEVBQUUsTUFBTTtBQUNmLGVBQU8sRUFBRSxPQUFPO0tBQ25CO0NBQ0osQ0FBQzs7QUFFRixNQUFNLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBHb0dhbWUoKXtcblxuICAgIHZhciBHYW1lQnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gICAgR2FtZUJ1aWxkZXIucnVuKCk7XG4gICAgdmFyIEdhbWVwbGF5ID0gbmV3IEdhbWVwbGF5RGlzcGF0Y2hlcigpO1xuICAgIEdhbWVwbGF5Lmxpc3Rlbm5lcigpO1xufVxuY2xhc3MgQnVpbGRlcntcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xuICAgICAgICB0aGlzLmdyaWRib3JkZXJXaWR0aCA9IG9wdGlvbnNbJ2dyaWQnXS5ib3JkZXJXaWR0aDtcblxuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuICAgICAgICB0aGlzLmdyaWRTaXplID0gKHBhcnNlSW50KHRoaXMuZ3JpZCkgKyAxKSAqIHRoaXMuY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ29iYW4nXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkgPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZCA9IFNwcmludChvcHRpb25zWydncmlkJ10uZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5ncmlkQ2FudmFzID0gdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5nYW1lcGxheUNhbnZhcyA9IHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBnb2JhblxuICAgICAqXG4gICAgICogQHJldHVybiBjc3Mgc3R5bGUgb2YgdGhlIGdvYmFuXG4gICAgICovICBcbiAgICBidWlsZEdvYmFuKCl7XG4gICAgICAgIHRoaXMuJGdvYmFuLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdhbWVwbGF5IGNhbnZhc1xuICAgICAqXG4gICAgICogQHJldHVybiBjYW52YXNcbiAgICAgKi8gIFxuICAgIGJ1aWxkR2FtZXBsYXkoKXtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmhlaWdodCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxuICAgICAgICB9KVxuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBncmlkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNhbnZhcyB3aXRoIGEgZ3JpZCBkcmF3blxuICAgICAqLyAgXG4gICAgYnVpbGRHcmlkKCl7XG5cbiAgICAgICAgLy8gU2V0IHNpemUgb2YgY2FudmFzXG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBJbml0IHRoZSBjYW52YXNcbiAgICAgICAgdmFyIGMgPSB0aGlzLmdyaWRDYW52YXM7XG5cbiAgICAgICAgLy8gRHJhdyBlYWNoIGxpbmVzIG9mIHRoZSBncmlkXG4gICAgICAgIGZvcih2YXIgeCA9IDE7IHggPD0gdGhpcy5ncmlkIDsgeCsrKXtcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XG4gICAgICAgICAgICBjLmxpbmVUbyh0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSwgdGhpcy5jZWxsU2l6ZSAqIHgpO1xuICAgICAgICAgICAgYy5saW5lV2lkdGggPSB0aGlzLmdyaWRib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciB5ID0gMTsgeSA8PSB0aGlzLmdyaWQgOyB5Kyspe1xuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGMubW92ZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xuICAgICAgICAgICAgYy5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhbGwgZWxlbWVudHNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgcnVuKCl7XG4gICAgICAgIHRoaXMuYnVpbGRHb2JhbigpO1xuICAgICAgICB0aGlzLmJ1aWxkR2FtZXBsYXkoKTtcbiAgICAgICAgdGhpcy5idWlsZEdyaWQoKTtcbiAgICB9XG5cbn1cbmNsYXNzIEdhbWVwbGF5QWN0aW9uc3tcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9uc1xuICAgICAqLyAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRnb2Jhbi5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuXG4gICAgICAgIHRoaXMucm9jaztcbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIxID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcblxuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoJ2N1cnJlbnQnKTtcbiAgICAgICAgdGhpcy5lbm5lbXkgPSBuZXcgUGxheWVyKCdlbm5lbXknKTtcblxuICAgICAgICB0aGlzLmNhY2hlID0gW107XG5cbiAgICAgICAgZm9yKHRoaXMueD0gMTsgdGhpcy54IDw9IHRoaXMuZ3JpZCA7IHRoaXMueCsrKXtcbiAgICAgICAgICAgIGZvcih0aGlzLnkgPSAxOyB0aGlzLnkgPD0gdGhpcy5ncmlkIDsgdGhpcy55Kyspe1xuICAgICAgICAgICAgICAgIHJvY2tzLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIHggOiB0aGlzLngsXG4gICAgICAgICAgICAgICAgICAgIHkgOiB0aGlzLnlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogU3dpdGNoIHBsYXllcnNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgc3dpdGNoUGxheWVycygpe1xuICAgICAgICB0aGlzLnBsYXllci5uZXh0KCk7XG4gICAgICAgIHRoaXMuZW5uZW15Lm5leHQoKTtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogR2V0IG9iamVjdCBvZiB0aGUgY3VycmVudCByb2NrXG4gICAgICpcbiAgICAgKiBAcGFybWEgdHlwZSAoc3RyaW5nKVxuICAgICAqIEByZXR1cm4gcm9jayAob2JqZWN0KVxuICAgICAqLyAgXG4gICAgZ2V0Um9jayh0eXBlID0gJ2NvbXBsZXRlJyl7XG5cbiAgICAgICAgbGV0IHJvY2sgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLngsIFxuICAgICAgICAgICAgeTogdGhpcy55XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlID09ICdzaW1wbGUnKXtcbiAgICAgICAgICAgIHJldHVybiByb2NrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvY2tzLnNlbGVjdChyb2NrKTtcblxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxheWVyIGNsaWNrIG9uIHRoZSBnb2JhbiB0byBwdXQgYSByb2NrXG4gICAgICpcbiAgICAgKi8gIFxuICAgIGFkZFJvY2soZSl7XG5cbiAgICAgICAgLy8gU2V0IGN1cnJlbnQgcm9ja1xuICAgICAgICB0aGlzLnggPSBNYXRoLmZsb29yKChlLmxheWVyWCArIHRoaXMuY2VsbFNpemUgLyAyKSAvIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICB0aGlzLnkgPSBNYXRoLmZsb29yKChlLmxheWVyWSArIHRoaXMuY2VsbFNpemUgLyAyKSAvIHRoaXMuY2VsbFNpemUpO1xuXG4gICAgICAgIC8vIElmIHRoZSBwbGF5ZXIgY2FuIHBsYXkgaGVyZVxuICAgICAgICBpZigxIDw9IHRoaXMueCAmJiB0aGlzLnggPD0gdGhpcy5ncmlkICYmIDEgPD0gdGhpcy55ICYmIHRoaXMueSA8PSB0aGlzLmdyaWQgJiYgdGhpcy5nZXRSb2NrKCkuZ2V0UGxheWVyKCkgPT0gMCl7XG5cbiAgICAgICAgICAgIC8vIERlYnVnXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnKioqKicpO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYFBsYXllciAke3RoaXMucGxheWVyLmdldCgpfSBlbiAke3RoaXMueH07JHt0aGlzLnl9YCk7XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0Um9jaygpLmFkZCh0aGlzLnBsYXllcik7XG5cbiAgICAgICAgICAgIGxldCBjb2xvciA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIxO1xuICAgICAgICAgICAgaWYodGhpcy5wbGF5ZXIuZ2V0KCkgPT0gMil7XG4gICAgICAgICAgICAgICAgY29sb3IgPSAgb3B0aW9uc1sncm9jayddLnBsYXllcjI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjID0gdGhpcy5jYW52YXM7XG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgYy5hcmModGhpcy54ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy55ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy5yb2NrU2l6ZSAvIDIsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICAgICAgICBjLmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgYy5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgICAgIGMuZmlsbCgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIGNoYWluc1xuICAgICAqXG4gICAgICovICBcbiAgICB1cGRhdGVDaGFpbnMoKXtcblxuICAgICAgICAvLyBHZXQgbmVpZ2hib3JzXG4gICAgICAgIHZhciBuZWlnaGJvcnMgPSB0aGlzLmdldFJvY2soKS5nZXROZWlnaGJvcmluZ1JvY2tzKCdjdXJyZW50Jyk7XG5cbiAgICAgICAgaWYobmVpZ2hib3JzLmxlbmd0aCAhPSAwKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gR2V0IGNoYWlucyBmcm9tIG5laWdoYm9yaW5ncyBpbnRlcnNlY3Rpb25zICAgICAgICBcbiAgICAgICAgICAgIGxldCBjaGFpbnNPZk5laWdoYm9ycyA9IFtdO1xuICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIG5laWdoYm9ycyl7XG4gICAgICAgICAgICAgICAgaWYoY2hhaW5zT2ZOZWlnaGJvcnMuaW5kZXhPZihyb2NrLmdldENoYWluKCkpID09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW5zT2ZOZWlnaGJvcnMucHVzaChyb2NrLmdldENoYWluKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ0FTRSAxIDogQWRkIHRoZSByb2NrIHRvIHRoZSBjaGFpblxuICAgICAgICAgICAgaWYoY2hhaW5zT2ZOZWlnaGJvcnMubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgICAgIHZhciBjaGFpbiA9IGNoYWluc09mTmVpZ2hib3JzWzBdOyAvLyBTZXQgaW5kZXggb2YgdGhlIGNoYWluXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENBU0UgMiA6IEpvaW4gY2hhaW5zXG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGNoYWluc09mTmVpZ2hib3JzID0gY2hhaW5zT2ZOZWlnaGJvcnMuc29ydCgpO1xuICAgICAgICAgICAgICAgIGxldCBqb2luQ2hhaW4gPSBjaGFpbnNPZk5laWdoYm9yc1swXTtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGNoYWluIG9mIGNoYWluc09mTmVpZ2hib3JzLnJldmVyc2UoKSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGNoYWluICE9IGpvaW5DaGFpbil7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHJvY2sgb2YgY2hhaW5zLnNlbGVjdChjaGFpbikuZ2V0Um9ja3MoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9ja3Muc2VsZWN0KHJvY2spLnNldENoYWluKGpvaW5DaGFpbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5zLnNlbGVjdChqb2luQ2hhaW4pLmFkZFJvY2socm9jayk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFpbnMuc2VsZWN0KGNoYWluKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjaGFpbiA9IGpvaW5DaGFpbjsgLy8gU2V0IGluZGV4IG9mIHRoZSBjaGFpblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ0FTRSAzIDogQ3JlYXRlIG5ldyBjaGFpblxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdmFyIGNoYWluID0gY2hhaW5zLmNvdW50KCk7XG4gICAgICAgICAgICBjaGFpbnMuYWRkKGNoYWluKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBjdXJyZW50IHJvY2sgdG8gdGhlIGNoYWluXG4gICAgICAgIGNoYWlucy5zZWxlY3QoY2hhaW4pLmFkZFJvY2sodGhpcy5nZXRSb2NrKCdzaW1wbGUnKSk7XG4gICAgICAgIHRoaXMuZ2V0Um9jaygpLnNldENoYWluKGNoYWluKTtcblxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBnb2JhbiB3aXRoIHRoZSB1cGRhdGUgb2YgY2hhaW5zXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHVwZGF0ZUdvYmFuKCl7XG5cbiAgICAgICAgbGV0IG5laWdoYm9ycyA9IHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3MoJ2VubmVteScpO1xuXG4gICAgICAgIGlmKG5laWdoYm9ycy5sZW5ndGggIT0gMCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEdldCBjaGFpbnMgZnJvbSBuZWlnaGJvcmluZ3MgaW50ZXJzZWN0aW9ucyAgICAgICAgXG4gICAgICAgICAgICBsZXQgY2hhaW5zT2ZOZWlnaGJvcnMgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKGNoYWluc09mTmVpZ2hib3JzLmluZGV4T2Yocm9jay5nZXRDaGFpbigpKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluc09mTmVpZ2hib3JzLnB1c2gocm9jay5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcihsZXQgY2hhaW4gb2YgY2hhaW5zT2ZOZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKGNoYWlucy5zZWxlY3QoY2hhaW4pLmdldExpYmVydGllcygpID09IDApe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVtb3ZlIGNoYWluICR7Y2hhaW59YCk7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBjaGFpbnMuc2VsZWN0KGNoYWluKS5nZXRSb2NrcygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vdGhpcy50YWJbcm9jay54XVtyb2NrLnldLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBTYXZle1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICBcdFxuICAgIH1cblxuICAgIHVwZGF0ZSgpe1xuXG4gICAgfVxuXG59XG5jbGFzcyBTY29yZXtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgfVxuICAgIFxufVxuXG5jbGFzcyBHYW1lcGxheURpc3BhdGNoZXJ7XHJcblx0XHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgXHR0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpO1xyXG4gICAgXHR0aGlzLkdhbWVwbGF5ID0gbmV3IEdhbWVwbGF5QWN0aW9ucygpO1xyXG4gICAgXHR0aGlzLmxpc3Rlbm5lcigpO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICBsaXN0ZW5uZXIoKXtcclxuXHJcbiAgICBcdFNwcmludCh0aGlzLiRnb2Jhbikub24oJ2NsaWNrJywgKGUpID0+e1xyXG4gICAgICAgICAgICBpZih0aGlzLkdhbWVwbGF5LmFkZFJvY2soZSkpe1xyXG4gICAgICAgICAgICBcdHRoaXMuR2FtZXBsYXkudXBkYXRlQ2hhaW5zKCk7XHJcbiAgICAgICAgICAgIFx0dGhpcy5HYW1lcGxheS51cGRhdGVHb2JhbigpO1xyXG4gICAgICAgICAgICBcdHRoaXMuR2FtZXBsYXkuc3dpdGNoUGxheWVycygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgfVxyXG5cclxufVxuY2xhc3MgQ2hhaW5ze1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5jaGFpbnMgPSBbXTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgY2hhaW5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2hhaW4gKHN0cmluZylcclxuICAgICAqLyAgXHJcbiAgICBhZGQoY2hhaW4pe1xyXG4gICAgICAgIHRoaXMuY2hhaW5zW2NoYWluXSA9IG5ldyBDaGFpbihjaGFpbik7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNlbGVjdCBhIGNoYWluXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNoYWluIChjaGFpbilcclxuICAgICAqIEByZXR1cm4gY2hhaW4gb2JqZWN0IHNlbGVjdGVkXHJcbiAgICAgKi8gIFxyXG4gICAgc2VsZWN0KGNoYWluKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbnNbY2hhaW5dO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb3VudCBjaGFpbnNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMuY2hhaW5zLmxlbmd0aFxyXG4gICAgICovICBcclxuICAgIGNvdW50KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW5zLmxlbmd0aDtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5jbGFzcyBDaGFpbntcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IobmFtZSl7XHJcbiAgICAgICAgdGhpcy5yb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYm9yZGVyID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBbXTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSAnYWxpdmUnO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIHJvY2tcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgYWRkUm9jayhyb2NrKXtcclxuICAgICAgICB0aGlzLnJvY2tzLnB1c2gocm9jayk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgcm9ja3NcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0Um9ja3MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb2Nrcy5zb3J0KCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYSBjaGFpblxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICByZW1vdmUoKXtcclxuICAgICAgICB0aGlzLnJvY2tzID0gW107XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdkZWFkJztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gYm9yZGVycyBvZiB0aGUgY2hhaW5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGFycmF5XHJcbiAgICAgKi8gXHJcbiAgICBnZXRCb3JkZXJzKHBhcmFtID0gJ29iamVjdHMnKXtcclxuXHJcbiAgICAgICAgZm9yKGxldCByb2NrIG9mIHRoaXMucm9ja3Mpe1xyXG4gICAgICAgICAgICBpZihyb2Nrcy5zZWxlY3Qoe3g6IHJvY2sueCwgeTogcm9jay55fSkuZ2V0TmVpZ2hib3JpbmdSb2Nrcyhyb2NrcywgJ2N1cnJlbnQnKS5sZW5ndGggIT0gNCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvcmRlci5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwYXJhbSA9PSAnY291bnQnKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVyLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmJvcmRlci5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgbGliZXJ0aWVzIG9mIHRoZSB0ZXJyaXRvcmllc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5saWJlcnRpZXMgKG51bWJlcilcclxuICAgICAqLyBcclxuICAgIGdldExpYmVydGllcyhwYXJhbSA9ICdvYmplY3RzJyl7XHJcblxyXG4gICAgICAgIHRoaXMubGliZXJ0aWVzID0gMDtcclxuICAgICAgICBmb3IobGV0IHJvY2sgb2YgdGhpcy5nZXRCb3JkZXJzKHJvY2tzKSl7XHJcbiAgICAgICAgICAgIHRoaXMubGliZXJ0aWVzICs9IHJvY2tzLnNlbGVjdChyb2NrKS5nZXRMaWJlcnRpZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGliZXJ0aWVzO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxudmFyIGNoYWlucyA9IG5ldyBDaGFpbnMoKTtcbnZhciBwbGF5ZXIgPSAnZGQnO1xyXG5cclxuY2xhc3MgUGxheWVye1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGxheWVyXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcil7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gMTtcclxuICAgICAgICBpZihwbGF5ZXIgPT0gJ2VubmVteScpe1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN3aXRjaCB0byB0aGUgbmV4dCBwbGF5ZXJcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgbmV4dCgpe1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICgodGhpcy5uYW1lKyspICUgMikgKyAxO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHBsYXllclxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5uYW1lXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0KHNlbGVjdCA9ICdjdXJyZW50Jyl7XHJcbiAgICBcdHJldHVybiB0aGlzLm5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIFxyXG59XG5jbGFzcyBSb2Nrc3tcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMucm9ja3MgPSBbXTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByb2NrIChvYmplY3QpIHt4OiB4LCB5Onl9XHJcbiAgICAgKi8gIFxyXG4gICAgYWRkKHJvY2spe1xyXG4gICAgICAgIGlmKHRoaXMucm9ja3Nbcm9jay54XSA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aGlzLnJvY2tzW3JvY2sueF0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb2Nrc1tyb2NrLnhdW3JvY2sueV0gPSBuZXcgUm9jayhyb2NrKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2VsZWN0IGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByb2NrIChvYmplY3QpIHt4OiB4LCB5Onl9XHJcbiAgICAgKiBAcmV0dXJuIHJvY2sgb2JqZWN0IHNlbGVjdGVkXHJcbiAgICAgKi8gIFxyXG4gICAgc2VsZWN0KHJvY2spe1xyXG4gICAgICAgIGlmKHRoaXMucm9ja3Nbcm9jay54XSAhPSB1bmRlZmluZWQgJiYgdGhpcy5yb2Nrc1tyb2NrLnhdW3JvY2sueV0gIT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9ja3Nbcm9jay54XVtyb2NrLnldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuY2xhc3MgUm9ja3tcclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geCBhbmQgeSAobnVtYmVyKVxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihyb2NrKXtcclxuICAgICAgICB0aGlzLmNoYWluID0gMDtcclxuICAgICAgICB0aGlzLnggPSByb2NrLng7XHJcbiAgICAgICAgdGhpcy55ID0gcm9jay55O1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gMDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBhZGQocGxheWVyKXtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllci5nZXQoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IG5laWdoYm9yaW5nIHJvY2tzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHNlbGVjdCAoc3RyaW5nKVxyXG4gICAgICogQHJldHVybiBuZWlnaGJvcmluZyByb2NrcyAoYXJyYXkpXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0TmVpZ2hib3JpbmdSb2NrcyhzZWxlY3QgPSAnYWxsJyl7XHJcblxyXG4gICAgICAgIHRoaXMubmVpZ2hib3JpbmdSb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpPTEgOyBpIDw9IDQgOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgeCA9IHRoaXMueDtcclxuICAgICAgICAgICAgbGV0IHkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2goaSl7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgeSA9IHkgLSAxOyAvLyB0b3BcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgeCsrOyAvLyByaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICB5Kys7IC8vIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICB4ID0geCAtIDE7IC8vIGxlZnRcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHJvY2sgPSByb2Nrcy5zZWxlY3Qoe3gsIHl9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHJvY2sgJiYgcm9jay5nZXRQbGF5ZXIoKSAhPSAwKXtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaChyb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoc2VsZWN0ICE9ICdhbGwnKXtcclxuICAgICAgICAgICAgbGV0IHBsYXllciA9ICgodGhpcy5nZXRQbGF5ZXIoKSArIDIpICUgMikgKyAxO1xyXG4gICAgICAgICAgICBpZihzZWxlY3QgPT0gJ2N1cnJlbnQnKXtcclxuICAgICAgICAgICAgICAgIHBsYXllciA9IHRoaXMuZ2V0UGxheWVyKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgaSBpbiB0aGlzLmNhY2hlKXtcclxuICAgICAgICAgICAgICAgIGxldCByb2NrID0gdGhpcy5jYWNoZVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2suZ2V0UGxheWVyKCkgPT0gcGxheWVyKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MucHVzaChyb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MgPSB0aGlzLmNhY2hlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JpbmdSb2Nrcy5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgbGliZXJ0aWVzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBsaWJlcnRpZXNcclxuICAgICAqLyAgXHJcbiAgICBnZXRMaWJlcnRpZXMoKXsgIFxyXG4gICAgICAgIHJldHVybiAoNCAtIHRoaXMuZ2V0TmVpZ2hib3JpbmdSb2NrcygpLmxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgcGxheWVyIFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5wbGF5ZXJcclxuICAgICAqLyAgXHJcbiAgICBnZXRQbGF5ZXIoKXsgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYXllcjtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGNoYWluIFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjaGFpbiAobnVtYmVyKVxyXG4gICAgICovICBcclxuICAgIHNldENoYWluKGNoYWluKXsgIFxyXG4gICAgICAgIHRoaXMuY2hhaW4gPSBjaGFpbjsgXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBjaGFpbiBcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMuY2hhaW5cclxuICAgICAqLyAgXHJcbiAgICBnZXRDaGFpbigpeyAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW47XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxudmFyIHJvY2tzID0gbmV3IFJvY2tzKCk7XHJcblxuLyoqXG4gKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXG4gKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhLCBUSMOpbyBLbnV0eiBldCBMw6lvIExlIEJyYXNcbiAqIEhFVElDIFAyMDE5XG4gKlxuICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlbGVyKVxuICpcbiAqIENvcHlyaWdodCAyMDE1XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqXG4gKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICovXG5cbnZhciBvcHRpb25zID0ge1xuICAgIGdvYmFuOiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2JhbidcbiAgICB9LFxuICAgIGdhbWVwbGF5OiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9nYW1lcGxheSdcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgICAgbmJyZTogJzE5JyxcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuX2dyaWQnLFxuICAgICAgICBjZWxsU2l6ZTogNDAsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICdibGFjaycsXG4gICAgICAgIGJvcmRlcldpZHRoOiAyXG4gICAgfSxcbiAgICByb2NrOntcbiAgICAgICAgc2l6ZTogMjAsXG4gICAgICAgIHBsYXllcjE6ICdncmV5JyxcbiAgICAgICAgcGxheWVyMjogJ2JsYWNrJ1xuICAgIH1cbn07XG5cbkdvR2FtZSgpO1xuIl19
