(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) arr2[i] = arr[i]; return arr2; } else { return Array.from(arr); } }

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
        key: 'checkSuicide',

        /**
         * Check if the player is on a case on suicide
         *
         */
        value: function checkSuicide() {

            var neighbors = this.getRock().getNeighboringRocks(this.ennemy.get());
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
                        var rock = chains.select(this.cache[0]).getLiberties('objects')[0];
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
                neighbors = this.getRock().getNeighboringRocks(this.player.get());
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
                        if (rock.x == this.x && rock.y == this.y && rock.getNeighboringRocks(this.ennemy.get()).length == 4 - count) {
                            return true;
                        }
                    }
                }
            }

            return false;
        }
    }, {
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
            if (1 <= this.x && this.x <= this.grid && 1 <= this.y && this.y <= this.grid && this.getRock().getPlayer() == 0 && !this.checkSuicide()) {

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

var GameplayDispatcher = (function () {
    function GameplayDispatcher() {
        _classCallCheck(this, GameplayDispatcher);

        this.$goban = Sprint(options['gameplay'].element);
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
            this.player = player.get();
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

                var _player = select;
                if (typeof select == 'string') {
                    _player = (this.getPlayer() + 2) % 2 + 1;
                    if (select == 'current') {
                        _player = this.getPlayer();
                    }
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2Zha2VfYmY1N2VkZWEuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBLFNBQVMsTUFBTSxHQUFFOztBQUViLFFBQUksV0FBVyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDaEMsZUFBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksUUFBUSxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztBQUN4QyxZQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7Q0FDeEI7O0lBQ0ssT0FBTzs7Ozs7OztBQU1FLGFBTlQsT0FBTyxHQU1JOzhCQU5YLE9BQU87O0FBT0wsWUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2pDLFlBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQzs7QUFFbkQsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7O0FBRTFELFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQyxZQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxD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LElBQUksS0FBSyxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFnQnhCLElBQUksT0FBTyxHQUFHO0FBQ1YsU0FBSyxFQUFFO0FBQ0gsZUFBTyxFQUFFLGFBQWE7S0FDekI7QUFDRCxZQUFRLEVBQUU7QUFDTixlQUFPLEVBQUUsc0JBQXNCO0tBQ2xDO0FBQ0QsUUFBSSxFQUFFO0FBQ0YsWUFBSSxFQUFFLElBQUk7QUFDVixlQUFPLEVBQUUsa0JBQWtCO0FBQzNCLGdCQUFRLEVBQUUsRUFBRTtBQUNaLHVCQUFlLEVBQUUsT0FBTztBQUN4QixtQkFBVyxFQUFFLE9BQU87QUFDcEIsbUJBQVcsRUFBRSxDQUFDO0tBQ2pCO0FBQ0QsUUFBSSxFQUFDO0FBQ0QsWUFBSSxFQUFFLEVBQUU7QUFDUixlQUFPLEVBQUUsTUFBTTtBQUNmLGVBQU8sRUFBRSxPQUFPO0tBQ25CO0NBQ0osQ0FBQzs7QUFFRixNQUFNLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBHb0dhbWUoKXtcblxuICAgIHZhciBHYW1lQnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gICAgR2FtZUJ1aWxkZXIucnVuKCk7XG4gICAgdmFyIEdhbWVwbGF5ID0gbmV3IEdhbWVwbGF5RGlzcGF0Y2hlcigpO1xuICAgIEdhbWVwbGF5Lmxpc3Rlbm5lcigpO1xufVxuY2xhc3MgQnVpbGRlcntcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xuICAgICAgICB0aGlzLmdyaWRib3JkZXJXaWR0aCA9IG9wdGlvbnNbJ2dyaWQnXS5ib3JkZXJXaWR0aDtcblxuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuICAgICAgICB0aGlzLmdyaWRTaXplID0gKHBhcnNlSW50KHRoaXMuZ3JpZCkgKyAxKSAqIHRoaXMuY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ29iYW4nXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkgPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZCA9IFNwcmludChvcHRpb25zWydncmlkJ10uZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5ncmlkQ2FudmFzID0gdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5nYW1lcGxheUNhbnZhcyA9IHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBnb2JhblxuICAgICAqXG4gICAgICogQHJldHVybiBjc3Mgc3R5bGUgb2YgdGhlIGdvYmFuXG4gICAgICovICBcbiAgICBidWlsZEdvYmFuKCl7XG4gICAgICAgIHRoaXMuJGdvYmFuLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdhbWVwbGF5IGNhbnZhc1xuICAgICAqXG4gICAgICogQHJldHVybiBjYW52YXNcbiAgICAgKi8gIFxuICAgIGJ1aWxkR2FtZXBsYXkoKXtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmhlaWdodCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxuICAgICAgICB9KVxuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBncmlkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNhbnZhcyB3aXRoIGEgZ3JpZCBkcmF3blxuICAgICAqLyAgXG4gICAgYnVpbGRHcmlkKCl7XG5cbiAgICAgICAgLy8gU2V0IHNpemUgb2YgY2FudmFzXG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBJbml0IHRoZSBjYW52YXNcbiAgICAgICAgdmFyIGMgPSB0aGlzLmdyaWRDYW52YXM7XG5cbiAgICAgICAgLy8gRHJhdyBlYWNoIGxpbmVzIG9mIHRoZSBncmlkXG4gICAgICAgIGZvcih2YXIgeCA9IDE7IHggPD0gdGhpcy5ncmlkIDsgeCsrKXtcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XG4gICAgICAgICAgICBjLmxpbmVUbyh0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSwgdGhpcy5jZWxsU2l6ZSAqIHgpO1xuICAgICAgICAgICAgYy5saW5lV2lkdGggPSB0aGlzLmdyaWRib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciB5ID0gMTsgeSA8PSB0aGlzLmdyaWQgOyB5Kyspe1xuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGMubW92ZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xuICAgICAgICAgICAgYy5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhbGwgZWxlbWVudHNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgcnVuKCl7XG4gICAgICAgIHRoaXMuYnVpbGRHb2JhbigpO1xuICAgICAgICB0aGlzLmJ1aWxkR2FtZXBsYXkoKTtcbiAgICAgICAgdGhpcy5idWlsZEdyaWQoKTtcbiAgICB9XG5cbn1cbmNsYXNzIEdhbWVwbGF5QWN0aW9uc3tcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9uc1xuICAgICAqLyAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRnb2Jhbi5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuXG4gICAgICAgIHRoaXMucm9jaztcbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIxID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcblxuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoJ2N1cnJlbnQnKTtcbiAgICAgICAgdGhpcy5lbm5lbXkgPSBuZXcgUGxheWVyKCdlbm5lbXknKTtcblxuICAgICAgICB0aGlzLmNhY2hlID0gW107XG5cbiAgICAgICAgZm9yKHRoaXMueD0gMTsgdGhpcy54IDw9IHRoaXMuZ3JpZCA7IHRoaXMueCsrKXtcbiAgICAgICAgICAgIGZvcih0aGlzLnkgPSAxOyB0aGlzLnkgPD0gdGhpcy5ncmlkIDsgdGhpcy55Kyspe1xuICAgICAgICAgICAgICAgIHJvY2tzLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIHggOiB0aGlzLngsXG4gICAgICAgICAgICAgICAgICAgIHkgOiB0aGlzLnlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIHBsYXllciBpcyBvbiBhIGNhc2Ugb24gc3VpY2lkZVxuICAgICAqXG4gICAgICovICBcbiAgICBjaGVja1N1aWNpZGUoKXtcblxuICAgICAgICBsZXQgbmVpZ2hib3JzID0gdGhpcy5nZXRSb2NrKCkuZ2V0TmVpZ2hib3JpbmdSb2Nrcyh0aGlzLmVubmVteS5nZXQoKSk7XG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcblxuICAgICAgICBmb3IobGV0IG5laWdoYm9yIG9mIG5laWdoYm9ycyl7XG4gICAgICAgICAgICBpZih0aGlzLmNhY2hlLmluZGV4T2YobmVpZ2hib3IuZ2V0Q2hhaW4oKSkgPT0gLTEpe1xuICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaChuZWlnaGJvci5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBjb3VudCA9IDA7XG5cbiAgICAgICAgZm9yKGxldCBpdGVtIG9mIHRoaXMuY2FjaGUpe1xuICAgICAgICAgICAgaWYoY2hhaW5zLnNlbGVjdChpdGVtKS5nZXRMaWJlcnRpZXMoKSA9PSAxKXtcbiAgICAgICAgICAgICAgICBsZXQgcm9jayA9IGNoYWlucy5zZWxlY3QodGhpcy5jYWNoZVswXSkuZ2V0TGliZXJ0aWVzKCdvYmplY3RzJylbMF07XG4gICAgICAgICAgICAgICAgaWYocm9jay54ID09IHRoaXMueCAmJiByb2NrLnkgPT0gdGhpcy55KXtcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZihjb3VudCA9PSAwKXtcbiAgICAgICAgICAgIG5laWdoYm9ycyA9IHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3ModGhpcy5wbGF5ZXIuZ2V0KCkpO1xuICAgICAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xuXG4gICAgICAgICAgICBmb3IobGV0IG5laWdoYm9yIG9mIG5laWdoYm9ycyl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbmRleE9mKG5laWdoYm9yLmdldENoYWluKCkpID09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKG5laWdoYm9yLmdldENoYWluKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5sZW5ndGggIT0gIDApe1xuICAgICAgICAgICAgICAgIGNvdW50ID0gMDtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGNoYWluIG9mIHRoaXMuY2FjaGUpe1xuICAgICAgICAgICAgICAgICAgICBpZihjaGFpbnMuc2VsZWN0KGNoYWluKS5nZXRMaWJlcnRpZXMoKSA9PSAxKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYoY291bnQgPT0gdGhpcy5jYWNoZS5sZW5ndGgpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm9jayA9IGNoYWlucy5zZWxlY3QodGhpcy5jYWNoZVswXSkuZ2V0TGliZXJ0aWVzKCdvYmplY3RzJylbMF07XG4gICAgICAgICAgICAgICAgICAgIGlmKHJvY2sueCA9PSB0aGlzLnggJiYgcm9jay55ID09IHRoaXMueSAmJlxuICAgICAgICAgICAgICAgICAgICAgICByb2NrLmdldE5laWdoYm9yaW5nUm9ja3ModGhpcy5lbm5lbXkuZ2V0KCkpLmxlbmd0aCA9PSAoNCAtIGNvdW50KSl7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfVxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBTd2l0Y2ggcGxheWVyc1xuICAgICAqXG4gICAgICovICBcbiAgICBzd2l0Y2hQbGF5ZXJzKCl7XG4gICAgICAgIHRoaXMucGxheWVyLm5leHQoKTtcbiAgICAgICAgdGhpcy5lbm5lbXkubmV4dCgpO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBHZXQgb2JqZWN0IG9mIHRoZSBjdXJyZW50IHJvY2tcbiAgICAgKlxuICAgICAqIEBwYXJtYSB0eXBlIChzdHJpbmcpXG4gICAgICogQHJldHVybiByb2NrIChvYmplY3QpXG4gICAgICovICBcbiAgICBnZXRSb2NrKHR5cGUgPSAnY29tcGxldGUnKXtcblxuICAgICAgICBsZXQgcm9jayA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMueCwgXG4gICAgICAgICAgICB5OiB0aGlzLnlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGUgPT0gJ3NpbXBsZScpe1xuICAgICAgICAgICAgcmV0dXJuIHJvY2s7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm9ja3Muc2VsZWN0KHJvY2spO1xuXG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF5ZXIgY2xpY2sgb24gdGhlIGdvYmFuIHRvIHB1dCBhIHJvY2tcbiAgICAgKlxuICAgICAqLyAgXG4gICAgYWRkUm9jayhlKXtcblxuICAgICAgICAvLyBTZXQgY3VycmVudCByb2NrXG4gICAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IoKGUubGF5ZXJYICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IoKGUubGF5ZXJZICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG5cbiAgICAgICAgLy8gSWYgdGhlIHBsYXllciBjYW4gcGxheSBoZXJlXG4gICAgICAgIGlmKDEgPD0gdGhpcy54ICYmIHRoaXMueCA8PSB0aGlzLmdyaWQgJiYgMSA8PSB0aGlzLnkgJiYgdGhpcy55IDw9IHRoaXMuZ3JpZCBcbiAgICAgICAgICAgICYmIHRoaXMuZ2V0Um9jaygpLmdldFBsYXllcigpID09IDBcbiAgICAgICAgICAgICYmICF0aGlzLmNoZWNrU3VpY2lkZSgpKXtcblxuICAgICAgICAgICAgLy8gRGVidWdcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcqKioqJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUGxheWVyICR7dGhpcy5wbGF5ZXIuZ2V0KCl9IGVuICR7dGhpcy54fTske3RoaXMueX1gKTtcblxuICAgICAgICAgICAgdGhpcy5nZXRSb2NrKCkuYWRkKHRoaXMucGxheWVyKTtcblxuICAgICAgICAgICAgbGV0IGNvbG9yID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgICAgICBpZih0aGlzLnBsYXllci5nZXQoKSA9PSAyKXtcbiAgICAgICAgICAgICAgICBjb2xvciA9ICBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGMgPSB0aGlzLmNhbnZhcztcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjLmFyYyh0aGlzLnggKiB0aGlzLmNlbGxTaXplLCB0aGlzLnkgKiB0aGlzLmNlbGxTaXplLCB0aGlzLnJvY2tTaXplIC8gMiwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgICAgICAgIGMuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjLmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICAgICAgYy5maWxsKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgY2hhaW5zXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHVwZGF0ZUNoYWlucygpe1xuXG4gICAgICAgIC8vIEdldCBuZWlnaGJvcnNcbiAgICAgICAgdmFyIG5laWdoYm9ycyA9IHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3MoJ2N1cnJlbnQnKTtcblxuICAgICAgICBpZihuZWlnaGJvcnMubGVuZ3RoICE9IDApe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHZXQgY2hhaW5zIGZyb20gbmVpZ2hib3JpbmdzIGludGVyc2VjdGlvbnMgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNoYWluc09mTmVpZ2hib3JzID0gW107XG4gICAgICAgICAgICBmb3IobGV0IHJvY2sgb2YgbmVpZ2hib3JzKXtcbiAgICAgICAgICAgICAgICBpZihjaGFpbnNPZk5laWdoYm9ycy5pbmRleE9mKHJvY2suZ2V0Q2hhaW4oKSkgPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBjaGFpbnNPZk5laWdoYm9ycy5wdXNoKHJvY2suZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDQVNFIDEgOiBBZGQgdGhlIHJvY2sgdG8gdGhlIGNoYWluXG4gICAgICAgICAgICBpZihjaGFpbnNPZk5laWdoYm9ycy5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgICAgICAgdmFyIGNoYWluID0gY2hhaW5zT2ZOZWlnaGJvcnNbMF07IC8vIFNldCBpbmRleCBvZiB0aGUgY2hhaW5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ0FTRSAyIDogSm9pbiBjaGFpbnNcbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY2hhaW5zT2ZOZWlnaGJvcnMgPSBjaGFpbnNPZk5laWdoYm9ycy5zb3J0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGpvaW5DaGFpbiA9IGNoYWluc09mTmVpZ2hib3JzWzBdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgY2hhaW4gb2YgY2hhaW5zT2ZOZWlnaGJvcnMucmV2ZXJzZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2hhaW4gIT0gam9pbkNoYWluKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBjaGFpbnMuc2VsZWN0KGNoYWluKS5nZXRSb2NrcygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2Nrcy5zZWxlY3Qocm9jaykuc2V0Q2hhaW4oam9pbkNoYWluKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWlucy5qb2luKGpvaW5DaGFpbiwgY2hhaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5zLnNlbGVjdChjaGFpbikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2hhaW4gPSBqb2luQ2hhaW47IC8vIFNldCBpbmRleCBvZiB0aGUgY2hhaW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENBU0UgMyA6IENyZWF0ZSBuZXcgY2hhaW5cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZhciBjaGFpbiA9IGNoYWlucy5jb3VudCgpO1xuICAgICAgICAgICAgY2hhaW5zLmFkZChjaGFpbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgY3VycmVudCByb2NrIHRvIHRoZSBjaGFpblxuICAgICAgICBjaGFpbnMuc2VsZWN0KGNoYWluKS5hZGRSb2NrKHRoaXMuZ2V0Um9jaygnc2ltcGxlJykpO1xuICAgICAgICB0aGlzLmdldFJvY2soKS5zZXRDaGFpbihjaGFpbik7XG5cbiAgICB9XG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgZ29iYW4gd2l0aCB0aGUgdXBkYXRlIG9mIGNoYWluc1xuICAgICAqXG4gICAgICovICBcbiAgICB1cGRhdGVHb2Jhbigpe1xuXG4gICAgICAgIGxldCBuZWlnaGJvcnMgPSB0aGlzLmdldFJvY2soKS5nZXROZWlnaGJvcmluZ1JvY2tzKCdlbm5lbXknKTtcblxuICAgICAgICBpZihuZWlnaGJvcnMubGVuZ3RoICE9IDApe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgY2hhaW5zT2ZOZWlnaGJvcnMgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKGNoYWluc09mTmVpZ2hib3JzLmluZGV4T2Yocm9jay5nZXRDaGFpbigpKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluc09mTmVpZ2hib3JzLnB1c2gocm9jay5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcihsZXQgY2hhaW4gb2YgY2hhaW5zT2ZOZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKGNoYWlucy5zZWxlY3QoY2hhaW4pLmdldExpYmVydGllcygpID09IDApe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVtb3ZlIGNoYWluICR7Y2hhaW59YCk7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBjaGFpbnMuc2VsZWN0KGNoYWluKS5nZXRSb2NrcygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB4ID0gcm9jay54ICogdGhpcy5jZWxsU2l6ZSAtIDEgLSB0aGlzLnJvY2tTaXplIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB5ID0gcm9jay55ICogdGhpcy5jZWxsU2l6ZSAtIDEgLSB0aGlzLnJvY2tTaXplIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmNsZWFyUmVjdCh4LHksdGhpcy5yb2NrU2l6ZSArIDIsIHRoaXMucm9ja1NpemUgKyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvY2tzLnNlbGVjdChyb2NrKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgU2F2ZUFjdGlvbnN7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgIH1cblxuICAgIHVwZGF0ZSgpe1xuICAgIH1cblxufVxuXG5cbmNsYXNzIFNjb3Jle1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICB9XG4gICAgXG59XG5cbmNsYXNzIEdhbWVwbGF5RGlzcGF0Y2hlcntcclxuXHRcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICBcdHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudCk7XHJcbiAgICBcdHRoaXMuR2FtZXBsYXkgPSBuZXcgR2FtZXBsYXlBY3Rpb25zKCk7XHJcbiAgICAgICAgdGhpcy5TYXZlID0gbmV3IFNhdmVBY3Rpb25zKCk7XHJcbiAgICBcdHRoaXMubGlzdGVubmVyKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGxpc3Rlbm5lcigpe1xyXG5cclxuICAgIFx0U3ByaW50KHRoaXMuJGdvYmFuKS5vbignY2xpY2snLCAoZSkgPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuR2FtZXBsYXkuYWRkUm9jayhlKSl7XHJcbiAgICAgICAgICAgIFx0dGhpcy5HYW1lcGxheS51cGRhdGVDaGFpbnMoKTtcclxuICAgICAgICAgICAgXHR0aGlzLkdhbWVwbGF5LnVwZGF0ZUdvYmFuKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlNhdmUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkdhbWVwbGF5LnN3aXRjaFBsYXllcnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgIH1cclxuXHJcbn1cbmNsYXNzIENoYWluc3tcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuY2hhaW5zID0gW107XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIGNoYWluXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNoYWluIChzdHJpbmcpXHJcbiAgICAgKi8gIFxyXG4gICAgYWRkKGNoYWluKXtcclxuICAgICAgICB0aGlzLmNoYWluc1tjaGFpbl0gPSBuZXcgQ2hhaW4oY2hhaW4pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZWxlY3QgYSBjaGFpblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjaGFpbiAoY2hhaW4pXHJcbiAgICAgKiBAcmV0dXJuIGNoYWluIG9iamVjdCBzZWxlY3RlZFxyXG4gICAgICovICBcclxuICAgIHNlbGVjdChjaGFpbil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW5zW2NoYWluXTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFsbCBjaGFpbnNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMuY2hhaW5zXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW5zO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSm9pbiAyIGNoYWluc1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBqb2luKGpvaW5DaGFpbiwgY2hhaW4pe1xyXG4gICAgICAgIHRoaXMuY2hhaW5zW2pvaW5DaGFpbl0ucm9ja3MucHVzaCguLi50aGlzLmNoYWluc1tjaGFpbl0ucm9ja3MpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb3VudCBjaGFpbnNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMuY2hhaW5zLmxlbmd0aFxyXG4gICAgICovICBcclxuICAgIGNvdW50KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW5zLmxlbmd0aDtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5jbGFzcyBDaGFpbntcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IobmFtZSl7XHJcbiAgICAgICAgdGhpcy5yb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYm9yZGVyID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBbXTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSAnYWxpdmUnO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIHJvY2tcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgYWRkUm9jayhyb2NrKXtcclxuICAgICAgICB0aGlzLnJvY2tzLnB1c2gocm9jayk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgcm9ja3NcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0Um9ja3MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb2Nrcy5zb3J0KCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYSBjaGFpblxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICByZW1vdmUoKXtcclxuICAgICAgICB0aGlzLnJvY2tzID0gW107XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdkZWFkJztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gYm9yZGVycyBvZiB0aGUgY2hhaW5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGFycmF5XHJcbiAgICAgKi8gXHJcbiAgICBnZXRCb3JkZXJzKHBhcmFtID0gJ29iamVjdHMnKXtcclxuXHJcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCByb2NrIG9mIHRoaXMucm9ja3Mpe1xyXG4gICAgICAgICAgICBpZihyb2Nrcy5zZWxlY3Qoe3g6IHJvY2sueCwgeTogcm9jay55fSkuZ2V0TmVpZ2hib3JpbmdSb2Nrcyhyb2NrcywgJ2N1cnJlbnQnKS5sZW5ndGggIT0gNCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvcmRlci5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwYXJhbSA9PSAnY291bnQnKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVyLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmJvcmRlci5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgbGliZXJ0aWVzIG9mIHRoZSB0ZXJyaXRvcmllc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5saWJlcnRpZXMgKG51bWJlcilcclxuICAgICAqLyBcclxuICAgIGdldExpYmVydGllcyhwYXJhbSA9ICdjb3VudCcpe1xyXG5cclxuICAgICAgICB0aGlzLmxpYmVydGllcyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgcm9jayBvZiB0aGlzLmdldEJvcmRlcnMocm9ja3MpKXtcclxuICAgICAgICAgICAgdGhpcy5saWJlcnRpZXMucHVzaCguLi5yb2Nrcy5zZWxlY3Qocm9jaykuZ2V0TGliZXJ0aWVzKCdvYmplY3RzJykpO1xyXG4gICAgICAgIH0gICAgIFxyXG5cclxuICAgICAgICBpZihwYXJhbSA9PSAnY291bnQnKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGliZXJ0aWVzLmxlbmd0aDtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmxpYmVydGllcztcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbnZhciBjaGFpbnMgPSBuZXcgQ2hhaW5zKCk7XG52YXIgcGxheWVyID0gJ2RkJztcclxuXHJcbmNsYXNzIFBsYXllcntcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuYW1lIG9mIHRoZSBjdXJyZW50IHBsYXllclxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXIpe1xyXG4gICAgICAgIHRoaXMubmFtZSA9IDE7XHJcbiAgICAgICAgaWYocGxheWVyID09ICdlbm5lbXknKXtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gMjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTd2l0Y2ggdG8gdGhlIG5leHQgcGxheWVyXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIG5leHQoKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSAoKHRoaXMubmFtZSsrKSAlIDIpICsgMTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBwbGF5ZXJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMubmFtZVxyXG4gICAgICovICBcclxuICAgIGdldChzZWxlY3QgPSAnY3VycmVudCcpe1xyXG4gICAgXHRyZXR1cm4gdGhpcy5uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgICAgICBcclxufVxuY2xhc3MgUm9ja3N7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLnJvY2tzID0gW107XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHJvY2tcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcm9jayAob2JqZWN0KSB7eDogeCwgeTp5fVxyXG4gICAgICovICBcclxuICAgIGFkZChyb2NrKXtcclxuICAgICAgICBpZih0aGlzLnJvY2tzW3JvY2sueF0gPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhpcy5yb2Nrc1tyb2NrLnhdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm9ja3Nbcm9jay54XVtyb2NrLnldID0gbmV3IFJvY2socm9jayk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgcm9ja3NcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMucm9ja3NcclxuICAgICAqLyAgXHJcbiAgICBnZXQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb2NrcztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2VsZWN0IGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByb2NrIChvYmplY3QpIHt4OiB4LCB5Onl9XHJcbiAgICAgKiBAcmV0dXJuIHJvY2sgb2JqZWN0IHNlbGVjdGVkXHJcbiAgICAgKi8gIFxyXG4gICAgc2VsZWN0KHJvY2spe1xyXG4gICAgICAgIGlmKHRoaXMucm9ja3Nbcm9jay54XSAhPSB1bmRlZmluZWQgJiYgdGhpcy5yb2Nrc1tyb2NrLnhdW3JvY2sueV0gIT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9ja3Nbcm9jay54XVtyb2NrLnldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuY2xhc3MgUm9ja3tcclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geCBhbmQgeSAobnVtYmVyKVxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihyb2NrKXtcclxuICAgICAgICB0aGlzLmNoYWluID0gMDtcclxuICAgICAgICB0aGlzLnggPSByb2NrLng7XHJcbiAgICAgICAgdGhpcy55ID0gcm9jay55O1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gMDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBhZGQocGxheWVyKXtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllci5nZXQoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICByZW1vdmUocGxheWVyKXtcclxuICAgICAgICB0aGlzLnBsYXllciA9IDA7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBuZWlnaGJvcmluZyByb2Nrc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzZWxlY3QgKHN0cmluZylcclxuICAgICAqIEByZXR1cm4gbmVpZ2hib3Jpbmcgcm9ja3MgKGFycmF5KVxyXG4gICAgICovICBcclxuICAgIGdldE5laWdoYm9yaW5nUm9ja3Moc2VsZWN0ID0gJ2FsbCcpe1xyXG5cclxuICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MgPSBbXTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaT0xIDsgaSA8PSA0IDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIGxldCB5ID0gdGhpcy55O1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoKGkpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHkgPSB5IC0gMTsgLy8gdG9wXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHgrKzsgLy8gcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgeSsrOyAvLyBib3R0b21cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IHggLSAxOyAvLyBsZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByb2NrID0gcm9ja3Muc2VsZWN0KHt4LCB5fSk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxlY3QgIT0gJ2VtcHR5Jyl7XHJcbiAgICAgICAgICAgICAgICBpZihyb2NrICYmIHJvY2suZ2V0UGxheWVyKCkgIT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBpZihyb2NrICYmIHJvY2suZ2V0UGxheWVyKCkgPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzZWxlY3QgIT0gJ2FsbCcgJiYgc2VsZWN0ICE9ICdlbXB0eScpe1xyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXllciA9IHNlbGVjdDtcclxuICAgICAgICAgICAgaWYodHlwZW9mKHNlbGVjdCkgPT0gJ3N0cmluZycpe1xyXG4gICAgICAgICAgICAgICAgcGxheWVyID0gKCh0aGlzLmdldFBsYXllcigpICsgMikgJSAyKSArIDE7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxlY3QgPT0gJ2N1cnJlbnQnKXtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIgPSB0aGlzLmdldFBsYXllcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGkgaW4gdGhpcy5jYWNoZSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm9jayA9IHRoaXMuY2FjaGVbaV07XHJcbiAgICAgICAgICAgICAgICBpZihyb2NrLmdldFBsYXllcigpID09IHBsYXllcil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZWlnaGJvcmluZ1JvY2tzLnB1c2gocm9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5uZWlnaGJvcmluZ1JvY2tzID0gdGhpcy5jYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yaW5nUm9ja3Muc29ydCgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGxpYmVydGllc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gbGliZXJ0aWVzXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0TGliZXJ0aWVzKHBhcmFtID0gJ2NvdW50Jyl7ICBcclxuXHJcbiAgICAgICAgbGV0IG5laWdoYm9ycyA9IHRoaXMuZ2V0TmVpZ2hib3JpbmdSb2NrcygnZW1wdHknKTtcclxuICAgICAgICBpZihwYXJhbSA9PSAnY291bnQnKXtcclxuICAgICAgICAgICAgcmV0dXJuIG5laWdoYm9ycy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZWlnaGJvcnM7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHBsYXllciBcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMucGxheWVyXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0UGxheWVyKCl7ICBcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXI7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBjaGFpbiBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2hhaW4gKG51bWJlcilcclxuICAgICAqLyAgXHJcbiAgICBzZXRDaGFpbihjaGFpbil7ICBcclxuICAgICAgICB0aGlzLmNoYWluID0gY2hhaW47IFxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgY2hhaW4gXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLmNoYWluXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0Q2hhaW4oKXsgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWluO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbnZhciByb2NrcyA9IG5ldyBSb2NrcygpO1xyXG5cbi8qKlxuICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSwgVEjDqW8gS251dHogZXQgTMOpbyBMZSBCcmFzXG4gKiBIRVRJQyBQMjAxOVxuICpcbiAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZWxlcilcbiAqXG4gKiBDb3B5cmlnaHQgMjAxNVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKlxuICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcbiAqL1xuXG52YXIgb3B0aW9ucyA9IHtcbiAgICBnb2Jhbjoge1xuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW4nXG4gICAgfSxcbiAgICBnYW1lcGxheToge1xuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW5fZ2FtZXBsYXknXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICAgIG5icmU6ICcxOScsXG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9ncmlkJyxcbiAgICAgICAgY2VsbFNpemU6IDQwLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gICAgICAgIGJvcmRlckNvbG9yOiAnYmxhY2snLFxuICAgICAgICBib3JkZXJXaWR0aDogMlxuICAgIH0sXG4gICAgcm9jazp7XG4gICAgICAgIHNpemU6IDIwLFxuICAgICAgICBwbGF5ZXIxOiAnZ3JleScsXG4gICAgICAgIHBsYXllcjI6ICdibGFjaydcbiAgICB9XG59O1xuXG5Hb0dhbWUoKTtcbiJdfQ==
