(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function GoGame() {

    var GameBuilder = new Builder();
    GameBuilder.run();
    var Gameplay = new GameplayDispatcher();
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
        key: 'checkKO',

        /**
         * Check KO
         *
         */
        value: function checkKO() {
            return false;
        }
    }, {
        key: 'checkSuicide',

        /**
         * Check if the player is on a case on suicide
         *
         */
        value: function checkSuicide() {

            var response = false;
            var neighbors = this.getRock().getNeighboringRocks(players.getAdversary().getName());
            this.cache = [];

            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
                for (var _iterator = neighbors[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                    var neighbor = _step.value;

                    if (this.cache.indexOf(neighbor.getChain()) == -1) {
                        this.cache.push(neighbor.getChain());
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

            var count = 0;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.cache[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var item = _step2.value;

                    if (chains.select(item).getLiberties() == 1) {
                        console.log(chains.select(item).getLiberties());
                        var rock = chains.select(this.cache[0]).getLiberties('objects')[0];
                        console.log({
                            rockX: rock.x,
                            rockY: rock.y,
                            thisX: this.x,
                            thixY: this.y
                        });
                        if (rock.x == this.x && rock.y == this.y) {
                            count++;
                        }
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

            if (count == 0) {
                neighbors = this.getRock().getNeighboringRocks(players.getCurrent().getName());
                this.cache = [];

                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = neighbors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var neighbor = _step3.value;

                        if (this.cache.indexOf(neighbor.getChain()) == -1) {
                            this.cache.push(neighbor.getChain());
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

                if (this.cache.length != 0) {
                    count = 0;
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = this.cache[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var chain = _step4.value;

                            if (chains.select(chain).getLiberties() == 1) {
                                count++;
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

                    if (count == this.cache.length) {
                        var rock = chains.select(this.cache[0]).getLiberties('objects')[0];
                        if (rock.x == this.x && rock.y == this.y && rock.getNeighboringRocks(players.getAdversary().getName()).length == 4 - count) {
                            response = true;
                            console.log('CASE 2');
                        }
                    }
                } else if (this.getRock().getNeighboringRocks(players.getAdversary().getName()).length == 4) {
                    response = true;
                    console.log('CASE 1');
                }
            }

            if (response) {
                console.log('****');
                console.log('Case of suicide for player ' + players.getCurrent().getName() + ' on ' + this.x + ';' + this.y);
            }

            return response;
        }
    }, {
        key: 'switchPlayers',

        /**
         * Switch players
         *
         */
        value: function switchPlayers() {
            var origin = arguments[0] === undefined ? 'dispatcher' : arguments[0];

            if (origin == 'user') {
                players.getCurrent().updateHistoric({
                    type: 'next' });
            }

            players['switch']();
        }
    }, {
        key: 'isFinished',

        /**
         * Check if the game is finised
         *
         * @return boleenn
         */
        value: function isFinished() {
            var action = arguments[0] === undefined ? null : arguments[0];

            var response = false;

            if (action != null && action.type == 'next' && players.getAdversary().getHistoric('last').type == 'next') {
                response = true;
            }
            return response;
        }
    }, {
        key: 'gameOver',

        /**
         * Game Over
         *
         */
        value: function gameOver() {
            alert('Game Over ! :/');
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
            if (1 <= this.x && this.x <= this.grid && 1 <= this.y && this.y <= this.grid && this.getRock().getPlayer() == 0 && !this.checkSuicide() && !this.checkKO()) {

                // Debug
                console.log('****');
                console.log('Player ' + players.getCurrent().getName() + ' on ' + this.x + ';' + this.y);

                this.getRock().add(players.getCurrent().getName());
                players.getCurrent().updateHistoric({
                    type: 'add-rock',
                    params: {
                        x: this.x,
                        y: this.y
                    }
                });

                var color = options['rock'].player1;
                if (players.getCurrent().getName() == 2) {
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
                var _iteratorNormalCompletion5 = true;
                var _didIteratorError5 = false;
                var _iteratorError5 = undefined;

                try {
                    for (var _iterator5 = neighbors[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                        var rock = _step5.value;

                        if (chainsOfNeighbors.indexOf(rock.getChain()) == -1) {
                            chainsOfNeighbors.push(rock.getChain());
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

                // CASE 1 : Add the rock to the chain
                if (chainsOfNeighbors.length == 1) {
                    var chain = chainsOfNeighbors[0]; // Set index of the chain
                }

                // CASE 2 : Join chains
                else {
                    chainsOfNeighbors = chainsOfNeighbors.sort();
                    var joinChain = chainsOfNeighbors[0];
                    var _iteratorNormalCompletion6 = true;
                    var _didIteratorError6 = false;
                    var _iteratorError6 = undefined;

                    try {
                        for (var _iterator6 = chainsOfNeighbors.reverse()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                            var _chain = _step6.value;

                            if (_chain != joinChain) {
                                var _iteratorNormalCompletion7 = true;
                                var _didIteratorError7 = false;
                                var _iteratorError7 = undefined;

                                try {
                                    for (var _iterator7 = chains.select(_chain).getRocks()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                                        var rock = _step7.value;

                                        rocks.select(rock).setChain(joinChain);
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

                                chains.join(joinChain, _chain);
                                chains.select(_chain).remove();
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

                var chainsOfNeighbors = [];
                var _iteratorNormalCompletion8 = true;
                var _didIteratorError8 = false;
                var _iteratorError8 = undefined;

                try {
                    for (var _iterator8 = neighbors[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                        var rock = _step8.value;

                        if (chainsOfNeighbors.indexOf(rock.getChain()) == -1) {
                            chainsOfNeighbors.push(rock.getChain());
                        }
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

                var _iteratorNormalCompletion9 = true;
                var _didIteratorError9 = false;
                var _iteratorError9 = undefined;

                try {
                    for (var _iterator9 = chainsOfNeighbors[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                        var chain = _step9.value;

                        if (chains.select(chain).getLiberties() == 0) {
                            console.log('Remove chain ' + chain);
                            var _iteratorNormalCompletion10 = true;
                            var _didIteratorError10 = false;
                            var _iteratorError10 = undefined;

                            try {
                                for (var _iterator10 = chains.select(chain).getRocks()[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                                    var rock = _step10.value;

                                    var x = rock.x * this.cellSize - 1 - this.rockSize / 2;
                                    var y = rock.y * this.cellSize - 1 - this.rockSize / 2;
                                    this.canvas.clearRect(x, y, this.rockSize + 2, this.rockSize + 2);
                                    rocks.select(rock).remove();
                                }
                            } catch (err) {
                                _didIteratorError10 = true;
                                _iteratorError10 = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion10 && _iterator10['return']) {
                                        _iterator10['return']();
                                    }
                                } finally {
                                    if (_didIteratorError10) {
                                        throw _iteratorError10;
                                    }
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError9 = true;
                    _iteratorError9 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion9 && _iterator9['return']) {
                            _iterator9['return']();
                        }
                    } finally {
                        if (_didIteratorError9) {
                            throw _iteratorError9;
                        }
                    }
                }
            }
        }
    }]);

    return GameplayActions;
})();

var SaveActions = (function () {
    function SaveActions() {
        _classCallCheck(this, SaveActions);
    }

    _createClass(SaveActions, [{
        key: 'update',
        value: function update() {}
    }]);

    return SaveActions;
})();

var Score = function Score() {
    _classCallCheck(this, Score);
};

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
        key: 'get',

        /**
         * Get all chains
         *
         * @return this.chains
         */
        value: function get() {
            return this.chains;
        }
    }, {
        key: 'join',

        /**
         * Join 2 chains
         *
         */
        value: function join(joinChain, chain) {
            var _chains$joinChain$rocks;

            (_chains$joinChain$rocks = this.chains[joinChain].rocks).push.apply(_chains$joinChain$rocks, _toConsumableArray(this.chains[chain].rocks));
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

            this.border = [];

            var _iteratorNormalCompletion11 = true;
            var _didIteratorError11 = false;
            var _iteratorError11 = undefined;

            try {
                for (var _iterator11 = this.rocks[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                    var rock = _step11.value;

                    if (rocks.select({ x: rock.x, y: rock.y }).getNeighboringRocks(rocks, 'current').length != 4) {
                        this.border.push(rock);
                    }
                }
            } catch (err) {
                _didIteratorError11 = true;
                _iteratorError11 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion11 && _iterator11['return']) {
                        _iterator11['return']();
                    }
                } finally {
                    if (_didIteratorError11) {
                        throw _iteratorError11;
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
            var param = arguments[0] === undefined ? 'count' : arguments[0];

            this.liberties = [];
            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = this.getBorders(rocks)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var _liberties;

                    var rock = _step12.value;

                    (_liberties = this.liberties).push.apply(_liberties, _toConsumableArray(rocks.select(rock).getLiberties('objects')));
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12['return']) {
                        _iterator12['return']();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }

            if (param == 'count') {
                return this.liberties.length;
            }
            return this.liberties;
        }
    }]);

    return Chain;
})();

var chains = new Chains();

var Players = (function () {
    function Players() {
        _classCallCheck(this, Players);

        this.current = 1;
        this.players = [];
        this.players[1] = new Player(1);
        this.players[2] = new Player(2);
    }

    _createClass(Players, [{
        key: 'getCurrent',
        value: function getCurrent() {
            return this.players[this.current];
        }
    }, {
        key: 'getAdversary',
        value: function getAdversary() {
            return this.players[(this.current + 2) % 2 + 1];
        }
    }, {
        key: 'switch',
        value: function _switch() {
            this.current = this.current++ % 2 + 1;
        }
    }]);

    return Players;
})();

var Player = (function () {

    /**
     * Constructor
     *
     * @param name of the current player
     */

    function Player(player) {
        _classCallCheck(this, Player);

        this.name = player;
        this.historic = [];
        this.historic[0] = {
            type: '' };
        this.historic[1] = this.historic[0];
        this.historic[2] = this.historic[1];
    }

    _createClass(Player, [{
        key: 'getName',

        /**
         * Get player
         *
         * @return this.name
         */
        value: function getName() {
            return this.name;
        }
    }, {
        key: 'updateHistoric',

        /**
         * Update historic
         *
         */
        value: function updateHistoric(action) {
            this.historic[0] = this.historic[1];
            this.historic[1] = this.historic[2];
            this.historic[2] = action;
        }
    }, {
        key: 'getHistoric',

        /**
         * Get historic
         *
         */
        value: function getHistoric() {
            var index = arguments[0] === undefined ? 'all' : arguments[0];

            var response = '';

            switch (index) {
                case 'all':
                    response = this.historic;
                    break;
                case 'last':
                    response = this.historic[2];
                    break;
            }

            return response;
        }
    }]);

    return Player;
})();

var players = new Players();

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
        key: 'get',

        /**
         * Get all rocks
         *
         * @return this.rocks
         */
        value: function get() {
            return this.rocks;
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
            this.player = player;
        }
    }, {
        key: 'remove',

        /**
         * Remove a rock
         *
         */
        value: function remove(player) {
            this.player = 0;
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

                if (select != 'empty') {
                    if (rock && rock.getPlayer() != 0) {
                        this.cache.push(rock);
                    }
                } else {
                    if (rock && rock.getPlayer() == 0) {
                        this.cache.push(rock);
                    }
                }
            }

            if (select != 'all' && select != 'empty') {

                var player = select;
                if (typeof select == 'string') {
                    player = (this.getPlayer() + 2) % 2 + 1;
                    if (select == 'current') {
                        player = this.getPlayer();
                    }
                }

                for (var i in this.cache) {
                    var rock = this.cache[i];
                    if (rock.getPlayer() == player) {
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
            var param = arguments[0] === undefined ? 'count' : arguments[0];

            var neighbors = this.getNeighboringRocks('empty');
            if (param == 'count') {
                return neighbors.length;
            }
            return neighbors;
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

var GameplayDispatcher = (function () {
    function GameplayDispatcher() {
        _classCallCheck(this, GameplayDispatcher);

        this.$goban = Sprint(options['gameplay'].element);
        this.$next = Sprint(options['control'].next);
        this.Gameplay = new GameplayActions();
        this.Save = new SaveActions();
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
                    _this.Save.update();
                    _this.Gameplay.switchPlayers();
                }
            });

            Sprint(this.$next).on('click', function () {
                if (!_this.Gameplay.isFinished({
                    type: 'next',
                    player: 'players.getCurrent()'
                })) {
                    _this.Gameplay.switchPlayers('user');
                } else {
                    _this.Gameplay.gameOver();
                }
            });
        }
    }]);

    return GameplayDispatcher;
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
    },
    control: {
        next: '.Game_control_next'
    }
};

GoGame();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2Zha2VfMWI2YzEwMy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7O0FDQUEsU0FBUyxNQUFNLEdBQUU7O0FBRWIsUUFBSSxXQUFXLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztBQUNoQyxlQUFXLENBQUMsR0FBRyxFQUFFLENBQUM7QUFDbEIsUUFBSSxRQUFRLEdBQUcsSUFBSSxrQkFBa0IsRUFBRSxDQUFDO0NBQzNDOztJQUNLLE9BQU87Ozs7Ozs7QUFNRSxhQU5ULE9BQU8sR0FNSTs4QkFOWCxPQUFPOztBQU9MLFlBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNqQyxZQUFJLENBQUMsZUFBZSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLENBQUM7O0FBRW5ELFlBQUksQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQztBQUN6QyxZQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDOztBQUUxRCxZQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0MsWUFBSSxDQUFDLGVBQWUsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQzNELFlBQUksQ0FBQyxXQUFXLEdB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Q0EsMEJBQUssUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO2lCQUM1QjthQUNKLENBQUMsQ0FBQztTQUVOOzs7V0FsQ0Msa0JBQWtCOzs7Ozs7Ozs7Ozs7Ozs7OztBQW1EeEIsSUFBSSxPQUFPLEdBQUc7QUFDVixTQUFLLEVBQUU7QUFDSCxlQUFPLEVBQUUsYUFBYTtLQUN6QjtBQUNELFlBQVEsRUFBRTtBQUNOLGVBQU8sRUFBRSxzQkFBc0I7S0FDbEM7QUFDRCxRQUFJLEVBQUU7QUFDRixZQUFJLEVBQUUsSUFBSTtBQUNWLGVBQU8sRUFBRSxrQkFBa0I7QUFDM0IsZ0JBQVEsRUFBRSxFQUFFO0FBQ1osdUJBQWUsRUFBRSxPQUFPO0FBQ3hCLG1CQUFXLEVBQUUsT0FBTztBQUNwQixtQkFBVyxFQUFFLENBQUM7S0FDakI7QUFDRCxRQUFJLEVBQUM7QUFDRCxZQUFJLEVBQUUsRUFBRTtBQUNSLGVBQU8sRUFBRSxNQUFNO0FBQ2YsZUFBTyxFQUFFLE9BQU87S0FDbkI7QUFDRCxXQUFPLEVBQUM7QUFDSixZQUFJLEVBQUUsb0JBQW9CO0tBQzdCO0NBQ0osQ0FBQzs7QUFFRixNQUFNLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBHb0dhbWUoKXtcblxuICAgIHZhciBHYW1lQnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gICAgR2FtZUJ1aWxkZXIucnVuKCk7XG4gICAgdmFyIEdhbWVwbGF5ID0gbmV3IEdhbWVwbGF5RGlzcGF0Y2hlcigpO1xufVxuY2xhc3MgQnVpbGRlcntcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xuICAgICAgICB0aGlzLmdyaWRib3JkZXJXaWR0aCA9IG9wdGlvbnNbJ2dyaWQnXS5ib3JkZXJXaWR0aDtcblxuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuICAgICAgICB0aGlzLmdyaWRTaXplID0gKHBhcnNlSW50KHRoaXMuZ3JpZCkgKyAxKSAqIHRoaXMuY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ29iYW4nXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkgPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZCA9IFNwcmludChvcHRpb25zWydncmlkJ10uZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5ncmlkQ2FudmFzID0gdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5nYW1lcGxheUNhbnZhcyA9IHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBnb2JhblxuICAgICAqXG4gICAgICogQHJldHVybiBjc3Mgc3R5bGUgb2YgdGhlIGdvYmFuXG4gICAgICovICBcbiAgICBidWlsZEdvYmFuKCl7XG4gICAgICAgIHRoaXMuJGdvYmFuLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdhbWVwbGF5IGNhbnZhc1xuICAgICAqXG4gICAgICogQHJldHVybiBjYW52YXNcbiAgICAgKi8gIFxuICAgIGJ1aWxkR2FtZXBsYXkoKXtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmhlaWdodCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxuICAgICAgICB9KVxuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBncmlkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNhbnZhcyB3aXRoIGEgZ3JpZCBkcmF3blxuICAgICAqLyAgXG4gICAgYnVpbGRHcmlkKCl7XG5cbiAgICAgICAgLy8gU2V0IHNpemUgb2YgY2FudmFzXG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBJbml0IHRoZSBjYW52YXNcbiAgICAgICAgdmFyIGMgPSB0aGlzLmdyaWRDYW52YXM7XG5cbiAgICAgICAgLy8gRHJhdyBlYWNoIGxpbmVzIG9mIHRoZSBncmlkXG4gICAgICAgIGZvcih2YXIgeCA9IDE7IHggPD0gdGhpcy5ncmlkIDsgeCsrKXtcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XG4gICAgICAgICAgICBjLmxpbmVUbyh0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSwgdGhpcy5jZWxsU2l6ZSAqIHgpO1xuICAgICAgICAgICAgYy5saW5lV2lkdGggPSB0aGlzLmdyaWRib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciB5ID0gMTsgeSA8PSB0aGlzLmdyaWQgOyB5Kyspe1xuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGMubW92ZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xuICAgICAgICAgICAgYy5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhbGwgZWxlbWVudHNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgcnVuKCl7XG4gICAgICAgIHRoaXMuYnVpbGRHb2JhbigpO1xuICAgICAgICB0aGlzLmJ1aWxkR2FtZXBsYXkoKTtcbiAgICAgICAgdGhpcy5idWlsZEdyaWQoKTtcbiAgICB9XG5cbn1cbmNsYXNzIEdhbWVwbGF5QWN0aW9uc3tcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9uc1xuICAgICAqLyAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRnb2Jhbi5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuXG4gICAgICAgIHRoaXMucm9jaztcbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIxID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcblxuICAgICAgICB0aGlzLmNhY2hlID0gW107XG5cbiAgICAgICAgZm9yKHRoaXMueD0gMTsgdGhpcy54IDw9IHRoaXMuZ3JpZCA7IHRoaXMueCsrKXtcbiAgICAgICAgICAgIGZvcih0aGlzLnkgPSAxOyB0aGlzLnkgPD0gdGhpcy5ncmlkIDsgdGhpcy55Kyspe1xuICAgICAgICAgICAgICAgIHJvY2tzLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIHggOiB0aGlzLngsXG4gICAgICAgICAgICAgICAgICAgIHkgOiB0aGlzLnlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgS09cbiAgICAgKlxuICAgICAqLyAgXG4gICAgY2hlY2tLTygpe1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgcGxheWVyIGlzIG9uIGEgY2FzZSBvbiBzdWljaWRlXG4gICAgICpcbiAgICAgKi8gIFxuICAgIGNoZWNrU3VpY2lkZSgpe1xuXG4gICAgICAgIGxldCByZXNwb25zZSA9IGZhbHNlO1xuICAgICAgICBsZXQgbmVpZ2hib3JzID0gdGhpcy5nZXRSb2NrKCkuZ2V0TmVpZ2hib3JpbmdSb2NrcyhwbGF5ZXJzLmdldEFkdmVyc2FyeSgpLmdldE5hbWUoKSk7XG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcblxuICAgICAgICBmb3IobGV0IG5laWdoYm9yIG9mIG5laWdoYm9ycyl7XG4gICAgICAgICAgICBpZih0aGlzLmNhY2hlLmluZGV4T2YobmVpZ2hib3IuZ2V0Q2hhaW4oKSkgPT0gLTEpe1xuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaChuZWlnaGJvci5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgbGV0IGNvdW50ID0gMDtcblxuICAgICAgICBmb3IobGV0IGl0ZW0gb2YgdGhpcy5jYWNoZSl7XG4gICAgICAgICAgICBpZihjaGFpbnMuc2VsZWN0KGl0ZW0pLmdldExpYmVydGllcygpID09IDEpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGNoYWlucy5zZWxlY3QoaXRlbSkuZ2V0TGliZXJ0aWVzKCkpO1xuICAgICAgICAgICAgICAgIGxldCByb2NrID0gY2hhaW5zLnNlbGVjdCh0aGlzLmNhY2hlWzBdKS5nZXRMaWJlcnRpZXMoJ29iamVjdHMnKVswXTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh7XG4gICAgICAgICAgICAgICAgICAgIHJvY2tYOiByb2NrLngsXG4gICAgICAgICAgICAgICAgICAgIHJvY2tZOiByb2NrLnksXG4gICAgICAgICAgICAgICAgICAgIHRoaXNYOiB0aGlzLngsIFxuICAgICAgICAgICAgICAgICAgICB0aGl4WTogdGhpcy55XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgaWYocm9jay54ID09IHRoaXMueCAmJiByb2NrLnkgPT0gdGhpcy55KXtcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZihjb3VudCA9PSAwKXtcbiAgICAgICAgICAgIG5laWdoYm9ycyA9IHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3MocGxheWVycy5nZXRDdXJyZW50KCkuZ2V0TmFtZSgpKTtcbiAgICAgICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcblxuICAgICAgICAgICAgZm9yKGxldCBuZWlnaGJvciBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2FjaGUuaW5kZXhPZihuZWlnaGJvci5nZXRDaGFpbigpKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaChuZWlnaGJvci5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuY2FjaGUubGVuZ3RoICE9ICAwKXtcbiAgICAgICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBjaGFpbiBvZiB0aGlzLmNhY2hlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2hhaW5zLnNlbGVjdChjaGFpbikuZ2V0TGliZXJ0aWVzKCkgPT0gMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKGNvdW50ID09IHRoaXMuY2FjaGUubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvY2sgPSBjaGFpbnMuc2VsZWN0KHRoaXMuY2FjaGVbMF0pLmdldExpYmVydGllcygnb2JqZWN0cycpWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZihyb2NrLnggPT0gdGhpcy54ICYmIHJvY2sueSA9PSB0aGlzLnkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgcm9jay5nZXROZWlnaGJvcmluZ1JvY2tzKHBsYXllcnMuZ2V0QWR2ZXJzYXJ5KCkuZ2V0TmFtZSgpKS5sZW5ndGggPT0gKDQgLSBjb3VudCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NBU0UgMicpO1xuICAgICAgICAgICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAgICAgICAgXG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3MocGxheWVycy5nZXRBZHZlcnNhcnkoKS5nZXROYW1lKCkpLmxlbmd0aCA9PSA0KXtcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0NBU0UgMScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cblxuICAgICAgICBpZihyZXNwb25zZSl7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnKioqKicpOyAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgY29uc29sZS5sb2coYENhc2Ugb2Ygc3VpY2lkZSBmb3IgcGxheWVyICR7cGxheWVycy5nZXRDdXJyZW50KCkuZ2V0TmFtZSgpfSBvbiAke3RoaXMueH07JHt0aGlzLnl9YCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG5cbiAgICB9XG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIFN3aXRjaCBwbGF5ZXJzXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHN3aXRjaFBsYXllcnMob3JpZ2luID0gJ2Rpc3BhdGNoZXInKXtcbiAgICAgICAgXG4gICAgICAgIGlmKG9yaWdpbiA9PSAndXNlcicpe1xuICAgICAgICAgICAgcGxheWVycy5nZXRDdXJyZW50KCkudXBkYXRlSGlzdG9yaWMoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICduZXh0JyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcGxheWVycy5zd2l0Y2goKTtcblxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgZ2FtZSBpcyBmaW5pc2VkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGJvbGVlbm5cbiAgICAgKi8gIFxuICAgIGlzRmluaXNoZWQoYWN0aW9uID0gbnVsbCl7XG5cbiAgICAgICAgbGV0IHJlc3BvbnNlID0gZmFsc2U7XG5cbiAgICAgICAgaWYoYWN0aW9uICE9IG51bGwgJiZcbiAgICAgICAgICAgYWN0aW9uLnR5cGUgPT0gJ25leHQnICYmXG4gICAgICAgICAgIHBsYXllcnMuZ2V0QWR2ZXJzYXJ5KCkuZ2V0SGlzdG9yaWMoJ2xhc3QnKS50eXBlID09ICduZXh0Jyl7XG4gICAgICAgICAgICByZXNwb25zZSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuXG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEdhbWUgT3ZlclxuICAgICAqXG4gICAgICovICBcbiAgICBnYW1lT3Zlcigpe1xuICAgICAgICBhbGVydCgnR2FtZSBPdmVyICEgOi8nKTtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogR2V0IG9iamVjdCBvZiB0aGUgY3VycmVudCByb2NrXG4gICAgICpcbiAgICAgKiBAcGFybWEgdHlwZSAoc3RyaW5nKVxuICAgICAqIEByZXR1cm4gcm9jayAob2JqZWN0KVxuICAgICAqLyAgXG4gICAgZ2V0Um9jayh0eXBlID0gJ2NvbXBsZXRlJyl7XG5cbiAgICAgICAgbGV0IHJvY2sgPSB7XG4gICAgICAgICAgICB4OiB0aGlzLngsIFxuICAgICAgICAgICAgeTogdGhpcy55XG4gICAgICAgIH1cblxuICAgICAgICBpZih0eXBlID09ICdzaW1wbGUnKXtcbiAgICAgICAgICAgIHJldHVybiByb2NrO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJvY2tzLnNlbGVjdChyb2NrKTtcblxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBUaGUgcGxheWVyIGNsaWNrIG9uIHRoZSBnb2JhbiB0byBwdXQgYSByb2NrXG4gICAgICpcbiAgICAgKi8gIFxuICAgIGFkZFJvY2soZSl7XG5cbiAgICAgICAgLy8gU2V0IGN1cnJlbnQgcm9ja1xuICAgICAgICB0aGlzLnggPSBNYXRoLmZsb29yKChlLmxheWVyWCArIHRoaXMuY2VsbFNpemUgLyAyKSAvIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICB0aGlzLnkgPSBNYXRoLmZsb29yKChlLmxheWVyWSArIHRoaXMuY2VsbFNpemUgLyAyKSAvIHRoaXMuY2VsbFNpemUpO1xuXG4gICAgICAgIC8vIElmIHRoZSBwbGF5ZXIgY2FuIHBsYXkgaGVyZVxuICAgICAgICBpZigxIDw9IHRoaXMueCAmJiB0aGlzLnggPD0gdGhpcy5ncmlkICYmIDEgPD0gdGhpcy55ICYmIHRoaXMueSA8PSB0aGlzLmdyaWQgJiZcbiAgICAgICAgICAgdGhpcy5nZXRSb2NrKCkuZ2V0UGxheWVyKCkgPT0gMCAmJlxuICAgICAgICAgICAhdGhpcy5jaGVja1N1aWNpZGUoKSAmJlxuICAgICAgICAgICAhdGhpcy5jaGVja0tPKCkpe1xuXG4gICAgICAgICAgICAvLyBEZWJ1Z1xuICAgICAgICAgICAgY29uc29sZS5sb2coJyoqKionKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGBQbGF5ZXIgJHtwbGF5ZXJzLmdldEN1cnJlbnQoKS5nZXROYW1lKCl9IG9uICR7dGhpcy54fTske3RoaXMueX1gKTtcblxuICAgICAgICAgICAgdGhpcy5nZXRSb2NrKCkuYWRkKHBsYXllcnMuZ2V0Q3VycmVudCgpLmdldE5hbWUoKSk7XG4gICAgICAgICAgICBwbGF5ZXJzLmdldEN1cnJlbnQoKS51cGRhdGVIaXN0b3JpYyh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ2FkZC1yb2NrJyxcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcbiAgICAgICAgICAgICAgICAgICAgeDogdGhpcy54LFxuICAgICAgICAgICAgICAgICAgICB5OiB0aGlzLnlcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgbGV0IGNvbG9yID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgICAgICBpZihwbGF5ZXJzLmdldEN1cnJlbnQoKS5nZXROYW1lKCkgPT0gMil7XG4gICAgICAgICAgICAgICAgY29sb3IgPSAgb3B0aW9uc1sncm9jayddLnBsYXllcjI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjID0gdGhpcy5jYW52YXM7XG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgYy5hcmModGhpcy54ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy55ICogdGhpcy5jZWxsU2l6ZSwgdGhpcy5yb2NrU2l6ZSAvIDIsIDAsIDIgKiBNYXRoLlBJLCBmYWxzZSk7XG4gICAgICAgICAgICBjLmNsb3NlUGF0aCgpO1xuICAgICAgICAgICAgYy5maWxsU3R5bGUgPSBjb2xvcjtcbiAgICAgICAgICAgIGMuZmlsbCgpO1xuXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogVXBkYXRlIGNoYWluc1xuICAgICAqXG4gICAgICovICBcbiAgICB1cGRhdGVDaGFpbnMoKXtcblxuICAgICAgICAvLyBHZXQgbmVpZ2hib3JzXG4gICAgICAgIHZhciBuZWlnaGJvcnMgPSB0aGlzLmdldFJvY2soKS5nZXROZWlnaGJvcmluZ1JvY2tzKCdjdXJyZW50Jyk7XG5cbiAgICAgICAgaWYobmVpZ2hib3JzLmxlbmd0aCAhPSAwKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgLy8gR2V0IGNoYWlucyBmcm9tIG5laWdoYm9yaW5ncyBpbnRlcnNlY3Rpb25zICAgICAgICBcbiAgICAgICAgICAgIGxldCBjaGFpbnNPZk5laWdoYm9ycyA9IFtdO1xuICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIG5laWdoYm9ycyl7XG4gICAgICAgICAgICAgICAgaWYoY2hhaW5zT2ZOZWlnaGJvcnMuaW5kZXhPZihyb2NrLmdldENoYWluKCkpID09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW5zT2ZOZWlnaGJvcnMucHVzaChyb2NrLmdldENoYWluKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ0FTRSAxIDogQWRkIHRoZSByb2NrIHRvIHRoZSBjaGFpblxuICAgICAgICAgICAgaWYoY2hhaW5zT2ZOZWlnaGJvcnMubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgICAgIHZhciBjaGFpbiA9IGNoYWluc09mTmVpZ2hib3JzWzBdOyAvLyBTZXQgaW5kZXggb2YgdGhlIGNoYWluXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENBU0UgMiA6IEpvaW4gY2hhaW5zXG4gICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgIGNoYWluc09mTmVpZ2hib3JzID0gY2hhaW5zT2ZOZWlnaGJvcnMuc29ydCgpO1xuICAgICAgICAgICAgICAgIGxldCBqb2luQ2hhaW4gPSBjaGFpbnNPZk5laWdoYm9yc1swXTtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGNoYWluIG9mIGNoYWluc09mTmVpZ2hib3JzLnJldmVyc2UoKSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGNoYWluICE9IGpvaW5DaGFpbil7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHJvY2sgb2YgY2hhaW5zLnNlbGVjdChjaGFpbikuZ2V0Um9ja3MoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcm9ja3Muc2VsZWN0KHJvY2spLnNldENoYWluKGpvaW5DaGFpbik7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFpbnMuam9pbihqb2luQ2hhaW4sIGNoYWluKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWlucy5zZWxlY3QoY2hhaW4pLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGNoYWluID0gam9pbkNoYWluOyAvLyBTZXQgaW5kZXggb2YgdGhlIGNoYWluXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBDQVNFIDMgOiBDcmVhdGUgbmV3IGNoYWluXG4gICAgICAgIGVsc2V7XG4gICAgICAgICAgICB2YXIgY2hhaW4gPSBjaGFpbnMuY291bnQoKTtcbiAgICAgICAgICAgIGNoYWlucy5hZGQoY2hhaW4pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWRkIGN1cnJlbnQgcm9jayB0byB0aGUgY2hhaW5cbiAgICAgICAgY2hhaW5zLnNlbGVjdChjaGFpbikuYWRkUm9jayh0aGlzLmdldFJvY2soJ3NpbXBsZScpKTtcbiAgICAgICAgdGhpcy5nZXRSb2NrKCkuc2V0Q2hhaW4oY2hhaW4pO1xuXG4gICAgfVxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGdvYmFuIHdpdGggdGhlIHVwZGF0ZSBvZiBjaGFpbnNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgdXBkYXRlR29iYW4oKXtcblxuICAgICAgICBsZXQgbmVpZ2hib3JzID0gdGhpcy5nZXRSb2NrKCkuZ2V0TmVpZ2hib3JpbmdSb2NrcygnZW5uZW15Jyk7XG5cbiAgICAgICAgaWYobmVpZ2hib3JzLmxlbmd0aCAhPSAwKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNoYWluc09mTmVpZ2hib3JzID0gW107XG4gICAgICAgICAgICBmb3IobGV0IHJvY2sgb2YgbmVpZ2hib3JzKXtcbiAgICAgICAgICAgICAgICBpZihjaGFpbnNPZk5laWdoYm9ycy5pbmRleE9mKHJvY2suZ2V0Q2hhaW4oKSkgPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBjaGFpbnNPZk5laWdoYm9ycy5wdXNoKHJvY2suZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBmb3IobGV0IGNoYWluIG9mIGNoYWluc09mTmVpZ2hib3JzKXtcbiAgICAgICAgICAgICAgICBpZihjaGFpbnMuc2VsZWN0KGNoYWluKS5nZXRMaWJlcnRpZXMoKSA9PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJlbW92ZSBjaGFpbiAke2NoYWlufWApO1xuICAgICAgICAgICAgICAgICAgICBmb3IobGV0IHJvY2sgb2YgY2hhaW5zLnNlbGVjdChjaGFpbikuZ2V0Um9ja3MoKSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgeCA9IHJvY2sueCAqIHRoaXMuY2VsbFNpemUgLSAxIC0gdGhpcy5yb2NrU2l6ZSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgeSA9IHJvY2sueSAqIHRoaXMuY2VsbFNpemUgLSAxIC0gdGhpcy5yb2NrU2l6ZSAvIDI7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNhbnZhcy5jbGVhclJlY3QoeCx5LHRoaXMucm9ja1NpemUgKyAyLCB0aGlzLnJvY2tTaXplICsgMik7XG4gICAgICAgICAgICAgICAgICAgICAgICByb2Nrcy5zZWxlY3Qocm9jaykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG5cbmNsYXNzIFNhdmVBY3Rpb25ze1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICB9XG5cbiAgICB1cGRhdGUoKXtcbiAgICB9XG5cbn1cblxuXG5jbGFzcyBTY29yZXtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgfVxuICAgIFxufVxuXG5jbGFzcyBDaGFpbnN7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLmNoYWlucyA9IFtdO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSBjaGFpblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjaGFpbiAoc3RyaW5nKVxyXG4gICAgICovICBcclxuICAgIGFkZChjaGFpbil7XHJcbiAgICAgICAgdGhpcy5jaGFpbnNbY2hhaW5dID0gbmV3IENoYWluKGNoYWluKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2VsZWN0IGEgY2hhaW5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2hhaW4gKGNoYWluKVxyXG4gICAgICogQHJldHVybiBjaGFpbiBvYmplY3Qgc2VsZWN0ZWRcclxuICAgICAqLyAgXHJcbiAgICBzZWxlY3QoY2hhaW4pe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWluc1tjaGFpbl07XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgY2hhaW5zXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLmNoYWluc1xyXG4gICAgICovICBcclxuICAgIGdldCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWlucztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEpvaW4gMiBjaGFpbnNcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgam9pbihqb2luQ2hhaW4sIGNoYWluKXtcclxuICAgICAgICB0aGlzLmNoYWluc1tqb2luQ2hhaW5dLnJvY2tzLnB1c2goLi4udGhpcy5jaGFpbnNbY2hhaW5dLnJvY2tzKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ291bnQgY2hhaW5zXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLmNoYWlucy5sZW5ndGhcclxuICAgICAqLyAgXHJcbiAgICBjb3VudCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWlucy5sZW5ndGg7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuY2xhc3MgQ2hhaW57XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKG5hbWUpe1xyXG4gICAgICAgIHRoaXMucm9ja3MgPSBbXTtcclxuICAgICAgICB0aGlzLmJvcmRlciA9IFtdO1xyXG4gICAgICAgIHRoaXMudGVycml0b3J5ID0gW107XHJcbiAgICAgICAgdGhpcy5uYW1lID0gbmFtZTtcclxuICAgICAgICB0aGlzLnN0YXRlID0gJ2FsaXZlJztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCByb2NrXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGFkZFJvY2socm9jayl7XHJcbiAgICAgICAgdGhpcy5yb2Nrcy5wdXNoKHJvY2spO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHJvY2tzXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGdldFJvY2tzKCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucm9ja3Muc29ydCgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGEgY2hhaW5cclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgcmVtb3ZlKCl7XHJcbiAgICAgICAgdGhpcy5yb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSAnZGVhZCc7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmV0dXJuIGJvcmRlcnMgb2YgdGhlIGNoYWluXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBhcnJheVxyXG4gICAgICovIFxyXG4gICAgZ2V0Qm9yZGVycyhwYXJhbSA9ICdvYmplY3RzJyl7XHJcblxyXG4gICAgICAgIHRoaXMuYm9yZGVyID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgcm9jayBvZiB0aGlzLnJvY2tzKXtcclxuICAgICAgICAgICAgaWYocm9ja3Muc2VsZWN0KHt4OiByb2NrLngsIHk6IHJvY2sueX0pLmdldE5laWdoYm9yaW5nUm9ja3Mocm9ja3MsICdjdXJyZW50JykubGVuZ3RoICE9IDQpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ib3JkZXIucHVzaChyb2NrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYocGFyYW0gPT0gJ2NvdW50Jyl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmJvcmRlci5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdGhpcy5ib3JkZXIuc29ydCgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGxpYmVydGllcyBvZiB0aGUgdGVycml0b3JpZXNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMubGliZXJ0aWVzIChudW1iZXIpXHJcbiAgICAgKi8gXHJcbiAgICBnZXRMaWJlcnRpZXMocGFyYW0gPSAnY291bnQnKXtcclxuXHJcbiAgICAgICAgdGhpcy5saWJlcnRpZXMgPSBbXTtcclxuICAgICAgICBmb3IobGV0IHJvY2sgb2YgdGhpcy5nZXRCb3JkZXJzKHJvY2tzKSl7XHJcbiAgICAgICAgICAgIHRoaXMubGliZXJ0aWVzLnB1c2goLi4ucm9ja3Muc2VsZWN0KHJvY2spLmdldExpYmVydGllcygnb2JqZWN0cycpKTtcclxuICAgICAgICB9ICAgICBcclxuXHJcbiAgICAgICAgaWYocGFyYW0gPT0gJ2NvdW50Jyl7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmxpYmVydGllcy5sZW5ndGg7XHJcbiAgICAgICAgfSAgICBcclxuICAgICAgICByZXR1cm4gdGhpcy5saWJlcnRpZXM7XHJcblxyXG4gICAgfVxyXG59XHJcblxyXG52YXIgY2hhaW5zID0gbmV3IENoYWlucygpO1xuY2xhc3MgUGxheWVyc3tcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudCA9IDE7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzID0gW107XHJcbiAgICAgICAgdGhpcy5wbGF5ZXJzWzFdID0gbmV3IFBsYXllcigxKTtcclxuICAgICAgICB0aGlzLnBsYXllcnNbMl0gPSBuZXcgUGxheWVyKDIpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEN1cnJlbnQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzW3RoaXMuY3VycmVudF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QWR2ZXJzYXJ5KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucGxheWVyc1soKHRoaXMuY3VycmVudCArIDIpICUgMikgKyAxXTtcclxuICAgIH1cclxuXHJcbiAgICBzd2l0Y2goKXtcclxuICAgICAgICB0aGlzLmN1cnJlbnQgPSAoKHRoaXMuY3VycmVudCsrKSAlIDIpICsgMTtcclxuICAgIH1cclxuXHJcbn1cclxuXHJcbmNsYXNzIFBsYXllcntcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuYW1lIG9mIHRoZSBjdXJyZW50IHBsYXllclxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXIpe1xyXG4gICAgICAgIHRoaXMubmFtZSA9IHBsYXllcjtcclxuICAgICAgICB0aGlzLmhpc3RvcmljID0gW107XHJcbiAgICAgICAgdGhpcy5oaXN0b3JpY1swXSA9IHtcclxuICAgICAgICAgICAgdHlwZTogJycsXHJcbiAgICAgICAgfTtcclxuICAgICAgICB0aGlzLmhpc3RvcmljWzFdID0gdGhpcy5oaXN0b3JpY1swXTtcclxuICAgICAgICB0aGlzLmhpc3RvcmljWzJdID0gdGhpcy5oaXN0b3JpY1sxXTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBwbGF5ZXJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMubmFtZVxyXG4gICAgICovICBcclxuICAgIGdldE5hbWUoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5uYW1lO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogVXBkYXRlIGhpc3RvcmljXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIHVwZGF0ZUhpc3RvcmljKGFjdGlvbil7XHJcbiAgICAgICAgdGhpcy5oaXN0b3JpY1swXSA9IHRoaXMuaGlzdG9yaWNbMV07XHJcbiAgICAgICAgdGhpcy5oaXN0b3JpY1sxXSA9IHRoaXMuaGlzdG9yaWNbMl07XHJcbiAgICAgICAgdGhpcy5oaXN0b3JpY1syXSA9IGFjdGlvbjtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBoaXN0b3JpY1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBnZXRIaXN0b3JpYyhpbmRleCA9ICdhbGwnKXtcclxuICAgICAgICBcclxuICAgICAgICBsZXQgcmVzcG9uc2UgPSAnJztcclxuXHJcbiAgICAgICAgc3dpdGNoKGluZGV4KXtcclxuICAgICAgICAgICAgY2FzZSAnYWxsJyA6XHJcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IHRoaXMuaGlzdG9yaWM7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnbGFzdCcgOiBcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gdGhpcy5oaXN0b3JpY1syXTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG5cclxuICAgIH1cclxuICAgICAgICBcclxufVxyXG5cclxudmFyIHBsYXllcnMgPSBuZXcgUGxheWVycygpO1xuY2xhc3MgUm9ja3N7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLnJvY2tzID0gW107XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHJvY2tcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcm9jayAob2JqZWN0KSB7eDogeCwgeTp5fVxyXG4gICAgICovICBcclxuICAgIGFkZChyb2NrKXtcclxuICAgICAgICBpZih0aGlzLnJvY2tzW3JvY2sueF0gPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhpcy5yb2Nrc1tyb2NrLnhdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm9ja3Nbcm9jay54XVtyb2NrLnldID0gbmV3IFJvY2socm9jayk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgcm9ja3NcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMucm9ja3NcclxuICAgICAqLyAgXHJcbiAgICBnZXQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb2NrcztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2VsZWN0IGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByb2NrIChvYmplY3QpIHt4OiB4LCB5Onl9XHJcbiAgICAgKiBAcmV0dXJuIHJvY2sgb2JqZWN0IHNlbGVjdGVkXHJcbiAgICAgKi8gIFxyXG4gICAgc2VsZWN0KHJvY2spe1xyXG4gICAgICAgIGlmKHRoaXMucm9ja3Nbcm9jay54XSAhPSB1bmRlZmluZWQgJiYgdGhpcy5yb2Nrc1tyb2NrLnhdW3JvY2sueV0gIT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9ja3Nbcm9jay54XVtyb2NrLnldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuY2xhc3MgUm9ja3tcclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geCBhbmQgeSAobnVtYmVyKVxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihyb2NrKXtcclxuICAgICAgICB0aGlzLmNoYWluID0gMDtcclxuICAgICAgICB0aGlzLnggPSByb2NrLng7XHJcbiAgICAgICAgdGhpcy55ID0gcm9jay55O1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gMDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBhZGQocGxheWVyKXtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllcjtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICByZW1vdmUocGxheWVyKXtcclxuICAgICAgICB0aGlzLnBsYXllciA9IDA7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBuZWlnaGJvcmluZyByb2Nrc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzZWxlY3QgKHN0cmluZylcclxuICAgICAqIEByZXR1cm4gbmVpZ2hib3Jpbmcgcm9ja3MgKGFycmF5KVxyXG4gICAgICovICBcclxuICAgIGdldE5laWdoYm9yaW5nUm9ja3Moc2VsZWN0ID0gJ2FsbCcpe1xyXG5cclxuICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MgPSBbXTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaT0xIDsgaSA8PSA0IDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIGxldCB5ID0gdGhpcy55O1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoKGkpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHkgPSB5IC0gMTsgLy8gdG9wXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHgrKzsgLy8gcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgeSsrOyAvLyBib3R0b21cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IHggLSAxOyAvLyBsZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByb2NrID0gcm9ja3Muc2VsZWN0KHt4LCB5fSk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxlY3QgIT0gJ2VtcHR5Jyl7XHJcbiAgICAgICAgICAgICAgICBpZihyb2NrICYmIHJvY2suZ2V0UGxheWVyKCkgIT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBpZihyb2NrICYmIHJvY2suZ2V0UGxheWVyKCkgPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzZWxlY3QgIT0gJ2FsbCcgJiYgc2VsZWN0ICE9ICdlbXB0eScpe1xyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXllciA9IHNlbGVjdDtcclxuICAgICAgICAgICAgaWYodHlwZW9mKHNlbGVjdCkgPT0gJ3N0cmluZycpe1xyXG4gICAgICAgICAgICAgICAgcGxheWVyID0gKCh0aGlzLmdldFBsYXllcigpICsgMikgJSAyKSArIDE7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxlY3QgPT0gJ2N1cnJlbnQnKXtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIgPSB0aGlzLmdldFBsYXllcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGkgaW4gdGhpcy5jYWNoZSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm9jayA9IHRoaXMuY2FjaGVbaV07XHJcbiAgICAgICAgICAgICAgICBpZihyb2NrLmdldFBsYXllcigpID09IHBsYXllcil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZWlnaGJvcmluZ1JvY2tzLnB1c2gocm9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5uZWlnaGJvcmluZ1JvY2tzID0gdGhpcy5jYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yaW5nUm9ja3Muc29ydCgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGxpYmVydGllc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gbGliZXJ0aWVzXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0TGliZXJ0aWVzKHBhcmFtID0gJ2NvdW50Jyl7ICBcclxuXHJcbiAgICAgICAgbGV0IG5laWdoYm9ycyA9IHRoaXMuZ2V0TmVpZ2hib3JpbmdSb2NrcygnZW1wdHknKTtcclxuICAgICAgICBpZihwYXJhbSA9PSAnY291bnQnKXtcclxuICAgICAgICAgICAgcmV0dXJuIG5laWdoYm9ycy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZWlnaGJvcnM7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHBsYXllciBcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMucGxheWVyXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0UGxheWVyKCl7ICBcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXI7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBjaGFpbiBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2hhaW4gKG51bWJlcilcclxuICAgICAqLyAgXHJcbiAgICBzZXRDaGFpbihjaGFpbil7ICBcclxuICAgICAgICB0aGlzLmNoYWluID0gY2hhaW47IFxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgY2hhaW4gXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLmNoYWluXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0Q2hhaW4oKXsgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWluO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbnZhciByb2NrcyA9IG5ldyBSb2NrcygpO1xyXG5cbmNsYXNzIEdhbWVwbGF5RGlzcGF0Y2hlcntcclxuXHRcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcclxuICAgIFx0dGhpcy4kbmV4dCA9IFNwcmludChvcHRpb25zWydjb250cm9sJ10ubmV4dCk7XHJcbiAgICBcdHRoaXMuR2FtZXBsYXkgPSBuZXcgR2FtZXBsYXlBY3Rpb25zKCk7XHJcbiAgICAgICAgdGhpcy5TYXZlID0gbmV3IFNhdmVBY3Rpb25zKCk7XHJcbiAgICBcdHRoaXMubGlzdGVubmVyKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGxpc3Rlbm5lcigpe1xyXG5cclxuICAgIFx0U3ByaW50KHRoaXMuJGdvYmFuKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLkdhbWVwbGF5LmFkZFJvY2soZSkpe1xyXG4gICAgICAgICAgICBcdHRoaXMuR2FtZXBsYXkudXBkYXRlQ2hhaW5zKCk7XHJcbiAgICAgICAgICAgIFx0dGhpcy5HYW1lcGxheS51cGRhdGVHb2JhbigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TYXZlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5HYW1lcGxheS5zd2l0Y2hQbGF5ZXJzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgU3ByaW50KHRoaXMuJG5leHQpLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgaWYoIXRoaXMuR2FtZXBsYXkuaXNGaW5pc2hlZCh7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnbmV4dCcsXHJcbiAgICAgICAgICAgICAgICBwbGF5ZXI6ICdwbGF5ZXJzLmdldEN1cnJlbnQoKSdcclxuICAgICAgICAgICAgfSkpe1xyXG4gICAgICAgICAgICAgICAgdGhpcy5HYW1lcGxheS5zd2l0Y2hQbGF5ZXJzKCd1c2VyJyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIHRoaXMuR2FtZXBsYXkuZ2FtZU92ZXIoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH1cclxuXHJcbn1cbi8qKlxuICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSwgVEjDqW8gS251dHogZXQgTMOpbyBMZSBCcmFzXG4gKiBIRVRJQyBQMjAxOVxuICpcbiAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZWxlcilcbiAqXG4gKiBDb3B5cmlnaHQgMjAxNVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKlxuICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcbiAqL1xuXG52YXIgb3B0aW9ucyA9IHtcbiAgICBnb2Jhbjoge1xuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW4nXG4gICAgfSxcbiAgICBnYW1lcGxheToge1xuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW5fZ2FtZXBsYXknXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICAgIG5icmU6ICcxOScsXG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9ncmlkJyxcbiAgICAgICAgY2VsbFNpemU6IDQwLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gICAgICAgIGJvcmRlckNvbG9yOiAnYmxhY2snLFxuICAgICAgICBib3JkZXJXaWR0aDogMlxuICAgIH0sXG4gICAgcm9jazp7XG4gICAgICAgIHNpemU6IDIwLFxuICAgICAgICBwbGF5ZXIxOiAnZ3JleScsXG4gICAgICAgIHBsYXllcjI6ICdibGFjaydcbiAgICB9LFxuICAgIGNvbnRyb2w6e1xuICAgICAgICBuZXh0OiAnLkdhbWVfY29udHJvbF9uZXh0J1xuICAgIH1cbn07XG5cbkdvR2FtZSgpO1xuIl19
