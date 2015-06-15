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

            var neighbors = this.getRock().getNeighboringRocks(this.player.get());
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

            if (this.cache.length != 0) {
                var count = 0;
                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = this.cache[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var chain = _step2.value;

                        if (chains.select(chain).getLiberties() == 1) {
                            count++;
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

                if (count == this.cache.length) {
                    var rock = chains.select(this.cache[0]).getLiberties('objects')[0];
                    if (rock.x == this.x && rock.y == this.y && rock.getNeighboringRocks(this.ennemy.get()).length == 4 - count) {
                        return true;
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
                var _iteratorNormalCompletion3 = true;
                var _didIteratorError3 = false;
                var _iteratorError3 = undefined;

                try {
                    for (var _iterator3 = neighbors[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                        var rock = _step3.value;

                        if (chainsOfNeighbors.indexOf(rock.getChain()) == -1) {
                            chainsOfNeighbors.push(rock.getChain());
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
                if (chainsOfNeighbors.length == 1) {
                    var chain = chainsOfNeighbors[0]; // Set index of the chain
                }

                // CASE 2 : Join chains
                else {
                    chainsOfNeighbors = chainsOfNeighbors.sort();
                    var joinChain = chainsOfNeighbors[0];
                    var _iteratorNormalCompletion4 = true;
                    var _didIteratorError4 = false;
                    var _iteratorError4 = undefined;

                    try {
                        for (var _iterator4 = chainsOfNeighbors.reverse()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                            var _chain = _step4.value;

                            if (_chain != joinChain) {
                                var _iteratorNormalCompletion5 = true;
                                var _didIteratorError5 = false;
                                var _iteratorError5 = undefined;

                                try {
                                    for (var _iterator5 = chains.select(_chain).getRocks()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                        var rock = _step5.value;

                                        rocks.select(rock).setChain(joinChain);
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

                                chains.join(joinChain, _chain);
                                chains.select(_chain).remove();
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
                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = neighbors[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var rock = _step6.value;

                        if (chainsOfNeighbors.indexOf(rock.getChain()) == -1) {
                            chainsOfNeighbors.push(rock.getChain());
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
                    for (var _iterator7 = chainsOfNeighbors[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
                        var chain = _step7.value;

                        if (chains.select(chain).getLiberties() == 0) {
                            console.log('Remove chain ' + chain);
                            var _iteratorNormalCompletion8 = true;
                            var _didIteratorError8 = false;
                            var _iteratorError8 = undefined;

                            try {
                                for (var _iterator8 = chains.select(chain).getRocks()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
                                    var rock = _step8.value;

                                    var x = rock.x * this.cellSize - 1 - this.rockSize / 2;
                                    var y = rock.y * this.cellSize - 1 - this.rockSize / 2;
                                    this.canvas.clearRect(x, y, this.rockSize + 2, this.rockSize + 2);
                                    rocks.select(rock).remove();
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

            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = this.rocks[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var rock = _step9.value;

                    if (rocks.select({ x: rock.x, y: rock.y }).getNeighboringRocks(rocks, 'current').length != 4) {
                        this.border.push(rock);
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
            var _iteratorNormalCompletion10 = true;
            var _didIteratorError10 = false;
            var _iteratorError10 = undefined;

            try {
                for (var _iterator10 = this.getBorders(rocks)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                    var _liberties;

                    var rock = _step10.value;

                    (_liberties = this.liberties).push.apply(_liberties, _toConsumableArray(rocks.select(rock).getLiberties('objects')));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2Zha2VfZmJkMDU1MWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBLFNBQVMsTUFBTSxHQUFFOztBQUViLFFBQUksV0FBVyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDaEMsZUFBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksUUFBUSxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztBQUN4QyxZQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7Q0FDeEI7O0lBQ0ssT0FBTzs7Ozs7OztBQU1FLGFBTlQsT0FBTyxHQU1JOzhCQU5YLE9BQU87O0FBT0wsWUFBSSxDQUFDLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ2pDLFlBQUksQ0FBQyxlQUFlLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFdBQVcsQ0FBQzs7QUFFbkQsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDO0FBQ3pDLFlBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxRQUFRLENBQUM7O0FBRTFELFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMvQyxZQUFJLENBQUMsZUFBZSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0QsWUFBSSxDQUFDLFdBQVcsR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVuRCxZQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUMzRCxZQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0RTs7aUJBbkJDLE9BQU87Ozs7Ozs7O2VBZ0NDLHNCQUFFO0FBQ1IsZ0JBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDO0FBQ1oscUJBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtBQUNwQixzQkFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLEVBQ3hCLENBQUMsQ0FBQztTQUNOOzs7Ozs7Ozs7ZUFhWSx5QkFBRTtBQUNYLGdCQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNsRCxnQkFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDbkQsZ0JBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDO0FBQ3JCLHFCQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDcEIsc0JBQU0sRUFBRSxJQUFJLENBQUMsUUFBUTthQUN4QixDQUFDLENBQUE7U0FDTDs7Ozs7Ozs7O2VBYVEscUJBQUU7OztBQUdQLGdCQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUM5QyxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7QUFDL0MsZ0JBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDO0FBQ2pCLHFCQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVE7QUFDcEIsc0JBQU0sRUFBRSxJQUFJLENBQUMsUUFBUTthQUN4QixDQUFDLENBQUE7OztBQUdGLGdCQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDOzs7QUFHeEIsaUJBQUksSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFHLENBQUMsRUFBRSxFQUFDO0FBQ2hDLGlCQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDZCxpQkFBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0MsaUJBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLENBQUM7QUFDM0QsaUJBQUMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQztBQUNuQyxpQkFBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQ2Q7QUFDRCxpQkFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUcsQ0FBQyxFQUFFLEVBQUM7QUFDaEMsaUJBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNkLGlCQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzQyxpQkFBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMzRCxpQkFBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO0FBQ25DLGlCQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDZDtTQUNKOzs7Ozs7OztlQVdFLGVBQUU7QUFDRCxnQkFBSSxDQUFDLFVBQVUsRUFBRSxDQUFDO0FBQ2xCLGdCQUFJLENBQUMsYUFBYSxFQUFFLENBQUM7QUFDckIsZ0JBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztTQUNwQjs7O1dBakhDLE9BQU87OztJQW9IUCxlQUFlOzs7Ozs7OztBQU9OLGFBUFQsZUFBZSxHQU9KOzhCQVBYLGVBQWU7O0FBU2IsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDOztBQUVsRCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDOztBQUV6QyxZQUFJLENBQUMsSUFBSSxDQUFDO0FBQ1YsWUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDO0FBQ3JDLFlBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUMzQyxZQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7O0FBRTNDLFlBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDcEMsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFbkMsWUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O0FBRWhCLGFBQUksSUFBSSxDQUFDLENBQUMsR0FBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxFQUFHLElBQUksQ0FBQyxDQUFDLEVBQUUsRUFBQztBQUMxQyxpQkFBSSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFDO0FBQzNDLHFCQUFLLENBQUMsR0FBRyxDQUFDO0FBQ04scUJBQUMsRUFBRyxJQUFJLENBQUMsQ0FBQztBQUNWLHFCQUFDLEVBQUcsSUFBSSxDQUFDLENBQUM7aUJBQ2IsQ0FBQyxDQUFDO2FBQ047U0FDSjtLQUNKOztpQkFqQ0MsZUFBZTs7Ozs7OztlQTJDTCx3QkFBRTs7QUFFVixnQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQztBQUN0RSxnQkFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFFaEIscUNBQW9CLFNBQVMsOEhBQUM7d0JBQXRCLFFBQVE7O0FBQ1osd0JBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUM7QUFDN0MsNEJBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3FCQUN4QztpQkFDSjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGdCQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFLLENBQUMsRUFBQztBQUN2QixvQkFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUFDZCwwQ0FBaUIsSUFBSSxDQUFDLEtBQUssbUlBQUM7NEJBQXBCLEtBQUs7O0FBQ1QsNEJBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUM7QUFDeEMsaUNBQUssRUFBRSxDQUFDO3lCQUNYO3FCQUNKOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Qsb0JBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDO0FBQzFCLHdCQUFJLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkUsd0JBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFDcEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUssQ0FBQyxHQUFHLEtBQUssQUFBQyxFQUFDO0FBQ2pFLCtCQUFPLElBQUksQ0FBQztxQkFDZjtpQkFDSjthQUNKOztBQUVELG1CQUFPLEtBQUssQ0FBQztTQUVoQjs7Ozs7Ozs7ZUFVWSx5QkFBRTtBQUNYLGdCQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ25CLGdCQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3RCOzs7Ozs7Ozs7O2VBYU0sbUJBQW1CO2dCQUFsQixJQUFJLGdDQUFHLFVBQVU7O0FBRXJCLGdCQUFJLElBQUksR0FBRztBQUNQLGlCQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7QUFDVCxpQkFBQyxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQ1osQ0FBQTs7QUFFRCxnQkFBRyxJQUFJLElBQUksUUFBUSxFQUFDO0FBQ2hCLHVCQUFPLElBQUksQ0FBQzthQUNmOztBQUVELG1CQUFPLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7U0FFN0I7Ozs7Ozs7O2VBV00saUJBQUMsQ0FBQyxFQUFDOzs7QUFHTixnQkFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwRSxnQkFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQSxHQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7O0FBR3BFLGdCQUFHLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQ3BFLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLElBQy9CLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxFQUFDOzs7QUFHeEIsdUJBQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUM7QUFDcEIsdUJBQU8sQ0FBQyxHQUFHLGFBQVcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsWUFBTyxJQUFJLENBQUMsQ0FBQyxTQUFJLElBQUksQ0FBQyxDQUFDLENBQUcsQ0FBQzs7QUFFbEUsb0JBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDOztBQUVoQyxvQkFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQztBQUNwQyxvQkFBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxJQUFJLENBQUMsRUFBQztBQUN0Qix5QkFBSyxHQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7aUJBQ3BDOztBQUVELG9CQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0FBQ3BCLGlCQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7QUFDZCxpQkFBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztBQUNoRyxpQkFBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2QsaUJBQUMsQ0FBQyxTQUFTLEdBQUcsS0FBSyxDQUFDO0FBQ3BCLGlCQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7O0FBRVQsdUJBQU8sSUFBSSxDQUFDO2FBQ2Y7O0FBRUQsbUJBQU8sS0FBSyxDQUFDO1NBQ2hCOzs7Ozs7OztlQVdXLHdCQUFFOzs7QUFHVixnQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsQ0FBQyxDQUFDOztBQUU5RCxnQkFBRyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBQzs7O0FBR3JCLG9CQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBQzNCLDBDQUFnQixTQUFTLG1JQUFDOzRCQUFsQixJQUFJOztBQUNSLDRCQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQztBQUNoRCw2Q0FBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7eUJBQzNDO3FCQUNKOzs7Ozs7Ozs7Ozs7Ozs7OztBQUdELG9CQUFHLGlCQUFpQixDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUM7QUFDN0Isd0JBQUksS0FBSyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDO2lCQUNwQzs7O3FCQUdHO0FBQ0EscUNBQWlCLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxFQUFFLENBQUM7QUFDN0Msd0JBQUksU0FBUyxHQUFHLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxDQUFDOzs7Ozs7QUFDckMsOENBQWlCLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxtSUFBQztnQ0FBckMsTUFBSzs7QUFDVCxnQ0FBRyxNQUFLLElBQUksU0FBUyxFQUFDOzs7Ozs7QUFDbEIsMERBQWdCLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBSyxDQUFDLENBQUMsUUFBUSxFQUFFLG1JQUFDOzRDQUF4QyxJQUFJOztBQUNSLDZDQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztxQ0FDMUM7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDRCxzQ0FBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsTUFBSyxDQUFDLENBQUM7QUFDOUIsc0NBQU0sQ0FBQyxNQUFNLENBQUMsTUFBSyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7NkJBQ2pDO3lCQUNKOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsd0JBQUksS0FBSyxHQUFHLFNBQVMsQ0FBQztpQkFDekI7YUFDSjs7O2lCQUdHO0FBQ0Esb0JBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUMzQixzQkFBTSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNyQjs7O0FBR0Qsa0JBQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztBQUNyRCxnQkFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUVsQzs7Ozs7Ozs7ZUFVVSx1QkFBRTs7QUFFVCxnQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUU3RCxnQkFBRyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBQzs7QUFFckIsb0JBQUksaUJBQWlCLEdBQUcsRUFBRSxDQUFDOzs7Ozs7QUFDM0IsMENBQWdCLFNBQVMsbUlBQUM7NEJBQWxCLElBQUk7O0FBQ1IsNEJBQUcsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDO0FBQ2hELDZDQUFpQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQzt5QkFDM0M7cUJBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVELDBDQUFpQixpQkFBaUIsbUlBQUM7NEJBQTNCLEtBQUs7O0FBQ1QsNEJBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUM7QUFDeEMsbUNBQU8sQ0FBQyxHQUFHLG1CQUFpQixLQUFLLENBQUcsQ0FBQzs7Ozs7O0FBQ3JDLHNEQUFnQixNQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxtSUFBQzt3Q0FBeEMsSUFBSTs7QUFDUix3Q0FBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUN2RCx3Q0FBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQztBQUN2RCx3Q0FBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQyxDQUFDO0FBQ2hFLHlDQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDO2lDQUMvQjs7Ozs7Ozs7Ozs7Ozs7O3lCQUNKO3FCQUNKOzs7Ozs7Ozs7Ozs7Ozs7YUFDSjtTQUNKOzs7V0F6UEMsZUFBZTs7O0lBNFBmLFdBQVc7QUFFRixhQUZULFdBQVcsR0FFQTs4QkFGWCxXQUFXO0tBR1o7O2lCQUhDLFdBQVc7O2VBS1Asa0JBQUUsRUFDUDs7O1dBTkMsV0FBVzs7O0lBV1gsS0FBSyxHQUVJLFNBRlQsS0FBSyxHQUVNOzBCQUZYLEtBQUs7Q0FHTjs7SUFJQyxrQkFBa0I7QUFFVCxhQUZULGtCQUFrQixHQUVQOzhCQUZYLGtCQUFrQjs7QUFHbkIsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xELFlBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQztBQUNuQyxZQUFJLENBQUMsSUFBSSxHQUFHLElBQUksV0FBVyxFQUFFLENBQUM7QUFDakMsWUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO0tBQ2pCOztpQkFQQyxrQkFBa0I7O2VBVVgscUJBQUU7OztBQUVWLGtCQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsVUFBQyxDQUFDLEVBQUk7QUFDL0Isb0JBQUcsTUFBSyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFDO0FBQzNCLDBCQUFLLFFBQVEsQ0FBQyxZQUFZLEVBQUUsQ0FBQztBQUM3QiwwQkFBSyxRQUFRLENBQUMsV0FBVyxFQUFFLENBQUM7QUFDekIsMEJBQUssSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0FBQ25CLDBCQUFLLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztpQkFDakM7YUFDSixFQUFFLElBQUksQ0FBQyxDQUFDO1NBRVo7OztXQXJCQyxrQkFBa0I7OztJQXdCbEIsTUFBTTs7Ozs7OztBQU1HLGFBTlQsTUFBTSxHQU1LOzhCQU5YLE1BQU07O0FBT0osWUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7S0FDcEI7O2lCQVJDLE1BQU07Ozs7Ozs7O2VBb0JMLGFBQUMsS0FBSyxFQUFDO0FBQ04sZ0JBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7U0FDekM7Ozs7Ozs7Ozs7ZUFhSyxnQkFBQyxLQUFLLEVBQUM7QUFDVCxtQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQzdCOzs7Ozs7Ozs7ZUFZRSxlQUFFO0FBQ0QsbUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN0Qjs7Ozs7Ozs7ZUFTRyxjQUFDLFNBQVMsRUFBRSxLQUFLLEVBQUM7OztBQUNsQix1Q0FBQSxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEtBQUssRUFBQyxJQUFJLE1BQUEsNkNBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxLQUFLLEVBQUMsQ0FBQztTQUNsRTs7Ozs7Ozs7O2VBWUksaUJBQUU7QUFDSCxtQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztTQUM3Qjs7O1dBNUVDLE1BQU07OztJQWlGTixLQUFLOzs7Ozs7O0FBT0ksYUFQVCxLQUFLLENBT0ssSUFBSSxFQUFDOzhCQVBmLEtBQUs7O0FBUUgsWUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDaEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7QUFDakIsWUFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7QUFDcEIsWUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7QUFDakIsWUFBSSxDQUFDLEtBQUssR0FBRyxPQUFPLENBQUM7S0FDeEI7O2lCQWJDLEtBQUs7Ozs7Ozs7ZUFzQkEsaUJBQUMsSUFBSSxFQUFDO0FBQ1QsZ0JBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3pCOzs7Ozs7OztlQVNPLG9CQUFFO0FBQ04sbUJBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUM1Qjs7Ozs7Ozs7ZUFTSyxrQkFBRTtBQUNKLGdCQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztBQUNoQixnQkFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7U0FDdkI7Ozs7Ozs7OztlQVdTLHNCQUFtQjtnQkFBbEIsS0FBSyxnQ0FBRyxTQUFTOztBQUV4QixnQkFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7Ozs7Ozs7QUFFakIsc0NBQWdCLElBQUksQ0FBQyxLQUFLLG1JQUFDO3dCQUFuQixJQUFJOztBQUNSLHdCQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsbUJBQW1CLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUM7QUFDdEYsNEJBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUMxQjtpQkFDSjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGdCQUFHLEtBQUssSUFBSSxPQUFPLEVBQUM7QUFDaEIsdUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7YUFDN0I7O0FBRUQsbUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUU3Qjs7Ozs7Ozs7O2VBWVcsd0JBQWlCO2dCQUFoQixLQUFLLGdDQUFHLE9BQU87O0FBRXhCLGdCQUFJLENBQUMsU0FBUyxHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBQ3BCLHVDQUFnQixJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyx3SUFBQzs7O3dCQUEvQixJQUFJOztBQUNSLGtDQUFBLElBQUksQ0FBQyxTQUFTLEVBQUMsSUFBSSxNQUFBLGdDQUFJLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxFQUFDLENBQUM7aUJBQ3RFOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsZ0JBQUcsS0FBSyxJQUFJLE9BQU8sRUFBQztBQUNoQix1QkFBTyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQzthQUNoQztBQUNELG1CQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7U0FFekI7OztXQWxHQyxLQUFLOzs7QUFxR1gsSUFBSSxNQUFNLEdBQUcsSUFBSSxNQUFNLEVBQUUsQ0FBQztBQUMxQixJQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7O0lBRVosTUFBTTs7Ozs7Ozs7QUFRRyxhQVJULE1BQU0sQ0FRSSxNQUFNLEVBQUM7OEJBUmpCLE1BQU07O0FBU0osWUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUM7QUFDZCxZQUFHLE1BQU0sSUFBSSxRQUFRLEVBQUM7QUFDbEIsZ0JBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO1NBQ2pCO0tBQ0o7O2lCQWJDLE1BQU07Ozs7Ozs7ZUFzQkosZ0JBQUU7QUFDRixnQkFBSSxDQUFDLElBQUksR0FBRyxBQUFDLEFBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxHQUFJLENBQUMsR0FBSSxDQUFDLENBQUM7U0FDdkM7Ozs7Ozs7OztlQVVFLGVBQW9CO2dCQUFuQixNQUFNLGdDQUFHLFNBQVM7O0FBQ3JCLG1CQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7U0FDakI7OztXQXBDQyxNQUFNOzs7SUF3Q04sS0FBSzs7Ozs7OztBQU1JLGFBTlQsS0FBSyxHQU1NOzhCQU5YLEtBQUs7O0FBT0gsWUFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7S0FDbkI7O2lCQVJDLEtBQUs7Ozs7Ozs7O2VBb0JKLGFBQUMsSUFBSSxFQUFDO0FBQ0wsZ0JBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxFQUFDO0FBQy9CLG9CQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUM7YUFDM0I7QUFDRCxnQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQy9DOzs7Ozs7Ozs7ZUFZRSxlQUFFO0FBQ0QsbUJBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNyQjs7Ozs7Ozs7OztlQWFLLGdCQUFDLElBQUksRUFBQztBQUNSLGdCQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsSUFBSSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksU0FBUyxFQUFDO0FBQzFFLHVCQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNyQztBQUNELG1CQUFPLEtBQUssQ0FBQztTQUNoQjs7O1dBekRDLEtBQUs7OztJQThETCxJQUFJOzs7Ozs7OztBQVNLLGFBVFQsSUFBSSxDQVNNLElBQUksRUFBQzs4QkFUZixJQUFJOztBQVVGLFlBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0FBQ2YsWUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQ2hCLFlBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNoQixZQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztLQUNuQjs7aUJBZEMsSUFBSTs7Ozs7OztlQXlCSCxhQUFDLE1BQU0sRUFBQztBQUNQLGdCQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztTQUM5Qjs7Ozs7Ozs7ZUFXSyxnQkFBQyxNQUFNLEVBQUM7QUFDVixnQkFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7U0FDbkI7Ozs7Ozs7Ozs7ZUFha0IsK0JBQWdCO2dCQUFmLE1BQU0sZ0NBQUcsS0FBSzs7QUFFOUIsZ0JBQUksQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUM7QUFDM0IsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVoQixpQkFBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRyxDQUFDLEVBQUUsRUFBQztBQUN2QixvQkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNmLG9CQUFJLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDOztBQUVmLHdCQUFPLENBQUM7QUFDSix5QkFBSyxDQUFDO0FBQ0YseUJBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1YsOEJBQU07O0FBQUEsQUFFVix5QkFBSyxDQUFDO0FBQ0YseUJBQUMsRUFBRSxDQUFDO0FBQ0osOEJBQU07O0FBQUEsQUFFVix5QkFBSyxDQUFDO0FBQ0YseUJBQUMsRUFBRSxDQUFDO0FBQ0osOEJBQU07O0FBQUEsQUFFVix5QkFBSyxDQUFDO0FBQ0YseUJBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0FBQ1YsOEJBQU07QUFBQSxpQkFDYjs7QUFFRCxvQkFBSSxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFDLENBQUMsRUFBRCxDQUFDLEVBQUUsQ0FBQyxFQUFELENBQUMsRUFBQyxDQUFDLENBQUM7O0FBRWhDLG9CQUFHLE1BQU0sSUFBSSxPQUFPLEVBQUM7QUFDakIsd0JBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQUM7QUFDN0IsNEJBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUN6QjtpQkFDSixNQUNHO0FBQ0Esd0JBQUcsSUFBSSxJQUFJLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEVBQUM7QUFDN0IsNEJBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUN6QjtpQkFDSjthQUNKOztBQUVELGdCQUFHLE1BQU0sSUFBSSxLQUFLLElBQUksTUFBTSxJQUFJLE9BQU8sRUFBQzs7QUFFcEMsb0JBQUksT0FBTSxHQUFHLE1BQU0sQ0FBQztBQUNwQixvQkFBRyxPQUFPLE1BQU0sQUFBQyxJQUFJLFFBQVEsRUFBQztBQUMxQiwyQkFBTSxHQUFHLEFBQUMsQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLEdBQUcsQ0FBQyxDQUFBLEdBQUksQ0FBQyxHQUFJLENBQUMsQ0FBQztBQUMxQyx3QkFBRyxNQUFNLElBQUksU0FBUyxFQUFDO0FBQ25CLCtCQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO3FCQUM3QjtpQkFDSjs7QUFFRCxxQkFBSSxJQUFJLENBQUMsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFDO0FBQ3BCLHdCQUFJLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3pCLHdCQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxPQUFNLEVBQUM7QUFDMUIsNEJBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7cUJBQ3BDO2lCQUNKO2FBQ0osTUFDRztBQUNBLG9CQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUN0Qzs7QUFFRCxtQkFBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxFQUFFLENBQUM7U0FFdkM7Ozs7Ozs7OztlQVlXLHdCQUFpQjtnQkFBaEIsS0FBSyxnQ0FBRyxPQUFPOztBQUV4QixnQkFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQ2xELGdCQUFHLEtBQUssSUFBSSxPQUFPLEVBQUM7QUFDaEIsdUJBQU8sU0FBUyxDQUFDLE1BQU0sQ0FBQzthQUMzQjtBQUNELG1CQUFPLFNBQVMsQ0FBQztTQUVwQjs7Ozs7Ozs7O2VBWVEscUJBQUU7QUFDUCxtQkFBTyxJQUFJLENBQUMsTUFBTSxDQUFDO1NBQ3RCOzs7Ozs7Ozs7ZUFZTyxrQkFBQyxLQUFLLEVBQUM7QUFDWCxnQkFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7U0FDdEI7Ozs7Ozs7OztlQVlPLG9CQUFFO0FBQ04sbUJBQU8sSUFBSSxDQUFDLEtBQUssQ0FBQztTQUNyQjs7O1dBbkxDLElBQUk7OztBQXdMVixJQUFJLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBZ0J4QixJQUFJLE9BQU8sR0FBRztBQUNWLFNBQUssRUFBRTtBQUNILGVBQU8sRUFBRSxhQUFhO0tBQ3pCO0FBQ0QsWUFBUSxFQUFFO0FBQ04sZUFBTyxFQUFFLHNCQUFzQjtLQUNsQztBQUNELFFBQUksRUFBRTtBQUNGLFlBQUksRUFBRSxJQUFJO0FBQ1YsZUFBTyxFQUFFLGtCQUFrQjtBQUMzQixnQkFBUSxFQUFFLEVBQUU7QUFDWix1QkFBZSxFQUFFLE9BQU87QUFDeEIsbUJBQVcsRUFBRSxPQUFPO0FBQ3BCLG1CQUFXLEVBQUUsQ0FBQztLQUNqQjtBQUNELFFBQUksRUFBQztBQUNELFlBQUksRUFBRSxFQUFFO0FBQ1IsZUFBTyxFQUFFLE1BQU07QUFDZixlQUFPLEVBQUUsT0FBTztLQUNuQjtDQUNKLENBQUM7O0FBRUYsTUFBTSxFQUFFLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiZnVuY3Rpb24gR29HYW1lKCl7XG5cbiAgICB2YXIgR2FtZUJ1aWxkZXIgPSBuZXcgQnVpbGRlcigpO1xuICAgIEdhbWVCdWlsZGVyLnJ1bigpO1xuICAgIHZhciBHYW1lcGxheSA9IG5ldyBHYW1lcGxheURpc3BhdGNoZXIoKTtcbiAgICBHYW1lcGxheS5saXN0ZW5uZXIoKTtcbn1cbmNsYXNzIEJ1aWxkZXJ7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICovICAgICBcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcbiAgICAgICAgdGhpcy5ncmlkYm9yZGVyV2lkdGggPSBvcHRpb25zWydncmlkJ10uYm9yZGVyV2lkdGg7XG5cbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcbiAgICAgICAgdGhpcy5ncmlkU2l6ZSA9IChwYXJzZUludCh0aGlzLmdyaWQpICsgMSkgKiB0aGlzLmNlbGxTaXplO1xuXG4gICAgICAgIHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2dvYmFuJ10uZWxlbWVudCk7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5ID0gU3ByaW50KG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudCk7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQgPSBTcHJpbnQob3B0aW9uc1snZ3JpZCddLmVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuZ3JpZENhbnZhcyA9IHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIHRoaXMuZ2FtZXBsYXlDYW52YXMgPSB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB9XG5cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB0aGUgZ29iYW5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gY3NzIHN0eWxlIG9mIHRoZSBnb2JhblxuICAgICAqLyAgXG4gICAgYnVpbGRHb2Jhbigpe1xuICAgICAgICB0aGlzLiRnb2Jhbi5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBnYW1lcGxheSBjYW52YXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4gY2FudmFzXG4gICAgICovICBcbiAgICBidWlsZEdhbWVwbGF5KCl7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS5oZWlnaHQgPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcbiAgICAgICAgfSlcbiAgICB9XG5cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB0aGUgZ3JpZFxuICAgICAqXG4gICAgICogQHJldHVybiBjYW52YXMgd2l0aCBhIGdyaWQgZHJhd25cbiAgICAgKi8gIFxuICAgIGJ1aWxkR3JpZCgpe1xuXG4gICAgICAgIC8vIFNldCBzaXplIG9mIGNhbnZhc1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLmhlaWdodCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gSW5pdCB0aGUgY2FudmFzXG4gICAgICAgIHZhciBjID0gdGhpcy5ncmlkQ2FudmFzO1xuXG4gICAgICAgIC8vIERyYXcgZWFjaCBsaW5lcyBvZiB0aGUgZ3JpZFxuICAgICAgICBmb3IodmFyIHggPSAxOyB4IDw9IHRoaXMuZ3JpZCA7IHgrKyl7XG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgYy5tb3ZlVG8odGhpcy5jZWxsU2l6ZSwgdGhpcy5jZWxsU2l6ZSAqIHgpO1xuICAgICAgICAgICAgYy5saW5lVG8odGhpcy5ncmlkU2l6ZSAtIHRoaXMuY2VsbFNpemUsIHRoaXMuY2VsbFNpemUgKiB4KTtcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gdGhpcy5ncmlkYm9yZGVyV2lkdGg7XG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIgeSA9IDE7IHkgPD0gdGhpcy5ncmlkIDsgeSsrKXtcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplICogeSwgdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICBjLmxpbmVUbyh0aGlzLmNlbGxTaXplICogeSwgdGhpcy5ncmlkU2l6ZSAtIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgYy5saW5lV2lkdGggPSB0aGlzLmdyaWRib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgYWxsIGVsZW1lbnRzXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHJ1bigpe1xuICAgICAgICB0aGlzLmJ1aWxkR29iYW4oKTtcbiAgICAgICAgdGhpcy5idWlsZEdhbWVwbGF5KCk7XG4gICAgICAgIHRoaXMuYnVpbGRHcmlkKCk7XG4gICAgfVxuXG59XG5jbGFzcyBHYW1lcGxheUFjdGlvbnN7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICogQHBhcmFtIGFycmF5IG9wdGlvbnNcbiAgICAgKi8gICBcbiAgICBjb25zdHJ1Y3Rvcigpe1xuXG4gICAgICAgIHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudCk7XG4gICAgICAgIHRoaXMuY2FudmFzID0gdGhpcy4kZ29iYW4uZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcblxuICAgICAgICB0aGlzLnJvY2s7XG4gICAgICAgIHRoaXMucm9ja1NpemUgPSBvcHRpb25zWydyb2NrJ10uc2l6ZTtcbiAgICAgICAgdGhpcy5yb2NrUGxheWVyMSA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIxO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIyID0gb3B0aW9uc1sncm9jayddLnBsYXllcjI7XG5cbiAgICAgICAgdGhpcy5wbGF5ZXIgPSBuZXcgUGxheWVyKCdjdXJyZW50Jyk7XG4gICAgICAgIHRoaXMuZW5uZW15ID0gbmV3IFBsYXllcignZW5uZW15Jyk7XG5cbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xuXG4gICAgICAgIGZvcih0aGlzLng9IDE7IHRoaXMueCA8PSB0aGlzLmdyaWQgOyB0aGlzLngrKyl7XG4gICAgICAgICAgICBmb3IodGhpcy55ID0gMTsgdGhpcy55IDw9IHRoaXMuZ3JpZCA7IHRoaXMueSsrKXtcbiAgICAgICAgICAgICAgICByb2Nrcy5hZGQoe1xuICAgICAgICAgICAgICAgICAgICB4IDogdGhpcy54LFxuICAgICAgICAgICAgICAgICAgICB5IDogdGhpcy55XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSBwbGF5ZXIgaXMgb24gYSBjYXNlIG9uIHN1aWNpZGVcbiAgICAgKlxuICAgICAqLyAgXG4gICAgY2hlY2tTdWljaWRlKCl7XG5cbiAgICAgICAgbGV0IG5laWdoYm9ycyA9IHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3ModGhpcy5wbGF5ZXIuZ2V0KCkpO1xuICAgICAgICB0aGlzLmNhY2hlID0gW107XG5cbiAgICAgICAgZm9yKGxldCBuZWlnaGJvciBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbmRleE9mKG5laWdoYm9yLmdldENoYWluKCkpID09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2gobmVpZ2hib3IuZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZih0aGlzLmNhY2hlLmxlbmd0aCAhPSAgMCl7XG4gICAgICAgICAgICBsZXQgY291bnQgPSAwO1xuICAgICAgICAgICAgZm9yKGxldCBjaGFpbiBvZiB0aGlzLmNhY2hlKXtcbiAgICAgICAgICAgICAgICBpZihjaGFpbnMuc2VsZWN0KGNoYWluKS5nZXRMaWJlcnRpZXMoKSA9PSAxKXtcbiAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZihjb3VudCA9PSB0aGlzLmNhY2hlLmxlbmd0aCl7XG4gICAgICAgICAgICAgICAgbGV0IHJvY2sgPSBjaGFpbnMuc2VsZWN0KHRoaXMuY2FjaGVbMF0pLmdldExpYmVydGllcygnb2JqZWN0cycpWzBdO1xuICAgICAgICAgICAgICAgIGlmKHJvY2sueCA9PSB0aGlzLnggJiYgcm9jay55ID09IHRoaXMueSAmJlxuICAgICAgICAgICAgICAgICAgIHJvY2suZ2V0TmVpZ2hib3JpbmdSb2Nrcyh0aGlzLmVubmVteS5nZXQoKSkubGVuZ3RoID09ICg0IC0gY291bnQpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuXG4gICAgfVxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBTd2l0Y2ggcGxheWVyc1xuICAgICAqXG4gICAgICovICBcbiAgICBzd2l0Y2hQbGF5ZXJzKCl7XG4gICAgICAgIHRoaXMucGxheWVyLm5leHQoKTtcbiAgICAgICAgdGhpcy5lbm5lbXkubmV4dCgpO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBHZXQgb2JqZWN0IG9mIHRoZSBjdXJyZW50IHJvY2tcbiAgICAgKlxuICAgICAqIEBwYXJtYSB0eXBlIChzdHJpbmcpXG4gICAgICogQHJldHVybiByb2NrIChvYmplY3QpXG4gICAgICovICBcbiAgICBnZXRSb2NrKHR5cGUgPSAnY29tcGxldGUnKXtcblxuICAgICAgICBsZXQgcm9jayA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMueCwgXG4gICAgICAgICAgICB5OiB0aGlzLnlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGUgPT0gJ3NpbXBsZScpe1xuICAgICAgICAgICAgcmV0dXJuIHJvY2s7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm9ja3Muc2VsZWN0KHJvY2spO1xuXG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF5ZXIgY2xpY2sgb24gdGhlIGdvYmFuIHRvIHB1dCBhIHJvY2tcbiAgICAgKlxuICAgICAqLyAgXG4gICAgYWRkUm9jayhlKXtcblxuICAgICAgICAvLyBTZXQgY3VycmVudCByb2NrXG4gICAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IoKGUubGF5ZXJYICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IoKGUubGF5ZXJZICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG5cbiAgICAgICAgLy8gSWYgdGhlIHBsYXllciBjYW4gcGxheSBoZXJlXG4gICAgICAgIGlmKDEgPD0gdGhpcy54ICYmIHRoaXMueCA8PSB0aGlzLmdyaWQgJiYgMSA8PSB0aGlzLnkgJiYgdGhpcy55IDw9IHRoaXMuZ3JpZCBcbiAgICAgICAgICAgICYmIHRoaXMuZ2V0Um9jaygpLmdldFBsYXllcigpID09IDBcbiAgICAgICAgICAgICYmICF0aGlzLmNoZWNrU3VpY2lkZSgpKXtcblxuICAgICAgICAgICAgLy8gRGVidWdcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcqKioqJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUGxheWVyICR7dGhpcy5wbGF5ZXIuZ2V0KCl9IGVuICR7dGhpcy54fTske3RoaXMueX1gKTtcblxuICAgICAgICAgICAgdGhpcy5nZXRSb2NrKCkuYWRkKHRoaXMucGxheWVyKTtcblxuICAgICAgICAgICAgbGV0IGNvbG9yID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgICAgICBpZih0aGlzLnBsYXllci5nZXQoKSA9PSAyKXtcbiAgICAgICAgICAgICAgICBjb2xvciA9ICBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGMgPSB0aGlzLmNhbnZhcztcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjLmFyYyh0aGlzLnggKiB0aGlzLmNlbGxTaXplLCB0aGlzLnkgKiB0aGlzLmNlbGxTaXplLCB0aGlzLnJvY2tTaXplIC8gMiwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgICAgICAgIGMuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjLmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICAgICAgYy5maWxsKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgY2hhaW5zXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHVwZGF0ZUNoYWlucygpe1xuXG4gICAgICAgIC8vIEdldCBuZWlnaGJvcnNcbiAgICAgICAgdmFyIG5laWdoYm9ycyA9IHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3MoJ2N1cnJlbnQnKTtcblxuICAgICAgICBpZihuZWlnaGJvcnMubGVuZ3RoICE9IDApe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHZXQgY2hhaW5zIGZyb20gbmVpZ2hib3JpbmdzIGludGVyc2VjdGlvbnMgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNoYWluc09mTmVpZ2hib3JzID0gW107XG4gICAgICAgICAgICBmb3IobGV0IHJvY2sgb2YgbmVpZ2hib3JzKXtcbiAgICAgICAgICAgICAgICBpZihjaGFpbnNPZk5laWdoYm9ycy5pbmRleE9mKHJvY2suZ2V0Q2hhaW4oKSkgPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBjaGFpbnNPZk5laWdoYm9ycy5wdXNoKHJvY2suZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDQVNFIDEgOiBBZGQgdGhlIHJvY2sgdG8gdGhlIGNoYWluXG4gICAgICAgICAgICBpZihjaGFpbnNPZk5laWdoYm9ycy5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgICAgICAgdmFyIGNoYWluID0gY2hhaW5zT2ZOZWlnaGJvcnNbMF07IC8vIFNldCBpbmRleCBvZiB0aGUgY2hhaW5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ0FTRSAyIDogSm9pbiBjaGFpbnNcbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY2hhaW5zT2ZOZWlnaGJvcnMgPSBjaGFpbnNPZk5laWdoYm9ycy5zb3J0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGpvaW5DaGFpbiA9IGNoYWluc09mTmVpZ2hib3JzWzBdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgY2hhaW4gb2YgY2hhaW5zT2ZOZWlnaGJvcnMucmV2ZXJzZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2hhaW4gIT0gam9pbkNoYWluKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBjaGFpbnMuc2VsZWN0KGNoYWluKS5nZXRSb2NrcygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2Nrcy5zZWxlY3Qocm9jaykuc2V0Q2hhaW4oam9pbkNoYWluKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWlucy5qb2luKGpvaW5DaGFpbiwgY2hhaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5zLnNlbGVjdChjaGFpbikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2hhaW4gPSBqb2luQ2hhaW47IC8vIFNldCBpbmRleCBvZiB0aGUgY2hhaW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENBU0UgMyA6IENyZWF0ZSBuZXcgY2hhaW5cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZhciBjaGFpbiA9IGNoYWlucy5jb3VudCgpO1xuICAgICAgICAgICAgY2hhaW5zLmFkZChjaGFpbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgY3VycmVudCByb2NrIHRvIHRoZSBjaGFpblxuICAgICAgICBjaGFpbnMuc2VsZWN0KGNoYWluKS5hZGRSb2NrKHRoaXMuZ2V0Um9jaygnc2ltcGxlJykpO1xuICAgICAgICB0aGlzLmdldFJvY2soKS5zZXRDaGFpbihjaGFpbik7XG5cbiAgICB9XG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgZ29iYW4gd2l0aCB0aGUgdXBkYXRlIG9mIGNoYWluc1xuICAgICAqXG4gICAgICovICBcbiAgICB1cGRhdGVHb2Jhbigpe1xuXG4gICAgICAgIGxldCBuZWlnaGJvcnMgPSB0aGlzLmdldFJvY2soKS5nZXROZWlnaGJvcmluZ1JvY2tzKCdlbm5lbXknKTtcblxuICAgICAgICBpZihuZWlnaGJvcnMubGVuZ3RoICE9IDApe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgY2hhaW5zT2ZOZWlnaGJvcnMgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKGNoYWluc09mTmVpZ2hib3JzLmluZGV4T2Yocm9jay5nZXRDaGFpbigpKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluc09mTmVpZ2hib3JzLnB1c2gocm9jay5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcihsZXQgY2hhaW4gb2YgY2hhaW5zT2ZOZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKGNoYWlucy5zZWxlY3QoY2hhaW4pLmdldExpYmVydGllcygpID09IDApe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVtb3ZlIGNoYWluICR7Y2hhaW59YCk7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBjaGFpbnMuc2VsZWN0KGNoYWluKS5nZXRSb2NrcygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB4ID0gcm9jay54ICogdGhpcy5jZWxsU2l6ZSAtIDEgLSB0aGlzLnJvY2tTaXplIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB5ID0gcm9jay55ICogdGhpcy5jZWxsU2l6ZSAtIDEgLSB0aGlzLnJvY2tTaXplIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmNsZWFyUmVjdCh4LHksdGhpcy5yb2NrU2l6ZSArIDIsIHRoaXMucm9ja1NpemUgKyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvY2tzLnNlbGVjdChyb2NrKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgU2F2ZUFjdGlvbnN7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgIH1cblxuICAgIHVwZGF0ZSgpe1xuICAgIH1cblxufVxuXG5cbmNsYXNzIFNjb3Jle1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICB9XG4gICAgXG59XG5cbmNsYXNzIEdhbWVwbGF5RGlzcGF0Y2hlcntcclxuXHRcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICBcdHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudCk7XHJcbiAgICBcdHRoaXMuR2FtZXBsYXkgPSBuZXcgR2FtZXBsYXlBY3Rpb25zKCk7XHJcbiAgICAgICAgdGhpcy5TYXZlID0gbmV3IFNhdmVBY3Rpb25zKCk7XHJcbiAgICBcdHRoaXMubGlzdGVubmVyKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGxpc3Rlbm5lcigpe1xyXG5cclxuICAgIFx0U3ByaW50KHRoaXMuJGdvYmFuKS5vbignY2xpY2snLCAoZSkgPT57XHJcbiAgICAgICAgICAgIGlmKHRoaXMuR2FtZXBsYXkuYWRkUm9jayhlKSl7XHJcbiAgICAgICAgICAgIFx0dGhpcy5HYW1lcGxheS51cGRhdGVDaGFpbnMoKTtcclxuICAgICAgICAgICAgXHR0aGlzLkdhbWVwbGF5LnVwZGF0ZUdvYmFuKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlNhdmUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkdhbWVwbGF5LnN3aXRjaFBsYXllcnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgIH1cclxuXHJcbn1cbmNsYXNzIENoYWluc3tcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMuY2hhaW5zID0gW107XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIGNoYWluXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNoYWluIChzdHJpbmcpXHJcbiAgICAgKi8gIFxyXG4gICAgYWRkKGNoYWluKXtcclxuICAgICAgICB0aGlzLmNoYWluc1tjaGFpbl0gPSBuZXcgQ2hhaW4oY2hhaW4pO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZWxlY3QgYSBjaGFpblxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjaGFpbiAoY2hhaW4pXHJcbiAgICAgKiBAcmV0dXJuIGNoYWluIG9iamVjdCBzZWxlY3RlZFxyXG4gICAgICovICBcclxuICAgIHNlbGVjdChjaGFpbil7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW5zW2NoYWluXTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFsbCBjaGFpbnNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMuY2hhaW5zXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW5zO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogSm9pbiAyIGNoYWluc1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBqb2luKGpvaW5DaGFpbiwgY2hhaW4pe1xyXG4gICAgICAgIHRoaXMuY2hhaW5zW2pvaW5DaGFpbl0ucm9ja3MucHVzaCguLi50aGlzLmNoYWluc1tjaGFpbl0ucm9ja3MpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb3VudCBjaGFpbnNcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMuY2hhaW5zLmxlbmd0aFxyXG4gICAgICovICBcclxuICAgIGNvdW50KCl7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW5zLmxlbmd0aDtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5jbGFzcyBDaGFpbntcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IobmFtZSl7XHJcbiAgICAgICAgdGhpcy5yb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuYm9yZGVyID0gW107XHJcbiAgICAgICAgdGhpcy50ZXJyaXRvcnkgPSBbXTtcclxuICAgICAgICB0aGlzLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSAnYWxpdmUnO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIHJvY2tcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgYWRkUm9jayhyb2NrKXtcclxuICAgICAgICB0aGlzLnJvY2tzLnB1c2gocm9jayk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgcm9ja3NcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0Um9ja3MoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb2Nrcy5zb3J0KCk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYSBjaGFpblxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICByZW1vdmUoKXtcclxuICAgICAgICB0aGlzLnJvY2tzID0gW107XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdkZWFkJztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZXR1cm4gYm9yZGVycyBvZiB0aGUgY2hhaW5cclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIGFycmF5XHJcbiAgICAgKi8gXHJcbiAgICBnZXRCb3JkZXJzKHBhcmFtID0gJ29iamVjdHMnKXtcclxuXHJcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCByb2NrIG9mIHRoaXMucm9ja3Mpe1xyXG4gICAgICAgICAgICBpZihyb2Nrcy5zZWxlY3Qoe3g6IHJvY2sueCwgeTogcm9jay55fSkuZ2V0TmVpZ2hib3JpbmdSb2Nrcyhyb2NrcywgJ2N1cnJlbnQnKS5sZW5ndGggIT0gNCl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJvcmRlci5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihwYXJhbSA9PSAnY291bnQnKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVyLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLmJvcmRlci5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgbGliZXJ0aWVzIG9mIHRoZSB0ZXJyaXRvcmllc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5saWJlcnRpZXMgKG51bWJlcilcclxuICAgICAqLyBcclxuICAgIGdldExpYmVydGllcyhwYXJhbSA9ICdjb3VudCcpe1xyXG5cclxuICAgICAgICB0aGlzLmxpYmVydGllcyA9IFtdO1xyXG4gICAgICAgIGZvcihsZXQgcm9jayBvZiB0aGlzLmdldEJvcmRlcnMocm9ja3MpKXtcclxuICAgICAgICAgICAgdGhpcy5saWJlcnRpZXMucHVzaCguLi5yb2Nrcy5zZWxlY3Qocm9jaykuZ2V0TGliZXJ0aWVzKCdvYmplY3RzJykpO1xyXG4gICAgICAgIH0gICAgIFxyXG5cclxuICAgICAgICBpZihwYXJhbSA9PSAnY291bnQnKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGliZXJ0aWVzLmxlbmd0aDtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmxpYmVydGllcztcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbnZhciBjaGFpbnMgPSBuZXcgQ2hhaW5zKCk7XG52YXIgcGxheWVyID0gJ2RkJztcclxuXHJcbmNsYXNzIFBsYXllcntcclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBuYW1lIG9mIHRoZSBjdXJyZW50IHBsYXllclxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3RvcihwbGF5ZXIpe1xyXG4gICAgICAgIHRoaXMubmFtZSA9IDE7XHJcbiAgICAgICAgaWYocGxheWVyID09ICdlbm5lbXknKXtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gMjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTd2l0Y2ggdG8gdGhlIG5leHQgcGxheWVyXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIG5leHQoKXtcclxuICAgICAgICB0aGlzLm5hbWUgPSAoKHRoaXMubmFtZSsrKSAlIDIpICsgMTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBwbGF5ZXJcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMubmFtZVxyXG4gICAgICovICBcclxuICAgIGdldChzZWxlY3QgPSAnY3VycmVudCcpe1xyXG4gICAgXHRyZXR1cm4gdGhpcy5uYW1lO1xyXG4gICAgfVxyXG5cclxuICAgICAgICBcclxufVxuY2xhc3MgUm9ja3N7XHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLnJvY2tzID0gW107XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEFkZCBhIHJvY2tcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gcm9jayAob2JqZWN0KSB7eDogeCwgeTp5fVxyXG4gICAgICovICBcclxuICAgIGFkZChyb2NrKXtcclxuICAgICAgICBpZih0aGlzLnJvY2tzW3JvY2sueF0gPT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgdGhpcy5yb2Nrc1tyb2NrLnhdID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucm9ja3Nbcm9jay54XVtyb2NrLnldID0gbmV3IFJvY2socm9jayk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBhbGwgcm9ja3NcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMucm9ja3NcclxuICAgICAqLyAgXHJcbiAgICBnZXQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5yb2NrcztcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2VsZWN0IGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByb2NrIChvYmplY3QpIHt4OiB4LCB5Onl9XHJcbiAgICAgKiBAcmV0dXJuIHJvY2sgb2JqZWN0IHNlbGVjdGVkXHJcbiAgICAgKi8gIFxyXG4gICAgc2VsZWN0KHJvY2spe1xyXG4gICAgICAgIGlmKHRoaXMucm9ja3Nbcm9jay54XSAhPSB1bmRlZmluZWQgJiYgdGhpcy5yb2Nrc1tyb2NrLnhdW3JvY2sueV0gIT0gdW5kZWZpbmVkKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm9ja3Nbcm9jay54XVtyb2NrLnldO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxuY2xhc3MgUm9ja3tcclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0geCBhbmQgeSAobnVtYmVyKVxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3Rvcihyb2NrKXtcclxuICAgICAgICB0aGlzLmNoYWluID0gMDtcclxuICAgICAgICB0aGlzLnggPSByb2NrLng7XHJcbiAgICAgICAgdGhpcy55ID0gcm9jay55O1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gMDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBhZGQocGxheWVyKXtcclxuICAgICAgICB0aGlzLnBsYXllciA9IHBsYXllci5nZXQoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogUmVtb3ZlIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICByZW1vdmUocGxheWVyKXtcclxuICAgICAgICB0aGlzLnBsYXllciA9IDA7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBuZWlnaGJvcmluZyByb2Nrc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBzZWxlY3QgKHN0cmluZylcclxuICAgICAqIEByZXR1cm4gbmVpZ2hib3Jpbmcgcm9ja3MgKGFycmF5KVxyXG4gICAgICovICBcclxuICAgIGdldE5laWdoYm9yaW5nUm9ja3Moc2VsZWN0ID0gJ2FsbCcpe1xyXG5cclxuICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MgPSBbXTtcclxuICAgICAgICB0aGlzLmNhY2hlID0gW107XHJcblxyXG4gICAgICAgIGZvcihsZXQgaT0xIDsgaSA8PSA0IDsgaSsrKXtcclxuICAgICAgICAgICAgbGV0IHggPSB0aGlzLng7XHJcbiAgICAgICAgICAgIGxldCB5ID0gdGhpcy55O1xyXG5cclxuICAgICAgICAgICAgc3dpdGNoKGkpe1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgICAgICAgICAgIHkgPSB5IC0gMTsgLy8gdG9wXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxyXG4gICAgICAgICAgICAgICAgICAgIHgrKzsgLy8gcmlnaHRcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDM6XHJcbiAgICAgICAgICAgICAgICAgICAgeSsrOyAvLyBib3R0b21cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgICAgICAgICAgeCA9IHggLSAxOyAvLyBsZWZ0XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGxldCByb2NrID0gcm9ja3Muc2VsZWN0KHt4LCB5fSk7XHJcblxyXG4gICAgICAgICAgICBpZihzZWxlY3QgIT0gJ2VtcHR5Jyl7XHJcbiAgICAgICAgICAgICAgICBpZihyb2NrICYmIHJvY2suZ2V0UGxheWVyKCkgIT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgICAgICBpZihyb2NrICYmIHJvY2suZ2V0UGxheWVyKCkgPT0gMCl7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihzZWxlY3QgIT0gJ2FsbCcgJiYgc2VsZWN0ICE9ICdlbXB0eScpe1xyXG5cclxuICAgICAgICAgICAgbGV0IHBsYXllciA9IHNlbGVjdDtcclxuICAgICAgICAgICAgaWYodHlwZW9mKHNlbGVjdCkgPT0gJ3N0cmluZycpe1xyXG4gICAgICAgICAgICAgICAgcGxheWVyID0gKCh0aGlzLmdldFBsYXllcigpICsgMikgJSAyKSArIDE7XHJcbiAgICAgICAgICAgICAgICBpZihzZWxlY3QgPT0gJ2N1cnJlbnQnKXtcclxuICAgICAgICAgICAgICAgICAgICBwbGF5ZXIgPSB0aGlzLmdldFBsYXllcigpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IGkgaW4gdGhpcy5jYWNoZSl7XHJcbiAgICAgICAgICAgICAgICBsZXQgcm9jayA9IHRoaXMuY2FjaGVbaV07XHJcbiAgICAgICAgICAgICAgICBpZihyb2NrLmdldFBsYXllcigpID09IHBsYXllcil7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZWlnaGJvcmluZ1JvY2tzLnB1c2gocm9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgdGhpcy5uZWlnaGJvcmluZ1JvY2tzID0gdGhpcy5jYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yaW5nUm9ja3Muc29ydCgpO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGxpYmVydGllc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gbGliZXJ0aWVzXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0TGliZXJ0aWVzKHBhcmFtID0gJ2NvdW50Jyl7ICBcclxuXHJcbiAgICAgICAgbGV0IG5laWdoYm9ycyA9IHRoaXMuZ2V0TmVpZ2hib3JpbmdSb2NrcygnZW1wdHknKTtcclxuICAgICAgICBpZihwYXJhbSA9PSAnY291bnQnKXtcclxuICAgICAgICAgICAgcmV0dXJuIG5laWdoYm9ycy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBuZWlnaGJvcnM7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHBsYXllciBcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMucGxheWVyXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0UGxheWVyKCl7ICBcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXI7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBjaGFpbiBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2hhaW4gKG51bWJlcilcclxuICAgICAqLyAgXHJcbiAgICBzZXRDaGFpbihjaGFpbil7ICBcclxuICAgICAgICB0aGlzLmNoYWluID0gY2hhaW47IFxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgY2hhaW4gXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLmNoYWluXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0Q2hhaW4oKXsgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWluO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbnZhciByb2NrcyA9IG5ldyBSb2NrcygpO1xyXG5cbi8qKlxuICogTWluaW9ucyBpbiBkYeKAmSBnYW1lLCBicm90aGEg8J+YjlxuICogUmFwaGHDq2xsZSBMaW1vZ2VzLCBBbGV4YW5kcmEgQ29zc2lkLCBDaGFybGVzIE1hbmd3YSwgVEjDqW8gS251dHogZXQgTMOpbyBMZSBCcmFzXG4gKiBIRVRJQyBQMjAxOVxuICpcbiAqIFdvcmsgd2l0aCBFUzYrICh3aXRoIGJhYmVsIHRyYW5zcGlsZWxlcilcbiAqXG4gKiBDb3B5cmlnaHQgMjAxNVxuICogUmVsZWFzZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlXG4gKiBodHRwOi8vb3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKlxuICogRGF0ZSBvZiBjcmVhdGlvbiA6IDIwMTUtMDUtMTlcbiAqL1xuXG52YXIgb3B0aW9ucyA9IHtcbiAgICBnb2Jhbjoge1xuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW4nXG4gICAgfSxcbiAgICBnYW1lcGxheToge1xuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW5fZ2FtZXBsYXknXG4gICAgfSxcbiAgICBncmlkOiB7XG4gICAgICAgIG5icmU6ICcxOScsXG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9ncmlkJyxcbiAgICAgICAgY2VsbFNpemU6IDQwLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6ICd3aGl0ZScsXG4gICAgICAgIGJvcmRlckNvbG9yOiAnYmxhY2snLFxuICAgICAgICBib3JkZXJXaWR0aDogMlxuICAgIH0sXG4gICAgcm9jazp7XG4gICAgICAgIHNpemU6IDIwLFxuICAgICAgICBwbGF5ZXIxOiAnZ3JleScsXG4gICAgICAgIHBsYXllcjI6ICdibGFjaydcbiAgICB9XG59O1xuXG5Hb0dhbWUoKTtcbiJdfQ==
