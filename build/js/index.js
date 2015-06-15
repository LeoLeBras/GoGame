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

            var response = false;
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
                            response = true;
                        }
                    }
                }
            }
            if (this.getRock().getNeighboringRocks(this.ennemy.get()).length == 4) {
                response = true;
            }

            if (response) {
                console.log('****');
                console.log('Case of suicide for player ' + this.player.get() + ' on ' + this.x + ';' + this.y);
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
                _this.Gameplay.switchPlayers();
            });
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
    },
    control: {
        next: '.Game_control_next'
    }
};

GoGame();

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2Zha2VfNTM5YTg4OTMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBLFNBQVMsTUFBTSxHQUFFOztBQUViLFFBQUksV0FBVyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDaEMsZUFBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksUUFBUSxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztDQUMzQzs7SUFDSyxPQUFPOzs7Ozs7O0FBTUUsYUFOVCxPQUFPLEdBTUk7OEJBTlgsT0FBTzs7QUFPTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUVuRCxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQzs7QUFFMUQsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLFlBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzRCxZQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRW5ELFlBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzNELFlBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3RFOztpQkFuQkMsT0FBTzs7Ozs7Ozs7ZUFnQ0Msc0JBQUU7QUFDUixnQkFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7QUFDWixxQkFBSyxFQUFFLElBQUksQ0FBQyxRQUFRO0FBQ3BCLHNCQUFNLEVBQUUsSUFBSSxDQUFDLFFBQVEsRUFDeEIsQ0FBQyxDQUFDO1NBQ047Ozs7Ozs7OztlQWFZLHlCQUFFO0FBQ1gsZ0JBQUksQ0FBQyxlQUFlLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQ2xELGdCQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUNuRCxnQkFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUM7QUFDckIscUJBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtBQUNwQixzQkFBTSxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQ3hCLENBQUMsQ0FBQTtTQUNMOzs7Ozs7Ozs7ZUFhUSxxQkFBRTs7O0FBR1AsZ0JBQUksQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO0FBQzlDLGdCQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztBQUMvQyxnQkFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUM7QUFDakIscUJBQUssRUFBRSxJQUFJLENBQUMsUUFBUTtBQUNwQixzQkFBTSxFQUFFLElBQUksQ0FBQyxRQUFRO2FBQ3hCLENBQUMsQ0FBQTs7O0FBR0YsZ0JBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7OztBQUd4QixpQkFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUcsQ0FBQyxFQUFFLEVBQUM7QUFDaEMsaUJBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNkLGlCQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMzQyxpQkFBQyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUMzRCxpQkFBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDO0FBQ25DLGlCQUFDLENBQUMsTUFBTSxFQUFFLENBQUM7YUFDZDtBQUNELGlCQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRyxDQUFDLEVBQUUsRUFBQztBQUNoQyxpQkFBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2QsaUJBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNDLGlCQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNELGlCQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUM7QUFDbkMsaUJBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQzthQUNkO1NBQ0o7Ozs7Ozs7O2VBV0UsZUFBRTtBQUNELGdCQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7QUFDbEIsZ0JBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztBQUNyQixnQkFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1NBQ3BCOzs7V0FqSEMsT0FBTzs7O0lBb0hQLGVBQWU7Ozs7Ozs7O0FBT04sYUFQVCxlQUFlLEdBT0o7OEJBUFgsZUFBZTs7QUFTYixZQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDbEQsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUM7O0FBRWxELFlBQUksQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNqQyxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7O0FBRXpDLFlBQUksQ0FBQyxJQUFJLENBQUM7QUFDVixZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDckMsWUFBSSxDQUFDLFdBQVcsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO0FBQzNDLFlBQUksQ0FBQyxXQUFXLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQzs7QUFFM0MsWUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUNwQyxZQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDOztBQUVuQyxZQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7QUFFaEIsYUFBSSxJQUFJLENBQUMsQ0FBQyxHQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFDO0FBQzFDLGlCQUFJLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLElBQUksRUFBRyxJQUFJLENBQUMsQ0FBQyxFQUFFLEVBQUM7QUFDM0MscUJBQUssQ0FBQyxHQUFHLENBQUM7QUFDTixxQkFBQyxFQUFHLElBQUksQ0FBQyxDQUFDO0FBQ1YscUJBQUMsRUFBRyxJQUFJLENBQUMsQ0FBQztpQkFDYixDQUFDLENBQUM7YUFDTjtTQUNKO0tBQ0o7O2lCQWpDQyxlQUFlOzs7Ozs7O2VBMkNMLHdCQUFFOztBQUVWLGdCQUFJLFFBQVEsR0FBRyxLQUFLLENBQUM7QUFDckIsZ0JBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDdEUsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDOzs7Ozs7O0FBRWhCLHFDQUFvQixTQUFTLDhIQUFDO3dCQUF0QixRQUFROztBQUNaLHdCQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxFQUFDO0FBQzdDLDRCQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsQ0FBQztxQkFDeEM7aUJBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxnQkFBSSxLQUFLLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7O0FBRWQsc0NBQWdCLElBQUksQ0FBQyxLQUFLLG1JQUFDO3dCQUFuQixJQUFJOztBQUNSLHdCQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxFQUFDO0FBQ3ZDLDRCQUFJLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkUsNEJBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsRUFBQztBQUNwQyxpQ0FBSyxFQUFFLENBQUM7eUJBQ1g7cUJBQ0o7aUJBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxnQkFBRyxLQUFLLElBQUksQ0FBQyxFQUFDO0FBQ1YseUJBQVMsR0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDO0FBQ2xFLG9CQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7Ozs7OztBQUVoQiwwQ0FBb0IsU0FBUyxtSUFBQzs0QkFBdEIsUUFBUTs7QUFDWiw0QkFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQztBQUM3QyxnQ0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7eUJBQ3hDO3FCQUNKOzs7Ozs7Ozs7Ozs7Ozs7O0FBRUQsb0JBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLElBQUssQ0FBQyxFQUFDO0FBQ3ZCLHlCQUFLLEdBQUcsQ0FBQyxDQUFDOzs7Ozs7QUFDViw4Q0FBaUIsSUFBSSxDQUFDLEtBQUssbUlBQUM7Z0NBQXBCLEtBQUs7O0FBQ1QsZ0NBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxZQUFZLEVBQUUsSUFBSSxDQUFDLEVBQUM7QUFDeEMscUNBQUssRUFBRSxDQUFDOzZCQUNYO3lCQUNKOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Qsd0JBQUcsS0FBSyxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFDO0FBQzFCLDRCQUFJLElBQUksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbkUsNEJBQUcsSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFDcEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUssQ0FBQyxHQUFHLEtBQUssQUFBQyxFQUFDO0FBQ2pFLG9DQUFRLEdBQUcsSUFBSSxDQUFDO3lCQUNuQjtxQkFDSjtpQkFDSjthQUNKO0FBQ0QsZ0JBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFDO0FBQ2pFLHdCQUFRLEdBQUcsSUFBSSxDQUFDO2FBQ25COztBQUVELGdCQUFHLFFBQVEsRUFBQztBQUNSLHVCQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BCLHVCQUFPLENBQUMsR0FBRyxpQ0FBK0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsWUFBTyxJQUFJLENBQUMsQ0FBQyxTQUFJLElBQUksQ0FBQyxDQUFDLENBQUcsQ0FBQzthQUN6Rjs7QUFFRCxtQkFBTyxRQUFRLENBQUM7U0FFbkI7Ozs7Ozs7O2VBVVkseUJBQUU7QUFDWCxnQkFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUNuQixnQkFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUN0Qjs7Ozs7Ozs7OztlQWFNLG1CQUFtQjtnQkFBbEIsSUFBSSxnQ0FBRyxVQUFVOztBQUVyQixnQkFBSSxJQUFJLEdBQUc7QUFDUCxpQkFBQyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ1QsaUJBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQzthQUNaLENBQUE7O0FBRUQsZ0JBQUcsSUFBSSxJQUFJLFFBQVEsRUFBQztBQUNoQix1QkFBTyxJQUFJLENBQUM7YUFDZjs7QUFFRCxtQkFBTyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBRTdCOzs7Ozs7OztlQVdNLGlCQUFDLENBQUMsRUFBQzs7O0FBR04sZ0JBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7QUFDcEUsZ0JBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUEsR0FBSSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7OztBQUdwRSxnQkFBRyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxJQUFJLElBQUksQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsSUFBSSxJQUNwRSxJQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxJQUMvQixDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsRUFBQzs7O0FBR3hCLHVCQUFPLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3BCLHVCQUFPLENBQUMsR0FBRyxhQUFXLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLFlBQU8sSUFBSSxDQUFDLENBQUMsU0FBSSxJQUFJLENBQUMsQ0FBQyxDQUFHLENBQUM7O0FBRWxFLG9CQUFJLENBQUMsT0FBTyxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFaEMsb0JBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxPQUFPLENBQUM7QUFDcEMsb0JBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsSUFBSSxDQUFDLEVBQUM7QUFDdEIseUJBQUssR0FBSSxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDO2lCQUNwQzs7QUFFRCxvQkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztBQUNwQixpQkFBQyxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBQ2QsaUJBQUMsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7QUFDaEcsaUJBQUMsQ0FBQyxTQUFTLEVBQUUsQ0FBQztBQUNkLGlCQUFDLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztBQUNwQixpQkFBQyxDQUFDLElBQUksRUFBRSxDQUFDOztBQUVULHVCQUFPLElBQUksQ0FBQzthQUNmOztBQUVELG1CQUFPLEtBQUssQ0FBQztTQUNoQjs7Ozs7Ozs7ZUFXVyx3QkFBRTs7O0FBR1YsZ0JBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQzs7QUFFOUQsZ0JBQUcsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUM7OztBQUdyQixvQkFBSSxpQkFBaUIsR0FBRyxFQUFFLENBQUM7Ozs7OztBQUMzQiwwQ0FBZ0IsU0FBUyxtSUFBQzs0QkFBbEIsSUFBSTs7QUFDUiw0QkFBRyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDLEVBQUM7QUFDaEQsNkNBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO3lCQUMzQztxQkFDSjs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFHRCxvQkFBRyxpQkFBaUIsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFDO0FBQzdCLHdCQUFJLEtBQUssR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQztpQkFDcEM7OztxQkFHRztBQUNBLHFDQUFpQixHQUFHLGlCQUFpQixDQUFDLElBQUksRUFBRSxDQUFDO0FBQzdDLHdCQUFJLFNBQVMsR0FBRyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQzs7Ozs7O0FBQ3JDLDhDQUFpQixpQkFBaUIsQ0FBQyxPQUFPLEVBQUUsbUlBQUM7Z0NBQXJDLE1BQUs7O0FBQ1QsZ0NBQUcsTUFBSyxJQUFJLFNBQVMsRUFBQzs7Ozs7O0FBQ2xCLDBEQUFnQixNQUFNLENBQUMsTUFBTSxDQUFDLE1BQUssQ0FBQyxDQUFDLFFBQVEsRUFBRSxtSUFBQzs0Q0FBeEMsSUFBSTs7QUFDUiw2Q0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUM7cUNBQzFDOzs7Ozs7Ozs7Ozs7Ozs7O0FBQ0Qsc0NBQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLE1BQUssQ0FBQyxDQUFDO0FBQzlCLHNDQUFNLENBQUMsTUFBTSxDQUFDLE1BQUssQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDOzZCQUNqQzt5QkFDSjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELHdCQUFJLEtBQUssR0FBRyxTQUFTLENBQUM7aUJBQ3pCO2FBQ0o7OztpQkFHRztBQUNBLG9CQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUM7QUFDM0Isc0JBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7YUFDckI7OztBQUdELGtCQUFNLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7QUFDckQsZ0JBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUM7U0FFbEM7Ozs7Ozs7O2VBVVUsdUJBQUU7O0FBRVQsZ0JBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFN0QsZ0JBQUcsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUM7O0FBRXJCLG9CQUFJLGlCQUFpQixHQUFHLEVBQUUsQ0FBQzs7Ozs7O0FBQzNCLDBDQUFnQixTQUFTLG1JQUFDOzRCQUFsQixJQUFJOztBQUNSLDRCQUFHLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBQztBQUNoRCw2Q0FBaUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7eUJBQzNDO3FCQUNKOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCwwQ0FBaUIsaUJBQWlCLG1JQUFDOzRCQUEzQixLQUFLOztBQUNULDRCQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxFQUFDO0FBQ3hDLG1DQUFPLENBQUMsR0FBRyxtQkFBaUIsS0FBSyxDQUFHLENBQUM7Ozs7OztBQUNyQyx1REFBZ0IsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxRQUFRLEVBQUUsd0lBQUM7d0NBQXhDLElBQUk7O0FBQ1Isd0NBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDdkQsd0NBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUM7QUFDdkQsd0NBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEVBQUUsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNoRSx5Q0FBSyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQztpQ0FDL0I7Ozs7Ozs7Ozs7Ozs7Ozt5QkFDSjtxQkFDSjs7Ozs7Ozs7Ozs7Ozs7O2FBQ0o7U0FDSjs7O1dBeFJDLGVBQWU7OztJQTJSZixXQUFXO0FBRUYsYUFGVCxXQUFXLEdBRUE7OEJBRlgsV0FBVztLQUdaOztpQkFIQyxXQUFXOztlQUtQLGtCQUFFLEVBQ1A7OztXQU5DLFdBQVc7OztJQVdYLEtBQUssR0FFSSxTQUZULEtBQUssR0FFTTswQkFGWCxLQUFLO0NBR047O0lBSUMsa0JBQWtCO0FBRVQsYUFGVCxrQkFBa0IsR0FFUDs4QkFGWCxrQkFBa0I7O0FBR2hCLFlBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNyRCxZQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDN0MsWUFBSSxDQUFDLFFBQVEsR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0FBQ25DLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxXQUFXLEVBQUUsQ0FBQztBQUNqQyxZQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7S0FDakI7O2lCQVJDLGtCQUFrQjs7ZUFXWCxxQkFBRTs7O0FBRVYsa0JBQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sRUFBRSxVQUFDLENBQUMsRUFBSztBQUNoQyxvQkFBRyxNQUFLLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUM7QUFDM0IsMEJBQUssUUFBUSxDQUFDLFlBQVksRUFBRSxDQUFDO0FBQzdCLDBCQUFLLFFBQVEsQ0FBQyxXQUFXLEVBQUUsQ0FBQztBQUN6QiwwQkFBSyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7QUFDbkIsMEJBQUssUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDO2lCQUNqQzthQUNKLENBQUMsQ0FBQzs7QUFFSCxrQkFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsT0FBTyxFQUFFLFlBQU07QUFDakMsc0JBQUssUUFBUSxDQUFDLGFBQWEsRUFBRSxDQUFDO2FBQ2pDLENBQUMsQ0FBQztTQUVOOzs7V0ExQkMsa0JBQWtCOzs7SUE2QmxCLE1BQU07Ozs7Ozs7QUFNRyxhQU5ULE1BQU0sR0FNSzs4QkFOWCxNQUFNOztBQU9KLFlBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0tBQ3BCOztpQkFSQyxNQUFNOzs7Ozs7OztlQW9CTCxhQUFDLEtBQUssRUFBQztBQUNOLGdCQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3pDOzs7Ozs7Ozs7O2VBYUssZ0JBQUMsS0FBSyxFQUFDO0FBQ1QsbUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztTQUM3Qjs7Ozs7Ozs7O2VBWUUsZUFBRTtBQUNELG1CQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDdEI7Ozs7Ozs7O2VBU0csY0FBQyxTQUFTLEVBQUUsS0FBSyxFQUFDOzs7QUFDbEIsdUNBQUEsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLEVBQUMsSUFBSSxNQUFBLDZDQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsS0FBSyxFQUFDLENBQUM7U0FDbEU7Ozs7Ozs7OztlQVlJLGlCQUFFO0FBQ0gsbUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7U0FDN0I7OztXQTVFQyxNQUFNOzs7SUFpRk4sS0FBSzs7Ozs7OztBQU9JLGFBUFQsS0FBSyxDQU9LLElBQUksRUFBQzs4QkFQZixLQUFLOztBQVFILFlBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2hCLFlBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFlBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0tBQ3hCOztpQkFiQyxLQUFLOzs7Ozs7O2VBc0JBLGlCQUFDLElBQUksRUFBQztBQUNULGdCQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUN6Qjs7Ozs7Ozs7ZUFTTyxvQkFBRTtBQUNOLG1CQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUM7U0FDNUI7Ozs7Ozs7O2VBU0ssa0JBQUU7QUFDSixnQkFBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7QUFDaEIsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1NBQ3ZCOzs7Ozs7Ozs7ZUFXUyxzQkFBbUI7Z0JBQWxCLEtBQUssZ0NBQUcsU0FBUzs7QUFFeEIsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsRUFBRSxDQUFDOzs7Ozs7O0FBRWpCLHVDQUFnQixJQUFJLENBQUMsS0FBSyx3SUFBQzt3QkFBbkIsSUFBSTs7QUFDUix3QkFBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFDO0FBQ3RGLDRCQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDMUI7aUJBQ0o7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFRCxnQkFBRyxLQUFLLElBQUksT0FBTyxFQUFDO0FBQ2hCLHVCQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO2FBQzdCOztBQUVELG1CQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7U0FFN0I7Ozs7Ozs7OztlQVlXLHdCQUFpQjtnQkFBaEIsS0FBSyxnQ0FBRyxPQUFPOztBQUV4QixnQkFBSSxDQUFDLFNBQVMsR0FBRyxFQUFFLENBQUM7Ozs7OztBQUNwQix1Q0FBZ0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsd0lBQUM7Ozt3QkFBL0IsSUFBSTs7QUFDUixrQ0FBQSxJQUFJLENBQUMsU0FBUyxFQUFDLElBQUksTUFBQSxnQ0FBSSxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxTQUFTLENBQUMsRUFBQyxDQUFDO2lCQUN0RTs7Ozs7Ozs7Ozs7Ozs7OztBQUVELGdCQUFHLEtBQUssSUFBSSxPQUFPLEVBQUM7QUFDaEIsdUJBQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7YUFDaEM7QUFDRCxtQkFBTyxJQUFJLENBQUMsU0FBUyxDQUFDO1NBRXpCOzs7V0FsR0MsS0FBSzs7O0FBcUdYLElBQUksTUFBTSxHQUFHLElBQUksTUFBTSxFQUFFLENBQUM7QUFDMUIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDOztJQUVaLE1BQU07Ozs7Ozs7O0FBUUcsYUFSVCxNQUFNLENBUUksTUFBTSxFQUFDOzhCQVJqQixNQUFNOztBQVNKLFlBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDO0FBQ2QsWUFBRyxNQUFNLElBQUksUUFBUSxFQUFDO0FBQ2xCLGdCQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztTQUNqQjtLQUNKOztpQkFiQyxNQUFNOzs7Ozs7O2VBc0JKLGdCQUFFO0FBQ0YsZ0JBQUksQ0FBQyxJQUFJLEdBQUcsQUFBQyxBQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsR0FBSSxDQUFDLEdBQUksQ0FBQyxDQUFDO1NBQ3ZDOzs7Ozs7Ozs7ZUFVRSxlQUFvQjtnQkFBbkIsTUFBTSxnQ0FBRyxTQUFTOztBQUNyQixtQkFBTyxJQUFJLENBQUMsSUFBSSxDQUFDO1NBQ2pCOzs7V0FwQ0MsTUFBTTs7O0lBd0NOLEtBQUs7Ozs7Ozs7QUFNSSxhQU5ULEtBQUssR0FNTTs4QkFOWCxLQUFLOztBQU9ILFlBQUksQ0FBQyxLQUFLLEdBQUcsRUFBRSxDQUFDO0tBQ25COztpQkFSQyxLQUFLOzs7Ozs7OztlQW9CSixhQUFDLElBQUksRUFBQztBQUNMLGdCQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsRUFBQztBQUMvQixvQkFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDO2FBQzNCO0FBQ0QsZ0JBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztTQUMvQzs7Ozs7Ozs7O2VBWUUsZUFBRTtBQUNELG1CQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDckI7Ozs7Ozs7Ozs7ZUFhSyxnQkFBQyxJQUFJLEVBQUM7QUFDUixnQkFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsRUFBQztBQUMxRSx1QkFBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7YUFDckM7QUFDRCxtQkFBTyxLQUFLLENBQUM7U0FDaEI7OztXQXpEQyxLQUFLOzs7SUE4REwsSUFBSTs7Ozs7Ozs7QUFTSyxhQVRULElBQUksQ0FTTSxJQUFJLEVBQUM7OEJBVGYsSUFBSTs7QUFVRixZQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztBQUNmLFlBQUksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQztBQUNoQixZQUFJLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDaEIsWUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7S0FDbkI7O2lCQWRDLElBQUk7Ozs7Ozs7ZUF5QkgsYUFBQyxNQUFNLEVBQUM7QUFDUCxnQkFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUM7U0FDOUI7Ozs7Ozs7O2VBV0ssZ0JBQUMsTUFBTSxFQUFDO0FBQ1YsZ0JBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQ25COzs7Ozs7Ozs7O2VBYWtCLCtCQUFnQjtnQkFBZixNQUFNLGdDQUFHLEtBQUs7O0FBRTlCLGdCQUFJLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDO0FBQzNCLGdCQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQzs7QUFFaEIsaUJBQUksSUFBSSxDQUFDLEdBQUMsQ0FBQyxFQUFHLENBQUMsSUFBSSxDQUFDLEVBQUcsQ0FBQyxFQUFFLEVBQUM7QUFDdkIsb0JBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxDQUFDLENBQUM7QUFDZixvQkFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQzs7QUFFZix3QkFBTyxDQUFDO0FBQ0oseUJBQUssQ0FBQztBQUNGLHlCQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLDhCQUFNOztBQUFBLEFBRVYseUJBQUssQ0FBQztBQUNGLHlCQUFDLEVBQUUsQ0FBQztBQUNKLDhCQUFNOztBQUFBLEFBRVYseUJBQUssQ0FBQztBQUNGLHlCQUFDLEVBQUUsQ0FBQztBQUNKLDhCQUFNOztBQUFBLEFBRVYseUJBQUssQ0FBQztBQUNGLHlCQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztBQUNWLDhCQUFNO0FBQUEsaUJBQ2I7O0FBRUQsb0JBQUksSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBQyxDQUFDLEVBQUQsQ0FBQyxFQUFFLENBQUMsRUFBRCxDQUFDLEVBQUMsQ0FBQyxDQUFDOztBQUVoQyxvQkFBRyxNQUFNLElBQUksT0FBTyxFQUFDO0FBQ2pCLHdCQUFHLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFDO0FBQzdCLDRCQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDekI7aUJBQ0osTUFDRztBQUNBLHdCQUFHLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksQ0FBQyxFQUFDO0FBQzdCLDRCQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztxQkFDekI7aUJBQ0o7YUFDSjs7QUFFRCxnQkFBRyxNQUFNLElBQUksS0FBSyxJQUFJLE1BQU0sSUFBSSxPQUFPLEVBQUM7O0FBRXBDLG9CQUFJLE9BQU0sR0FBRyxNQUFNLENBQUM7QUFDcEIsb0JBQUcsT0FBTyxNQUFNLEFBQUMsSUFBSSxRQUFRLEVBQUM7QUFDMUIsMkJBQU0sR0FBRyxBQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxHQUFHLENBQUMsQ0FBQSxHQUFJLENBQUMsR0FBSSxDQUFDLENBQUM7QUFDMUMsd0JBQUcsTUFBTSxJQUFJLFNBQVMsRUFBQztBQUNuQiwrQkFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQztxQkFDN0I7aUJBQ0o7O0FBRUQscUJBQUksSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLEtBQUssRUFBQztBQUNwQix3QkFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUN6Qix3QkFBRyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksT0FBTSxFQUFDO0FBQzFCLDRCQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO3FCQUNwQztpQkFDSjthQUNKLE1BQ0c7QUFDQSxvQkFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDdEM7O0FBRUQsbUJBQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLElBQUksRUFBRSxDQUFDO1NBRXZDOzs7Ozs7Ozs7ZUFZVyx3QkFBaUI7Z0JBQWhCLEtBQUssZ0NBQUcsT0FBTzs7QUFFeEIsZ0JBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNsRCxnQkFBRyxLQUFLLElBQUksT0FBTyxFQUFDO0FBQ2hCLHVCQUFPLFNBQVMsQ0FBQyxNQUFNLENBQUM7YUFDM0I7QUFDRCxtQkFBTyxTQUFTLENBQUM7U0FFcEI7Ozs7Ozs7OztlQVlRLHFCQUFFO0FBQ1AsbUJBQU8sSUFBSSxDQUFDLE1BQU0sQ0FBQztTQUN0Qjs7Ozs7Ozs7O2VBWU8sa0JBQUMsS0FBSyxFQUFDO0FBQ1gsZ0JBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1NBQ3RCOzs7Ozs7Ozs7ZUFZTyxvQkFBRTtBQUNOLG1CQUFPLElBQUksQ0FBQyxLQUFLLENBQUM7U0FDckI7OztXQW5MQyxJQUFJOzs7QUF3TFYsSUFBSSxLQUFLLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7OztBQWdCeEIsSUFBSSxPQUFPLEdBQUc7QUFDVixTQUFLLEVBQUU7QUFDSCxlQUFPLEVBQUUsYUFBYTtLQUN6QjtBQUNELFlBQVEsRUFBRTtBQUNOLGVBQU8sRUFBRSxzQkFBc0I7S0FDbEM7QUFDRCxRQUFJLEVBQUU7QUFDRixZQUFJLEVBQUUsSUFBSTtBQUNWLGVBQU8sRUFBRSxrQkFBa0I7QUFDM0IsZ0JBQVEsRUFBRSxFQUFFO0FBQ1osdUJBQWUsRUFBRSxPQUFPO0FBQ3hCLG1CQUFXLEVBQUUsT0FBTztBQUNwQixtQkFBVyxFQUFFLENBQUM7S0FDakI7QUFDRCxRQUFJLEVBQUM7QUFDRCxZQUFJLEVBQUUsRUFBRTtBQUNSLGVBQU8sRUFBRSxNQUFNO0FBQ2YsZUFBTyxFQUFFLE9BQU87S0FDbkI7QUFDRCxXQUFPLEVBQUM7QUFDSixZQUFJLEVBQUUsb0JBQW9CO0tBQzdCO0NBQ0osQ0FBQzs7QUFFRixNQUFNLEVBQUUsQ0FBQyIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJmdW5jdGlvbiBHb0dhbWUoKXtcblxuICAgIHZhciBHYW1lQnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gICAgR2FtZUJ1aWxkZXIucnVuKCk7XG4gICAgdmFyIEdhbWVwbGF5ID0gbmV3IEdhbWVwbGF5RGlzcGF0Y2hlcigpO1xufVxuY2xhc3MgQnVpbGRlcntcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xuICAgICAgICB0aGlzLmdyaWRib3JkZXJXaWR0aCA9IG9wdGlvbnNbJ2dyaWQnXS5ib3JkZXJXaWR0aDtcblxuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuICAgICAgICB0aGlzLmdyaWRTaXplID0gKHBhcnNlSW50KHRoaXMuZ3JpZCkgKyAxKSAqIHRoaXMuY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ29iYW4nXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkgPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZCA9IFNwcmludChvcHRpb25zWydncmlkJ10uZWxlbWVudCk7XG5cbiAgICAgICAgdGhpcy5ncmlkQ2FudmFzID0gdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgdGhpcy5nYW1lcGxheUNhbnZhcyA9IHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBnb2JhblxuICAgICAqXG4gICAgICogQHJldHVybiBjc3Mgc3R5bGUgb2YgdGhlIGdvYmFuXG4gICAgICovICBcbiAgICBidWlsZEdvYmFuKCl7XG4gICAgICAgIHRoaXMuJGdvYmFuLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdhbWVwbGF5IGNhbnZhc1xuICAgICAqXG4gICAgICogQHJldHVybiBjYW52YXNcbiAgICAgKi8gIFxuICAgIGJ1aWxkR2FtZXBsYXkoKXtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmhlaWdodCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxuICAgICAgICB9KVxuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBncmlkXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNhbnZhcyB3aXRoIGEgZ3JpZCBkcmF3blxuICAgICAqLyAgXG4gICAgYnVpbGRHcmlkKCl7XG5cbiAgICAgICAgLy8gU2V0IHNpemUgb2YgY2FudmFzXG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLndpZHRoID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcbiAgICAgICAgfSlcblxuICAgICAgICAvLyBJbml0IHRoZSBjYW52YXNcbiAgICAgICAgdmFyIGMgPSB0aGlzLmdyaWRDYW52YXM7XG5cbiAgICAgICAgLy8gRHJhdyBlYWNoIGxpbmVzIG9mIHRoZSBncmlkXG4gICAgICAgIGZvcih2YXIgeCA9IDE7IHggPD0gdGhpcy5ncmlkIDsgeCsrKXtcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XG4gICAgICAgICAgICBjLmxpbmVUbyh0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSwgdGhpcy5jZWxsU2l6ZSAqIHgpO1xuICAgICAgICAgICAgYy5saW5lV2lkdGggPSB0aGlzLmdyaWRib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yKHZhciB5ID0gMTsgeSA8PSB0aGlzLmdyaWQgOyB5Kyspe1xuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGMubW92ZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuY2VsbFNpemUgKiB5LCB0aGlzLmdyaWRTaXplIC0gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xuICAgICAgICAgICAgYy5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCBhbGwgZWxlbWVudHNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgcnVuKCl7XG4gICAgICAgIHRoaXMuYnVpbGRHb2JhbigpO1xuICAgICAgICB0aGlzLmJ1aWxkR2FtZXBsYXkoKTtcbiAgICAgICAgdGhpcy5idWlsZEdyaWQoKTtcbiAgICB9XG5cbn1cbmNsYXNzIEdhbWVwbGF5QWN0aW9uc3tcblxuICAgIC8qKlxuICAgICAqIENvbnN0cnVjdG9yXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9uc1xuICAgICAqLyAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG5cbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcbiAgICAgICAgdGhpcy5jYW52YXMgPSB0aGlzLiRnb2Jhbi5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuZ3JpZCA9IG9wdGlvbnNbJ2dyaWQnXS5uYnJlO1xuICAgICAgICB0aGlzLmNlbGxTaXplID0gb3B0aW9uc1snZ3JpZCddLmNlbGxTaXplO1xuXG4gICAgICAgIHRoaXMucm9jaztcbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xuICAgICAgICB0aGlzLnJvY2tQbGF5ZXIxID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjIgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcblxuICAgICAgICB0aGlzLnBsYXllciA9IG5ldyBQbGF5ZXIoJ2N1cnJlbnQnKTtcbiAgICAgICAgdGhpcy5lbm5lbXkgPSBuZXcgUGxheWVyKCdlbm5lbXknKTtcblxuICAgICAgICB0aGlzLmNhY2hlID0gW107XG5cbiAgICAgICAgZm9yKHRoaXMueD0gMTsgdGhpcy54IDw9IHRoaXMuZ3JpZCA7IHRoaXMueCsrKXtcbiAgICAgICAgICAgIGZvcih0aGlzLnkgPSAxOyB0aGlzLnkgPD0gdGhpcy5ncmlkIDsgdGhpcy55Kyspe1xuICAgICAgICAgICAgICAgIHJvY2tzLmFkZCh7XG4gICAgICAgICAgICAgICAgICAgIHggOiB0aGlzLngsXG4gICAgICAgICAgICAgICAgICAgIHkgOiB0aGlzLnlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIHBsYXllciBpcyBvbiBhIGNhc2Ugb24gc3VpY2lkZVxuICAgICAqXG4gICAgICovICBcbiAgICBjaGVja1N1aWNpZGUoKXtcblxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBmYWxzZTtcbiAgICAgICAgbGV0IG5laWdoYm9ycyA9IHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3ModGhpcy5lbm5lbXkuZ2V0KCkpO1xuICAgICAgICB0aGlzLmNhY2hlID0gW107XG5cbiAgICAgICAgZm9yKGxldCBuZWlnaGJvciBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbmRleE9mKG5laWdoYm9yLmdldENoYWluKCkpID09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2gobmVpZ2hib3IuZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuXG4gICAgICAgIGZvcihsZXQgaXRlbSBvZiB0aGlzLmNhY2hlKXtcbiAgICAgICAgICAgIGlmKGNoYWlucy5zZWxlY3QoaXRlbSkuZ2V0TGliZXJ0aWVzKCkgPT0gMSl7XG4gICAgICAgICAgICAgICAgbGV0IHJvY2sgPSBjaGFpbnMuc2VsZWN0KHRoaXMuY2FjaGVbMF0pLmdldExpYmVydGllcygnb2JqZWN0cycpWzBdO1xuICAgICAgICAgICAgICAgIGlmKHJvY2sueCA9PSB0aGlzLnggJiYgcm9jay55ID09IHRoaXMueSl7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoY291bnQgPT0gMCl7XG4gICAgICAgICAgICBuZWlnaGJvcnMgPSB0aGlzLmdldFJvY2soKS5nZXROZWlnaGJvcmluZ1JvY2tzKHRoaXMucGxheWVyLmdldCgpKTtcbiAgICAgICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcblxuICAgICAgICAgICAgZm9yKGxldCBuZWlnaGJvciBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2FjaGUuaW5kZXhPZihuZWlnaGJvci5nZXRDaGFpbigpKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaChuZWlnaGJvci5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRoaXMuY2FjaGUubGVuZ3RoICE9ICAwKXtcbiAgICAgICAgICAgICAgICBjb3VudCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yKGxldCBjaGFpbiBvZiB0aGlzLmNhY2hlKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2hhaW5zLnNlbGVjdChjaGFpbikuZ2V0TGliZXJ0aWVzKCkgPT0gMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb3VudCsrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmKGNvdW50ID09IHRoaXMuY2FjaGUubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvY2sgPSBjaGFpbnMuc2VsZWN0KHRoaXMuY2FjaGVbMF0pLmdldExpYmVydGllcygnb2JqZWN0cycpWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZihyb2NrLnggPT0gdGhpcy54ICYmIHJvY2sueSA9PSB0aGlzLnkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgcm9jay5nZXROZWlnaGJvcmluZ1JvY2tzKHRoaXMuZW5uZW15LmdldCgpKS5sZW5ndGggPT0gKDQgLSBjb3VudCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3ModGhpcy5lbm5lbXkuZ2V0KCkpLmxlbmd0aCA9PSA0KXtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcqKioqJyk7ICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQ2FzZSBvZiBzdWljaWRlIGZvciBwbGF5ZXIgJHt0aGlzLnBsYXllci5nZXQoKX0gb24gJHt0aGlzLnh9OyR7dGhpcy55fWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuXG4gICAgfVxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBTd2l0Y2ggcGxheWVyc1xuICAgICAqXG4gICAgICovICBcbiAgICBzd2l0Y2hQbGF5ZXJzKCl7XG4gICAgICAgIHRoaXMucGxheWVyLm5leHQoKTtcbiAgICAgICAgdGhpcy5lbm5lbXkubmV4dCgpO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBHZXQgb2JqZWN0IG9mIHRoZSBjdXJyZW50IHJvY2tcbiAgICAgKlxuICAgICAqIEBwYXJtYSB0eXBlIChzdHJpbmcpXG4gICAgICogQHJldHVybiByb2NrIChvYmplY3QpXG4gICAgICovICBcbiAgICBnZXRSb2NrKHR5cGUgPSAnY29tcGxldGUnKXtcblxuICAgICAgICBsZXQgcm9jayA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMueCwgXG4gICAgICAgICAgICB5OiB0aGlzLnlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGUgPT0gJ3NpbXBsZScpe1xuICAgICAgICAgICAgcmV0dXJuIHJvY2s7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm9ja3Muc2VsZWN0KHJvY2spO1xuXG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF5ZXIgY2xpY2sgb24gdGhlIGdvYmFuIHRvIHB1dCBhIHJvY2tcbiAgICAgKlxuICAgICAqLyAgXG4gICAgYWRkUm9jayhlKXtcblxuICAgICAgICAvLyBTZXQgY3VycmVudCByb2NrXG4gICAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IoKGUubGF5ZXJYICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IoKGUubGF5ZXJZICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG5cbiAgICAgICAgLy8gSWYgdGhlIHBsYXllciBjYW4gcGxheSBoZXJlXG4gICAgICAgIGlmKDEgPD0gdGhpcy54ICYmIHRoaXMueCA8PSB0aGlzLmdyaWQgJiYgMSA8PSB0aGlzLnkgJiYgdGhpcy55IDw9IHRoaXMuZ3JpZCBcbiAgICAgICAgICAgICYmIHRoaXMuZ2V0Um9jaygpLmdldFBsYXllcigpID09IDBcbiAgICAgICAgICAgICYmICF0aGlzLmNoZWNrU3VpY2lkZSgpKXtcblxuICAgICAgICAgICAgLy8gRGVidWdcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcqKioqJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUGxheWVyICR7dGhpcy5wbGF5ZXIuZ2V0KCl9IGVuICR7dGhpcy54fTske3RoaXMueX1gKTtcblxuICAgICAgICAgICAgdGhpcy5nZXRSb2NrKCkuYWRkKHRoaXMucGxheWVyKTtcblxuICAgICAgICAgICAgbGV0IGNvbG9yID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XG4gICAgICAgICAgICBpZih0aGlzLnBsYXllci5nZXQoKSA9PSAyKXtcbiAgICAgICAgICAgICAgICBjb2xvciA9ICBvcHRpb25zWydyb2NrJ10ucGxheWVyMjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGMgPSB0aGlzLmNhbnZhcztcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjLmFyYyh0aGlzLnggKiB0aGlzLmNlbGxTaXplLCB0aGlzLnkgKiB0aGlzLmNlbGxTaXplLCB0aGlzLnJvY2tTaXplIC8gMiwgMCwgMiAqIE1hdGguUEksIGZhbHNlKTtcbiAgICAgICAgICAgIGMuY2xvc2VQYXRoKCk7XG4gICAgICAgICAgICBjLmZpbGxTdHlsZSA9IGNvbG9yO1xuICAgICAgICAgICAgYy5maWxsKCk7XG5cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBVcGRhdGUgY2hhaW5zXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHVwZGF0ZUNoYWlucygpe1xuXG4gICAgICAgIC8vIEdldCBuZWlnaGJvcnNcbiAgICAgICAgdmFyIG5laWdoYm9ycyA9IHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3MoJ2N1cnJlbnQnKTtcblxuICAgICAgICBpZihuZWlnaGJvcnMubGVuZ3RoICE9IDApe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBHZXQgY2hhaW5zIGZyb20gbmVpZ2hib3JpbmdzIGludGVyc2VjdGlvbnMgICAgICAgIFxuICAgICAgICAgICAgbGV0IGNoYWluc09mTmVpZ2hib3JzID0gW107XG4gICAgICAgICAgICBmb3IobGV0IHJvY2sgb2YgbmVpZ2hib3JzKXtcbiAgICAgICAgICAgICAgICBpZihjaGFpbnNPZk5laWdoYm9ycy5pbmRleE9mKHJvY2suZ2V0Q2hhaW4oKSkgPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBjaGFpbnNPZk5laWdoYm9ycy5wdXNoKHJvY2suZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDQVNFIDEgOiBBZGQgdGhlIHJvY2sgdG8gdGhlIGNoYWluXG4gICAgICAgICAgICBpZihjaGFpbnNPZk5laWdoYm9ycy5sZW5ndGggPT0gMSl7XG4gICAgICAgICAgICAgICAgdmFyIGNoYWluID0gY2hhaW5zT2ZOZWlnaGJvcnNbMF07IC8vIFNldCBpbmRleCBvZiB0aGUgY2hhaW5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQ0FTRSAyIDogSm9pbiBjaGFpbnNcbiAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgY2hhaW5zT2ZOZWlnaGJvcnMgPSBjaGFpbnNPZk5laWdoYm9ycy5zb3J0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGpvaW5DaGFpbiA9IGNoYWluc09mTmVpZ2hib3JzWzBdO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgY2hhaW4gb2YgY2hhaW5zT2ZOZWlnaGJvcnMucmV2ZXJzZSgpKXtcbiAgICAgICAgICAgICAgICAgICAgaWYoY2hhaW4gIT0gam9pbkNoYWluKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBjaGFpbnMuc2VsZWN0KGNoYWluKS5nZXRSb2NrcygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByb2Nrcy5zZWxlY3Qocm9jaykuc2V0Q2hhaW4oam9pbkNoYWluKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYWlucy5qb2luKGpvaW5DaGFpbiwgY2hhaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5zLnNlbGVjdChjaGFpbikucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2hhaW4gPSBqb2luQ2hhaW47IC8vIFNldCBpbmRleCBvZiB0aGUgY2hhaW5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENBU0UgMyA6IENyZWF0ZSBuZXcgY2hhaW5cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIHZhciBjaGFpbiA9IGNoYWlucy5jb3VudCgpO1xuICAgICAgICAgICAgY2hhaW5zLmFkZChjaGFpbik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBZGQgY3VycmVudCByb2NrIHRvIHRoZSBjaGFpblxuICAgICAgICBjaGFpbnMuc2VsZWN0KGNoYWluKS5hZGRSb2NrKHRoaXMuZ2V0Um9jaygnc2ltcGxlJykpO1xuICAgICAgICB0aGlzLmdldFJvY2soKS5zZXRDaGFpbihjaGFpbik7XG5cbiAgICB9XG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEhhbmRsZSB0aGUgZ29iYW4gd2l0aCB0aGUgdXBkYXRlIG9mIGNoYWluc1xuICAgICAqXG4gICAgICovICBcbiAgICB1cGRhdGVHb2Jhbigpe1xuXG4gICAgICAgIGxldCBuZWlnaGJvcnMgPSB0aGlzLmdldFJvY2soKS5nZXROZWlnaGJvcmluZ1JvY2tzKCdlbm5lbXknKTtcblxuICAgICAgICBpZihuZWlnaGJvcnMubGVuZ3RoICE9IDApe1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgY2hhaW5zT2ZOZWlnaGJvcnMgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKGNoYWluc09mTmVpZ2hib3JzLmluZGV4T2Yocm9jay5nZXRDaGFpbigpKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluc09mTmVpZ2hib3JzLnB1c2gocm9jay5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGZvcihsZXQgY2hhaW4gb2YgY2hhaW5zT2ZOZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKGNoYWlucy5zZWxlY3QoY2hhaW4pLmdldExpYmVydGllcygpID09IDApe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgUmVtb3ZlIGNoYWluICR7Y2hhaW59YCk7XG4gICAgICAgICAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBjaGFpbnMuc2VsZWN0KGNoYWluKS5nZXRSb2NrcygpKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB4ID0gcm9jay54ICogdGhpcy5jZWxsU2l6ZSAtIDEgLSB0aGlzLnJvY2tTaXplIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCB5ID0gcm9jay55ICogdGhpcy5jZWxsU2l6ZSAtIDEgLSB0aGlzLnJvY2tTaXplIC8gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2FudmFzLmNsZWFyUmVjdCh4LHksdGhpcy5yb2NrU2l6ZSArIDIsIHRoaXMucm9ja1NpemUgKyAyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvY2tzLnNlbGVjdChyb2NrKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuY2xhc3MgU2F2ZUFjdGlvbnN7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgIH1cblxuICAgIHVwZGF0ZSgpe1xuICAgIH1cblxufVxuXG5cbmNsYXNzIFNjb3Jle1xuXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICB9XG4gICAgXG59XG5cbmNsYXNzIEdhbWVwbGF5RGlzcGF0Y2hlcntcclxuXHRcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy4kZ29iYW4gPSBTcHJpbnQob3B0aW9uc1snZ2FtZXBsYXknXS5lbGVtZW50KTtcclxuICAgIFx0dGhpcy4kbmV4dCA9IFNwcmludChvcHRpb25zWydjb250cm9sJ10ubmV4dCk7XHJcbiAgICBcdHRoaXMuR2FtZXBsYXkgPSBuZXcgR2FtZXBsYXlBY3Rpb25zKCk7XHJcbiAgICAgICAgdGhpcy5TYXZlID0gbmV3IFNhdmVBY3Rpb25zKCk7XHJcbiAgICBcdHRoaXMubGlzdGVubmVyKCk7XHJcbiAgICB9XHJcblxyXG5cclxuICAgIGxpc3Rlbm5lcigpe1xyXG5cclxuICAgIFx0U3ByaW50KHRoaXMuJGdvYmFuKS5vbignY2xpY2snLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICBpZih0aGlzLkdhbWVwbGF5LmFkZFJvY2soZSkpe1xyXG4gICAgICAgICAgICBcdHRoaXMuR2FtZXBsYXkudXBkYXRlQ2hhaW5zKCk7XHJcbiAgICAgICAgICAgIFx0dGhpcy5HYW1lcGxheS51cGRhdGVHb2JhbigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5TYXZlLnVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5HYW1lcGxheS5zd2l0Y2hQbGF5ZXJzKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgU3ByaW50KHRoaXMuJG5leHQpLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5HYW1lcGxheS5zd2l0Y2hQbGF5ZXJzKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxufVxuY2xhc3MgQ2hhaW5ze1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5jaGFpbnMgPSBbXTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgY2hhaW5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2hhaW4gKHN0cmluZylcclxuICAgICAqLyAgXHJcbiAgICBhZGQoY2hhaW4pe1xyXG4gICAgICAgIHRoaXMuY2hhaW5zW2NoYWluXSA9IG5ldyBDaGFpbihjaGFpbik7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNlbGVjdCBhIGNoYWluXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNoYWluIChjaGFpbilcclxuICAgICAqIEByZXR1cm4gY2hhaW4gb2JqZWN0IHNlbGVjdGVkXHJcbiAgICAgKi8gIFxyXG4gICAgc2VsZWN0KGNoYWluKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbnNbY2hhaW5dO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYWxsIGNoYWluc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5jaGFpbnNcclxuICAgICAqLyAgXHJcbiAgICBnZXQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbnM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBKb2luIDIgY2hhaW5zXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGpvaW4oam9pbkNoYWluLCBjaGFpbil7XHJcbiAgICAgICAgdGhpcy5jaGFpbnNbam9pbkNoYWluXS5yb2Nrcy5wdXNoKC4uLnRoaXMuY2hhaW5zW2NoYWluXS5yb2Nrcyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvdW50IGNoYWluc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5jaGFpbnMubGVuZ3RoXHJcbiAgICAgKi8gIFxyXG4gICAgY291bnQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbnMubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmNsYXNzIENoYWlue1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKXtcclxuICAgICAgICB0aGlzLnJvY2tzID0gW107XHJcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IFtdO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdhbGl2ZSc7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBhZGRSb2NrKHJvY2spe1xyXG4gICAgICAgIHRoaXMucm9ja3MucHVzaChyb2NrKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCByb2Nrc1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBnZXRSb2Nrcygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvY2tzLnNvcnQoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhIGNoYWluXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIHJlbW92ZSgpe1xyXG4gICAgICAgIHRoaXMucm9ja3MgPSBbXTtcclxuICAgICAgICB0aGlzLnN0YXRlID0gJ2RlYWQnO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBib3JkZXJzIG9mIHRoZSBjaGFpblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gYXJyYXlcclxuICAgICAqLyBcclxuICAgIGdldEJvcmRlcnMocGFyYW0gPSAnb2JqZWN0cycpe1xyXG5cclxuICAgICAgICB0aGlzLmJvcmRlciA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IHJvY2sgb2YgdGhpcy5yb2Nrcyl7XHJcbiAgICAgICAgICAgIGlmKHJvY2tzLnNlbGVjdCh7eDogcm9jay54LCB5OiByb2NrLnl9KS5nZXROZWlnaGJvcmluZ1JvY2tzKHJvY2tzLCAnY3VycmVudCcpLmxlbmd0aCAhPSA0KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyLnB1c2gocm9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHBhcmFtID09ICdjb3VudCcpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib3JkZXIubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVyLnNvcnQoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBsaWJlcnRpZXMgb2YgdGhlIHRlcnJpdG9yaWVzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLmxpYmVydGllcyAobnVtYmVyKVxyXG4gICAgICovIFxyXG4gICAgZ2V0TGliZXJ0aWVzKHBhcmFtID0gJ2NvdW50Jyl7XHJcblxyXG4gICAgICAgIHRoaXMubGliZXJ0aWVzID0gW107XHJcbiAgICAgICAgZm9yKGxldCByb2NrIG9mIHRoaXMuZ2V0Qm9yZGVycyhyb2Nrcykpe1xyXG4gICAgICAgICAgICB0aGlzLmxpYmVydGllcy5wdXNoKC4uLnJvY2tzLnNlbGVjdChyb2NrKS5nZXRMaWJlcnRpZXMoJ29iamVjdHMnKSk7XHJcbiAgICAgICAgfSAgICAgXHJcblxyXG4gICAgICAgIGlmKHBhcmFtID09ICdjb3VudCcpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5saWJlcnRpZXMubGVuZ3RoO1xyXG4gICAgICAgIH0gICAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubGliZXJ0aWVzO1xyXG5cclxuICAgIH1cclxufVxyXG5cclxudmFyIGNoYWlucyA9IG5ldyBDaGFpbnMoKTtcbnZhciBwbGF5ZXIgPSAnZGQnO1xyXG5cclxuY2xhc3MgUGxheWVye1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGxheWVyXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcil7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gMTtcclxuICAgICAgICBpZihwbGF5ZXIgPT0gJ2VubmVteScpe1xyXG4gICAgICAgICAgICB0aGlzLm5hbWUgPSAyO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFN3aXRjaCB0byB0aGUgbmV4dCBwbGF5ZXJcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgbmV4dCgpe1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICgodGhpcy5uYW1lKyspICUgMikgKyAxO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHBsYXllclxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5uYW1lXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0KHNlbGVjdCA9ICdjdXJyZW50Jyl7XHJcbiAgICBcdHJldHVybiB0aGlzLm5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIFxyXG59XG5jbGFzcyBSb2Nrc3tcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMucm9ja3MgPSBbXTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByb2NrIChvYmplY3QpIHt4OiB4LCB5Onl9XHJcbiAgICAgKi8gIFxyXG4gICAgYWRkKHJvY2spe1xyXG4gICAgICAgIGlmKHRoaXMucm9ja3Nbcm9jay54XSA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aGlzLnJvY2tzW3JvY2sueF0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb2Nrc1tyb2NrLnhdW3JvY2sueV0gPSBuZXcgUm9jayhyb2NrKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFsbCByb2Nrc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5yb2Nrc1xyXG4gICAgICovICBcclxuICAgIGdldCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvY2tzO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZWxlY3QgYSByb2NrXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHJvY2sgKG9iamVjdCkge3g6IHgsIHk6eX1cclxuICAgICAqIEByZXR1cm4gcm9jayBvYmplY3Qgc2VsZWN0ZWRcclxuICAgICAqLyAgXHJcbiAgICBzZWxlY3Qocm9jayl7XHJcbiAgICAgICAgaWYodGhpcy5yb2Nrc1tyb2NrLnhdICE9IHVuZGVmaW5lZCAmJiB0aGlzLnJvY2tzW3JvY2sueF1bcm9jay55XSAhPSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb2Nrc1tyb2NrLnhdW3JvY2sueV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5jbGFzcyBSb2Nre1xyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB4IGFuZCB5IChudW1iZXIpXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKHJvY2spe1xyXG4gICAgICAgIHRoaXMuY2hhaW4gPSAwO1xyXG4gICAgICAgIHRoaXMueCA9IHJvY2sueDtcclxuICAgICAgICB0aGlzLnkgPSByb2NrLnk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSAwO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSByb2NrXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGFkZChwbGF5ZXIpe1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyLmdldCgpO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYSByb2NrXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIHJlbW92ZShwbGF5ZXIpe1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gMDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IG5laWdoYm9yaW5nIHJvY2tzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHNlbGVjdCAoc3RyaW5nKVxyXG4gICAgICogQHJldHVybiBuZWlnaGJvcmluZyByb2NrcyAoYXJyYXkpXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0TmVpZ2hib3JpbmdSb2NrcyhzZWxlY3QgPSAnYWxsJyl7XHJcblxyXG4gICAgICAgIHRoaXMubmVpZ2hib3JpbmdSb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpPTEgOyBpIDw9IDQgOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgeCA9IHRoaXMueDtcclxuICAgICAgICAgICAgbGV0IHkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2goaSl7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgeSA9IHkgLSAxOyAvLyB0b3BcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgeCsrOyAvLyByaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICB5Kys7IC8vIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICB4ID0geCAtIDE7IC8vIGxlZnRcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHJvY2sgPSByb2Nrcy5zZWxlY3Qoe3gsIHl9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGVjdCAhPSAnZW1wdHknKXtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2sgJiYgcm9jay5nZXRQbGF5ZXIoKSAhPSAwKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2gocm9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2sgJiYgcm9jay5nZXRQbGF5ZXIoKSA9PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2gocm9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHNlbGVjdCAhPSAnYWxsJyAmJiBzZWxlY3QgIT0gJ2VtcHR5Jyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheWVyID0gc2VsZWN0O1xyXG4gICAgICAgICAgICBpZih0eXBlb2Yoc2VsZWN0KSA9PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSAoKHRoaXMuZ2V0UGxheWVyKCkgKyAyKSAlIDIpICsgMTtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGVjdCA9PSAnY3VycmVudCcpe1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllciA9IHRoaXMuZ2V0UGxheWVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgaSBpbiB0aGlzLmNhY2hlKXtcclxuICAgICAgICAgICAgICAgIGxldCByb2NrID0gdGhpcy5jYWNoZVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2suZ2V0UGxheWVyKCkgPT0gcGxheWVyKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MucHVzaChyb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MgPSB0aGlzLmNhY2hlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JpbmdSb2Nrcy5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgbGliZXJ0aWVzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBsaWJlcnRpZXNcclxuICAgICAqLyAgXHJcbiAgICBnZXRMaWJlcnRpZXMocGFyYW0gPSAnY291bnQnKXsgIFxyXG5cclxuICAgICAgICBsZXQgbmVpZ2hib3JzID0gdGhpcy5nZXROZWlnaGJvcmluZ1JvY2tzKCdlbXB0eScpO1xyXG4gICAgICAgIGlmKHBhcmFtID09ICdjb3VudCcpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmVpZ2hib3JzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5laWdoYm9ycztcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgcGxheWVyIFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5wbGF5ZXJcclxuICAgICAqLyAgXHJcbiAgICBnZXRQbGF5ZXIoKXsgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYXllcjtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGNoYWluIFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjaGFpbiAobnVtYmVyKVxyXG4gICAgICovICBcclxuICAgIHNldENoYWluKGNoYWluKXsgIFxyXG4gICAgICAgIHRoaXMuY2hhaW4gPSBjaGFpbjsgXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBjaGFpbiBcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMuY2hhaW5cclxuICAgICAqLyAgXHJcbiAgICBnZXRDaGFpbigpeyAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW47XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxudmFyIHJvY2tzID0gbmV3IFJvY2tzKCk7XHJcblxuLyoqXG4gKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXG4gKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhLCBUSMOpbyBLbnV0eiBldCBMw6lvIExlIEJyYXNcbiAqIEhFVElDIFAyMDE5XG4gKlxuICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlbGVyKVxuICpcbiAqIENvcHlyaWdodCAyMDE1XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqXG4gKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICovXG5cbnZhciBvcHRpb25zID0ge1xuICAgIGdvYmFuOiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2JhbidcbiAgICB9LFxuICAgIGdhbWVwbGF5OiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9nYW1lcGxheSdcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgICAgbmJyZTogJzE5JyxcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuX2dyaWQnLFxuICAgICAgICBjZWxsU2l6ZTogNDAsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICdibGFjaycsXG4gICAgICAgIGJvcmRlcldpZHRoOiAyXG4gICAgfSxcbiAgICByb2NrOntcbiAgICAgICAgc2l6ZTogMjAsXG4gICAgICAgIHBsYXllcjE6ICdncmV5JyxcbiAgICAgICAgcGxheWVyMjogJ2JsYWNrJ1xuICAgIH0sXG4gICAgY29udHJvbDp7XG4gICAgICAgIG5leHQ6ICcuR2FtZV9jb250cm9sX25leHQnXG4gICAgfVxufTtcblxuR29HYW1lKCk7XG4iXX0=
