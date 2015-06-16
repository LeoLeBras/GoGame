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
        value: function checkKO(position) {

            var item = players.getCurrent().getHistoric('last');
            var response = false;

            if (item.type == 'add-rock' && item.params.x == position.x && item.params.y == position.y) {
                response = true;
            }

            if (response) {
                console.log('Case of KO for player ' + players.getCurrent().getName() + ' on ' + this.x + ';' + this.y);
            }

            return response;
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
                        var rock = chains.select(item).getLiberties('objects')[0];
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
                        if (rock.x == this.x && rock.y == this.y && rock.getNeighboringRocks().length == 4) {
                            response = true;
                        }
                    }
                } else if (this.getRock().getNeighboringRocks(players.getAdversary().getName()).length == 4) {
                    response = true;
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
            if (1 <= this.x && this.x <= this.grid && 1 <= this.y && this.y <= this.grid && this.getRock().getPlayer() == 0 && !this.checkSuicide() && !this.checkKO({
                x: this.x,
                y: this.y
            })) {

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
            this.cache = [];
            var cache = '';

            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = this.getBorders(rocks)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var rock = _step12.value;
                    var _iteratorNormalCompletion13 = true;
                    var _didIteratorError13 = false;
                    var _iteratorError13 = undefined;

                    try {

                        for (var _iterator13 = rocks.select(rock).getLiberties('objects')[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                            var object = _step13.value;

                            cache = '' + object.x + ';' + object.y;
                            if (this.cache.indexOf(cache) == -1) {
                                this.liberties.push(object);
                                this.cache.push(cache);
                            }
                        }
                    } catch (err) {
                        _didIteratorError13 = true;
                        _iteratorError13 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion13 && _iterator13['return']) {
                                _iterator13['return']();
                            }
                        } finally {
                            if (_didIteratorError13) {
                                throw _iteratorError13;
                            }
                        }
                    }
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2Zha2VfZmVhM2MzMTcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7OztBQ0FBLFNBQVMsTUFBTSxHQUFFOztBQUViLFFBQUksV0FBVyxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7QUFDaEMsZUFBVyxDQUFDLEdBQUcsRUFBRSxDQUFDO0FBQ2xCLFFBQUksUUFBUSxHQUFHLElBQUksa0JBQWtCLEVBQUUsQ0FBQztDQUMzQzs7SUFDSyxPQUFPOzs7Ozs7O0FBTUUsYUFOVCxPQUFPLEdBTUk7OEJBTlgsT0FBTzs7QUFPTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUVuRCxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQzs7QUFFMUQsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLFlBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzRCxZQUFJLENBQUMsV0FBVyxH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RSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImZ1bmN0aW9uIEdvR2FtZSgpe1xuXG4gICAgdmFyIEdhbWVCdWlsZGVyID0gbmV3IEJ1aWxkZXIoKTtcbiAgICBHYW1lQnVpbGRlci5ydW4oKTtcbiAgICB2YXIgR2FtZXBsYXkgPSBuZXcgR2FtZXBsYXlEaXNwYXRjaGVyKCk7XG59XG5jbGFzcyBCdWlsZGVye1xuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqLyAgICAgXG4gICAgY29uc3RydWN0b3IoKXtcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuZ3JpZGJvcmRlcldpZHRoID0gb3B0aW9uc1snZ3JpZCddLmJvcmRlcldpZHRoO1xuXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG4gICAgICAgIHRoaXMuZ3JpZFNpemUgPSAocGFyc2VJbnQodGhpcy5ncmlkKSArIDEpICogdGhpcy5jZWxsU2l6ZTtcblxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydnb2JhbiddLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheSA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkID0gU3ByaW50KG9wdGlvbnNbJ2dyaWQnXS5lbGVtZW50KTtcblxuICAgICAgICB0aGlzLmdyaWRDYW52YXMgPSB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICB0aGlzLmdhbWVwbGF5Q2FudmFzID0gdGhpcy4kZ29iYW5fZ2FtZXBsYXkuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdvYmFuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNzcyBzdHlsZSBvZiB0aGUgZ29iYW5cbiAgICAgKi8gIFxuICAgIGJ1aWxkR29iYW4oKXtcbiAgICAgICAgdGhpcy4kZ29iYW4uY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplLFxuICAgICAgICB9KTtcbiAgICB9XG5cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB0aGUgZ2FtZXBsYXkgY2FudmFzXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGNhbnZhc1xuICAgICAqLyAgXG4gICAgYnVpbGRHYW1lcGxheSgpe1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0ud2lkdGggPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0uaGVpZ2h0ID0gdGhpcy5ncmlkU2l6ZTtcbiAgICAgICAgdGhpcy4kZ29iYW5fZ2FtZXBsYXkuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplXG4gICAgICAgIH0pXG4gICAgfVxuXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgdGhlIGdyaWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gY2FudmFzIHdpdGggYSBncmlkIGRyYXduXG4gICAgICovICBcbiAgICBidWlsZEdyaWQoKXtcblxuICAgICAgICAvLyBTZXQgc2l6ZSBvZiBjYW52YXNcbiAgICAgICAgdGhpcy4kZ29iYW5fZ3JpZC5kb21bMF0ud2lkdGggPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS5oZWlnaHQgPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmNzcyh7XG4gICAgICAgICAgICB3aWR0aDogdGhpcy5ncmlkU2l6ZSxcbiAgICAgICAgICAgIGhlaWdodDogdGhpcy5ncmlkU2l6ZVxuICAgICAgICB9KVxuXG4gICAgICAgIC8vIEluaXQgdGhlIGNhbnZhc1xuICAgICAgICB2YXIgYyA9IHRoaXMuZ3JpZENhbnZhcztcblxuICAgICAgICAvLyBEcmF3IGVhY2ggbGluZXMgb2YgdGhlIGdyaWRcbiAgICAgICAgZm9yKHZhciB4ID0gMTsgeCA8PSB0aGlzLmdyaWQgOyB4Kyspe1xuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGMubW92ZVRvKHRoaXMuY2VsbFNpemUsIHRoaXMuY2VsbFNpemUgKiB4KTtcbiAgICAgICAgICAgIGMubGluZVRvKHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplLCB0aGlzLmNlbGxTaXplICogeCk7XG4gICAgICAgICAgICBjLmxpbmVXaWR0aCA9IHRoaXMuZ3JpZGJvcmRlcldpZHRoO1xuICAgICAgICAgICAgYy5zdHJva2UoKTtcbiAgICAgICAgfVxuICAgICAgICBmb3IodmFyIHkgPSAxOyB5IDw9IHRoaXMuZ3JpZCA7IHkrKyl7XG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgYy5tb3ZlVG8odGhpcy5jZWxsU2l6ZSAqIHksIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgYy5saW5lVG8odGhpcy5jZWxsU2l6ZSAqIHksIHRoaXMuZ3JpZFNpemUgLSB0aGlzLmNlbGxTaXplKTtcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gdGhpcy5ncmlkYm9yZGVyV2lkdGg7XG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIGFsbCBlbGVtZW50c1xuICAgICAqXG4gICAgICovICBcbiAgICBydW4oKXtcbiAgICAgICAgdGhpcy5idWlsZEdvYmFuKCk7XG4gICAgICAgIHRoaXMuYnVpbGRHYW1lcGxheSgpO1xuICAgICAgICB0aGlzLmJ1aWxkR3JpZCgpO1xuICAgIH1cblxufVxuY2xhc3MgR2FtZXBsYXlBY3Rpb25ze1xuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJheSBvcHRpb25zXG4gICAgICovICAgXG4gICAgY29uc3RydWN0b3IoKXtcblxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJGdvYmFuLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy5yb2NrO1xuICAgICAgICB0aGlzLnJvY2tTaXplID0gb3B0aW9uc1sncm9jayddLnNpemU7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjEgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMTtcbiAgICAgICAgdGhpcy5yb2NrUGxheWVyMiA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIyO1xuXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcblxuICAgICAgICBmb3IodGhpcy54PSAxOyB0aGlzLnggPD0gdGhpcy5ncmlkIDsgdGhpcy54Kyspe1xuICAgICAgICAgICAgZm9yKHRoaXMueSA9IDE7IHRoaXMueSA8PSB0aGlzLmdyaWQgOyB0aGlzLnkrKyl7XG4gICAgICAgICAgICAgICAgcm9ja3MuYWRkKHtcbiAgICAgICAgICAgICAgICAgICAgeCA6IHRoaXMueCxcbiAgICAgICAgICAgICAgICAgICAgeSA6IHRoaXMueVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBLT1xuICAgICAqXG4gICAgICovICBcbiAgICBjaGVja0tPKHBvc2l0aW9uKXtcblxuICAgICAgICBsZXQgaXRlbSA9IHBsYXllcnMuZ2V0Q3VycmVudCgpLmdldEhpc3RvcmljKCdsYXN0Jyk7XG4gICAgICAgIGxldCByZXNwb25zZSA9IGZhbHNlO1xuXG4gICAgICAgIGlmKGl0ZW0udHlwZSA9PSAnYWRkLXJvY2snICYmXG4gICAgICAgICAgIGl0ZW0ucGFyYW1zLnggPT0gcG9zaXRpb24ueCAmJlxuICAgICAgICAgICBpdGVtLnBhcmFtcy55ID09IHBvc2l0aW9uLnkpe1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYocmVzcG9uc2Upe1xuICAgICAgICAgICAgY29uc29sZS5sb2coYENhc2Ugb2YgS08gZm9yIHBsYXllciAke3BsYXllcnMuZ2V0Q3VycmVudCgpLmdldE5hbWUoKX0gb24gJHt0aGlzLnh9OyR7dGhpcy55fWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgdGhlIHBsYXllciBpcyBvbiBhIGNhc2Ugb24gc3VpY2lkZVxuICAgICAqXG4gICAgICovICBcbiAgICBjaGVja1N1aWNpZGUoKXtcblxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBmYWxzZTtcbiAgICAgICAgbGV0IG5laWdoYm9ycyA9IHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3MocGxheWVycy5nZXRBZHZlcnNhcnkoKS5nZXROYW1lKCkpO1xuICAgICAgICB0aGlzLmNhY2hlID0gW107XG5cbiAgICAgICAgZm9yKGxldCBuZWlnaGJvciBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbmRleE9mKG5laWdoYm9yLmdldENoYWluKCkpID09IC0xKXtcbiAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2gobmVpZ2hib3IuZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY291bnQgPSAwO1xuXG4gICAgICAgIGZvcihsZXQgaXRlbSBvZiB0aGlzLmNhY2hlKXtcbiAgICAgICAgICAgIGlmKGNoYWlucy5zZWxlY3QoaXRlbSkuZ2V0TGliZXJ0aWVzKCkgPT0gMSl7XG4gICAgICAgICAgICAgICAgbGV0IHJvY2sgPSBjaGFpbnMuc2VsZWN0KGl0ZW0pLmdldExpYmVydGllcygnb2JqZWN0cycpWzBdO1xuICAgICAgICAgICAgICAgIGlmKHJvY2sueCA9PSB0aGlzLnggJiYgcm9jay55ID09IHRoaXMueSl7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYoY291bnQgPT0gMCl7XG4gICAgICAgICAgICBuZWlnaGJvcnMgPSB0aGlzLmdldFJvY2soKS5nZXROZWlnaGJvcmluZ1JvY2tzKHBsYXllcnMuZ2V0Q3VycmVudCgpLmdldE5hbWUoKSk7XG4gICAgICAgICAgICB0aGlzLmNhY2hlID0gW107XG5cbiAgICAgICAgICAgIGZvcihsZXQgbmVpZ2hib3Igb2YgbmVpZ2hib3JzKXtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmNhY2hlLmluZGV4T2YobmVpZ2hib3IuZ2V0Q2hhaW4oKSkgPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2gobmVpZ2hib3IuZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLmNhY2hlLmxlbmd0aCAhPSAgMCl7XG4gICAgICAgICAgICAgICAgY291bnQgPSAwO1xuICAgICAgICAgICAgICAgIGZvcihsZXQgY2hhaW4gb2YgdGhpcy5jYWNoZSl7XG4gICAgICAgICAgICAgICAgICAgIGlmKGNoYWlucy5zZWxlY3QoY2hhaW4pLmdldExpYmVydGllcygpID09IDEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmKGNvdW50ID09IHRoaXMuY2FjaGUubGVuZ3RoKXtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHJvY2sgPSBjaGFpbnMuc2VsZWN0KHRoaXMuY2FjaGVbMF0pLmdldExpYmVydGllcygnb2JqZWN0cycpWzBdO1xuICAgICAgICAgICAgICAgICAgICBpZihyb2NrLnggPT0gdGhpcy54ICYmIHJvY2sueSA9PSB0aGlzLnkgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgcm9jay5nZXROZWlnaGJvcmluZ1JvY2tzKCkubGVuZ3RoID09IDQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9ICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAgICAgICAgXG4gICAgICAgICAgICBlbHNlIGlmKHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3MocGxheWVycy5nZXRBZHZlcnNhcnkoKS5nZXROYW1lKCkpLmxlbmd0aCA9PSA0KXtcbiAgICAgICAgICAgICAgICByZXNwb25zZSA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuXG4gICAgICAgIGlmKHJlc3BvbnNlKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcqKioqJyk7ICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgQ2FzZSBvZiBzdWljaWRlIGZvciBwbGF5ZXIgJHtwbGF5ZXJzLmdldEN1cnJlbnQoKS5nZXROYW1lKCl9IG9uICR7dGhpcy54fTske3RoaXMueX1gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiByZXNwb25zZTtcblxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogU3dpdGNoIHBsYXllcnNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgc3dpdGNoUGxheWVycyhvcmlnaW4gPSAnZGlzcGF0Y2hlcicpe1xuICAgICAgICBcbiAgICAgICAgaWYob3JpZ2luID09ICd1c2VyJyl7XG4gICAgICAgICAgICBwbGF5ZXJzLmdldEN1cnJlbnQoKS51cGRhdGVIaXN0b3JpYyh7XG4gICAgICAgICAgICAgICAgdHlwZTogJ25leHQnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICBwbGF5ZXJzLnN3aXRjaCgpO1xuXG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIENoZWNrIGlmIHRoZSBnYW1lIGlzIGZpbmlzZWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gYm9sZWVublxuICAgICAqLyAgXG4gICAgaXNGaW5pc2hlZChhY3Rpb24gPSBudWxsKXtcblxuICAgICAgICBsZXQgcmVzcG9uc2UgPSBmYWxzZTtcblxuICAgICAgICBpZihhY3Rpb24gIT0gbnVsbCAmJlxuICAgICAgICAgICBhY3Rpb24udHlwZSA9PSAnbmV4dCcgJiZcbiAgICAgICAgICAgcGxheWVycy5nZXRBZHZlcnNhcnkoKS5nZXRIaXN0b3JpYygnbGFzdCcpLnR5cGUgPT0gJ25leHQnKXtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG5cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogR2FtZSBPdmVyXG4gICAgICpcbiAgICAgKi8gIFxuICAgIGdhbWVPdmVyKCl7XG4gICAgICAgIGFsZXJ0KCdHYW1lIE92ZXIgISA6LycpO1xuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBHZXQgb2JqZWN0IG9mIHRoZSBjdXJyZW50IHJvY2tcbiAgICAgKlxuICAgICAqIEBwYXJtYSB0eXBlIChzdHJpbmcpXG4gICAgICogQHJldHVybiByb2NrIChvYmplY3QpXG4gICAgICovICBcbiAgICBnZXRSb2NrKHR5cGUgPSAnY29tcGxldGUnKXtcblxuICAgICAgICBsZXQgcm9jayA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMueCwgXG4gICAgICAgICAgICB5OiB0aGlzLnlcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHR5cGUgPT0gJ3NpbXBsZScpe1xuICAgICAgICAgICAgcmV0dXJuIHJvY2s7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcm9ja3Muc2VsZWN0KHJvY2spO1xuXG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIFRoZSBwbGF5ZXIgY2xpY2sgb24gdGhlIGdvYmFuIHRvIHB1dCBhIHJvY2tcbiAgICAgKlxuICAgICAqLyAgXG4gICAgYWRkUm9jayhlKXtcblxuICAgICAgICAvLyBTZXQgY3VycmVudCByb2NrXG4gICAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IoKGUubGF5ZXJYICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IoKGUubGF5ZXJZICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG5cbiAgICAgICAgLy8gSWYgdGhlIHBsYXllciBjYW4gcGxheSBoZXJlXG4gICAgICAgIGlmKDEgPD0gdGhpcy54ICYmIHRoaXMueCA8PSB0aGlzLmdyaWQgJiYgMSA8PSB0aGlzLnkgJiYgdGhpcy55IDw9IHRoaXMuZ3JpZCAmJlxuICAgICAgICAgICB0aGlzLmdldFJvY2soKS5nZXRQbGF5ZXIoKSA9PSAwICYmXG4gICAgICAgICAgICF0aGlzLmNoZWNrU3VpY2lkZSgpICYmXG4gICAgICAgICAgICF0aGlzLmNoZWNrS08oe1xuICAgICAgICAgICAgICAgeDogdGhpcy54LFxuICAgICAgICAgICAgICAgeTogdGhpcy55XG4gICAgICAgICAgIH0pKXtcblxuICAgICAgICAgICAgLy8gRGVidWdcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCcqKioqJyk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgUGxheWVyICR7cGxheWVycy5nZXRDdXJyZW50KCkuZ2V0TmFtZSgpfSBvbiAke3RoaXMueH07JHt0aGlzLnl9YCk7XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0Um9jaygpLmFkZChwbGF5ZXJzLmdldEN1cnJlbnQoKS5nZXROYW1lKCkpO1xuICAgICAgICAgICAgcGxheWVycy5nZXRDdXJyZW50KCkudXBkYXRlSGlzdG9yaWMoe1xuICAgICAgICAgICAgICAgIHR5cGU6ICdhZGQtcm9jaycsXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XG4gICAgICAgICAgICAgICAgICAgIHg6IHRoaXMueCxcbiAgICAgICAgICAgICAgICAgICAgeTogdGhpcy55XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIGxldCBjb2xvciA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIxO1xuICAgICAgICAgICAgaWYocGxheWVycy5nZXRDdXJyZW50KCkuZ2V0TmFtZSgpID09IDIpe1xuICAgICAgICAgICAgICAgIGNvbG9yID0gIG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgYyA9IHRoaXMuY2FudmFzO1xuICAgICAgICAgICAgYy5iZWdpblBhdGgoKTtcbiAgICAgICAgICAgIGMuYXJjKHRoaXMueCAqIHRoaXMuY2VsbFNpemUsIHRoaXMueSAqIHRoaXMuY2VsbFNpemUsIHRoaXMucm9ja1NpemUgLyAyLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xuICAgICAgICAgICAgYy5jbG9zZVBhdGgoKTtcbiAgICAgICAgICAgIGMuZmlsbFN0eWxlID0gY29sb3I7XG4gICAgICAgICAgICBjLmZpbGwoKTtcblxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIFVwZGF0ZSBjaGFpbnNcbiAgICAgKlxuICAgICAqLyAgXG4gICAgdXBkYXRlQ2hhaW5zKCl7XG5cbiAgICAgICAgLy8gR2V0IG5laWdoYm9yc1xuICAgICAgICB2YXIgbmVpZ2hib3JzID0gdGhpcy5nZXRSb2NrKCkuZ2V0TmVpZ2hib3JpbmdSb2NrcygnY3VycmVudCcpO1xuXG4gICAgICAgIGlmKG5laWdoYm9ycy5sZW5ndGggIT0gMCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEdldCBjaGFpbnMgZnJvbSBuZWlnaGJvcmluZ3MgaW50ZXJzZWN0aW9ucyAgICAgICAgXG4gICAgICAgICAgICBsZXQgY2hhaW5zT2ZOZWlnaGJvcnMgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiBuZWlnaGJvcnMpe1xuICAgICAgICAgICAgICAgIGlmKGNoYWluc09mTmVpZ2hib3JzLmluZGV4T2Yocm9jay5nZXRDaGFpbigpKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIGNoYWluc09mTmVpZ2hib3JzLnB1c2gocm9jay5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIENBU0UgMSA6IEFkZCB0aGUgcm9jayB0byB0aGUgY2hhaW5cbiAgICAgICAgICAgIGlmKGNoYWluc09mTmVpZ2hib3JzLmxlbmd0aCA9PSAxKXtcbiAgICAgICAgICAgICAgICB2YXIgY2hhaW4gPSBjaGFpbnNPZk5laWdoYm9yc1swXTsgLy8gU2V0IGluZGV4IG9mIHRoZSBjaGFpblxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBDQVNFIDIgOiBKb2luIGNoYWluc1xuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjaGFpbnNPZk5laWdoYm9ycyA9IGNoYWluc09mTmVpZ2hib3JzLnNvcnQoKTtcbiAgICAgICAgICAgICAgICBsZXQgam9pbkNoYWluID0gY2hhaW5zT2ZOZWlnaGJvcnNbMF07XG4gICAgICAgICAgICAgICAgZm9yKGxldCBjaGFpbiBvZiBjaGFpbnNPZk5laWdoYm9ycy5yZXZlcnNlKCkpe1xuICAgICAgICAgICAgICAgICAgICBpZihjaGFpbiAhPSBqb2luQ2hhaW4pe1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIGNoYWlucy5zZWxlY3QoY2hhaW4pLmdldFJvY2tzKCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJvY2tzLnNlbGVjdChyb2NrKS5zZXRDaGFpbihqb2luQ2hhaW4pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgY2hhaW5zLmpvaW4oam9pbkNoYWluLCBjaGFpbik7XG4gICAgICAgICAgICAgICAgICAgICAgICBjaGFpbnMuc2VsZWN0KGNoYWluKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjaGFpbiA9IGpvaW5DaGFpbjsgLy8gU2V0IGluZGV4IG9mIHRoZSBjaGFpblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ0FTRSAzIDogQ3JlYXRlIG5ldyBjaGFpblxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgdmFyIGNoYWluID0gY2hhaW5zLmNvdW50KCk7XG4gICAgICAgICAgICBjaGFpbnMuYWRkKGNoYWluKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFkZCBjdXJyZW50IHJvY2sgdG8gdGhlIGNoYWluXG4gICAgICAgIGNoYWlucy5zZWxlY3QoY2hhaW4pLmFkZFJvY2sodGhpcy5nZXRSb2NrKCdzaW1wbGUnKSk7XG4gICAgICAgIHRoaXMuZ2V0Um9jaygpLnNldENoYWluKGNoYWluKTtcblxuICAgIH1cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogSGFuZGxlIHRoZSBnb2JhbiB3aXRoIHRoZSB1cGRhdGUgb2YgY2hhaW5zXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHVwZGF0ZUdvYmFuKCl7XG5cbiAgICAgICAgbGV0IG5laWdoYm9ycyA9IHRoaXMuZ2V0Um9jaygpLmdldE5laWdoYm9yaW5nUm9ja3MoJ2VubmVteScpO1xuXG4gICAgICAgIGlmKG5laWdoYm9ycy5sZW5ndGggIT0gMCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGxldCBjaGFpbnNPZk5laWdoYm9ycyA9IFtdO1xuICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIG5laWdoYm9ycyl7XG4gICAgICAgICAgICAgICAgaWYoY2hhaW5zT2ZOZWlnaGJvcnMuaW5kZXhPZihyb2NrLmdldENoYWluKCkpID09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW5zT2ZOZWlnaGJvcnMucHVzaChyb2NrLmdldENoYWluKCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgZm9yKGxldCBjaGFpbiBvZiBjaGFpbnNPZk5laWdoYm9ycyl7XG4gICAgICAgICAgICAgICAgaWYoY2hhaW5zLnNlbGVjdChjaGFpbikuZ2V0TGliZXJ0aWVzKCkgPT0gMCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGBSZW1vdmUgY2hhaW4gJHtjaGFpbn1gKTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIGNoYWlucy5zZWxlY3QoY2hhaW4pLmdldFJvY2tzKCkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHggPSByb2NrLnggKiB0aGlzLmNlbGxTaXplIC0gMSAtIHRoaXMucm9ja1NpemUgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHkgPSByb2NrLnkgKiB0aGlzLmNlbGxTaXplIC0gMSAtIHRoaXMucm9ja1NpemUgLyAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jYW52YXMuY2xlYXJSZWN0KHgseSx0aGlzLnJvY2tTaXplICsgMiwgdGhpcy5yb2NrU2l6ZSArIDIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcm9ja3Muc2VsZWN0KHJvY2spLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5jbGFzcyBTYXZlQWN0aW9uc3tcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgfVxuXG4gICAgdXBkYXRlKCl7XG4gICAgfVxuXG59XG5cblxuY2xhc3MgU2NvcmV7XG5cbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgIH1cbiAgICBcbn1cblxuY2xhc3MgR2FtZXBsYXlEaXNwYXRjaGVye1xyXG5cdFxyXG4gICAgY29uc3RydWN0b3IoKXtcclxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpO1xyXG4gICAgXHR0aGlzLiRuZXh0ID0gU3ByaW50KG9wdGlvbnNbJ2NvbnRyb2wnXS5uZXh0KTtcclxuICAgIFx0dGhpcy5HYW1lcGxheSA9IG5ldyBHYW1lcGxheUFjdGlvbnMoKTtcclxuICAgICAgICB0aGlzLlNhdmUgPSBuZXcgU2F2ZUFjdGlvbnMoKTtcclxuICAgIFx0dGhpcy5saXN0ZW5uZXIoKTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgbGlzdGVubmVyKCl7XHJcblxyXG4gICAgXHRTcHJpbnQodGhpcy4kZ29iYW4pLm9uKCdjbGljaycsIChlKSA9PiB7XHJcbiAgICAgICAgICAgIGlmKHRoaXMuR2FtZXBsYXkuYWRkUm9jayhlKSl7XHJcbiAgICAgICAgICAgIFx0dGhpcy5HYW1lcGxheS51cGRhdGVDaGFpbnMoKTtcclxuICAgICAgICAgICAgXHR0aGlzLkdhbWVwbGF5LnVwZGF0ZUdvYmFuKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLlNhdmUudXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkdhbWVwbGF5LnN3aXRjaFBsYXllcnMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBTcHJpbnQodGhpcy4kbmV4dCkub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICAgICAgICBpZighdGhpcy5HYW1lcGxheS5pc0ZpbmlzaGVkKHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICduZXh0JyxcclxuICAgICAgICAgICAgICAgIHBsYXllcjogJ3BsYXllcnMuZ2V0Q3VycmVudCgpJ1xyXG4gICAgICAgICAgICB9KSl7XHJcbiAgICAgICAgICAgICAgICB0aGlzLkdhbWVwbGF5LnN3aXRjaFBsYXllcnMoJ3VzZXInKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICAgICAgdGhpcy5HYW1lcGxheS5nYW1lT3ZlcigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfVxyXG5cclxufVxuY2xhc3MgQ2hhaW5ze1xyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5jaGFpbnMgPSBbXTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgY2hhaW5cclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2hhaW4gKHN0cmluZylcclxuICAgICAqLyAgXHJcbiAgICBhZGQoY2hhaW4pe1xyXG4gICAgICAgIHRoaXMuY2hhaW5zW2NoYWluXSA9IG5ldyBDaGFpbihjaGFpbik7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNlbGVjdCBhIGNoYWluXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIGNoYWluIChjaGFpbilcclxuICAgICAqIEByZXR1cm4gY2hhaW4gb2JqZWN0IHNlbGVjdGVkXHJcbiAgICAgKi8gIFxyXG4gICAgc2VsZWN0KGNoYWluKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbnNbY2hhaW5dO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgYWxsIGNoYWluc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5jaGFpbnNcclxuICAgICAqLyAgXHJcbiAgICBnZXQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbnM7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBKb2luIDIgY2hhaW5zXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGpvaW4oam9pbkNoYWluLCBjaGFpbil7XHJcbiAgICAgICAgdGhpcy5jaGFpbnNbam9pbkNoYWluXS5yb2Nrcy5wdXNoKC4uLnRoaXMuY2hhaW5zW2NoYWluXS5yb2Nrcyk7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvdW50IGNoYWluc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5jaGFpbnMubGVuZ3RoXHJcbiAgICAgKi8gIFxyXG4gICAgY291bnQoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5jaGFpbnMubGVuZ3RoO1xyXG4gICAgfVxyXG5cclxuXHJcbn1cclxuXHJcbmNsYXNzIENoYWlue1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3RvcihuYW1lKXtcclxuICAgICAgICB0aGlzLnJvY2tzID0gW107XHJcbiAgICAgICAgdGhpcy5ib3JkZXIgPSBbXTtcclxuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IFtdO1xyXG4gICAgICAgIHRoaXMubmFtZSA9IG5hbWU7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9ICdhbGl2ZSc7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBhZGRSb2NrKHJvY2spe1xyXG4gICAgICAgIHRoaXMucm9ja3MucHVzaChyb2NrKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCByb2Nrc1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBnZXRSb2Nrcygpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvY2tzLnNvcnQoKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJlbW92ZSBhIGNoYWluXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIHJlbW92ZSgpe1xyXG4gICAgICAgIHRoaXMucm9ja3MgPSBbXTtcclxuICAgICAgICB0aGlzLnN0YXRlID0gJ2RlYWQnO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFJldHVybiBib3JkZXJzIG9mIHRoZSBjaGFpblxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gYXJyYXlcclxuICAgICAqLyBcclxuICAgIGdldEJvcmRlcnMocGFyYW0gPSAnb2JqZWN0cycpe1xyXG5cclxuICAgICAgICB0aGlzLmJvcmRlciA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IHJvY2sgb2YgdGhpcy5yb2Nrcyl7XHJcbiAgICAgICAgICAgIGlmKHJvY2tzLnNlbGVjdCh7eDogcm9jay54LCB5OiByb2NrLnl9KS5nZXROZWlnaGJvcmluZ1JvY2tzKHJvY2tzLCAnY3VycmVudCcpLmxlbmd0aCAhPSA0KXtcclxuICAgICAgICAgICAgICAgIHRoaXMuYm9yZGVyLnB1c2gocm9jayk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHBhcmFtID09ICdjb3VudCcpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5ib3JkZXIubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVyLnNvcnQoKTtcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBsaWJlcnRpZXMgb2YgdGhlIHRlcnJpdG9yaWVzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLmxpYmVydGllcyAobnVtYmVyKVxyXG4gICAgICovIFxyXG4gICAgZ2V0TGliZXJ0aWVzKHBhcmFtID0gJ2NvdW50Jyl7XHJcblxyXG4gICAgICAgIHRoaXMubGliZXJ0aWVzID0gW107XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xyXG4gICAgICAgIGxldCBjYWNoZSA9ICcnO1xyXG5cclxuICAgICAgICBmb3IobGV0IHJvY2sgb2YgdGhpcy5nZXRCb3JkZXJzKHJvY2tzKSl7XHJcblxyXG4gICAgICAgICAgICBmb3IobGV0IG9iamVjdCBvZiByb2Nrcy5zZWxlY3Qocm9jaykuZ2V0TGliZXJ0aWVzKCdvYmplY3RzJykpe1xyXG4gICAgICAgICAgICAgICAgY2FjaGUgPSBgJHtvYmplY3QueH07JHtvYmplY3QueX1gXHJcbiAgICAgICAgICAgICAgICBpZih0aGlzLmNhY2hlLmluZGV4T2YoY2FjaGUpID09IC0xKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxpYmVydGllcy5wdXNoKG9iamVjdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jYWNoZS5wdXNoKGNhY2hlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0gICAgIFxyXG5cclxuICAgICAgICBpZihwYXJhbSA9PSAnY291bnQnKXtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubGliZXJ0aWVzLmxlbmd0aDtcclxuICAgICAgICB9ICAgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmxpYmVydGllcztcclxuXHJcbiAgICB9XHJcbn1cclxuXHJcbnZhciBjaGFpbnMgPSBuZXcgQ2hhaW5zKCk7XG5jbGFzcyBQbGF5ZXJze1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKCl7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50ID0gMTtcclxuICAgICAgICB0aGlzLnBsYXllcnMgPSBbXTtcclxuICAgICAgICB0aGlzLnBsYXllcnNbMV0gPSBuZXcgUGxheWVyKDEpO1xyXG4gICAgICAgIHRoaXMucGxheWVyc1syXSA9IG5ldyBQbGF5ZXIoMik7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0Q3VycmVudCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYXllcnNbdGhpcy5jdXJyZW50XTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBZHZlcnNhcnkoKXtcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXJzWygodGhpcy5jdXJyZW50ICsgMikgJSAyKSArIDFdO1xyXG4gICAgfVxyXG5cclxuICAgIHN3aXRjaCgpe1xyXG4gICAgICAgIHRoaXMuY3VycmVudCA9ICgodGhpcy5jdXJyZW50KyspICUgMikgKyAxO1xyXG4gICAgfVxyXG5cclxufVxyXG5cclxuY2xhc3MgUGxheWVye1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGxheWVyXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcil7XHJcbiAgICAgICAgdGhpcy5uYW1lID0gcGxheWVyO1xyXG4gICAgICAgIHRoaXMuaGlzdG9yaWMgPSBbXTtcclxuICAgICAgICB0aGlzLmhpc3RvcmljWzBdID0ge1xyXG4gICAgICAgICAgICB0eXBlOiAnJyxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMuaGlzdG9yaWNbMV0gPSB0aGlzLmhpc3RvcmljWzBdO1xyXG4gICAgICAgIHRoaXMuaGlzdG9yaWNbMl0gPSB0aGlzLmhpc3RvcmljWzFdO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHBsYXllclxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5uYW1lXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0TmFtZSgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLm5hbWU7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBVcGRhdGUgaGlzdG9yaWNcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgdXBkYXRlSGlzdG9yaWMoYWN0aW9uKXtcclxuICAgICAgICB0aGlzLmhpc3RvcmljWzBdID0gdGhpcy5oaXN0b3JpY1sxXTtcclxuICAgICAgICB0aGlzLmhpc3RvcmljWzFdID0gdGhpcy5oaXN0b3JpY1syXTtcclxuICAgICAgICB0aGlzLmhpc3RvcmljWzJdID0gYWN0aW9uO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGhpc3RvcmljXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGdldEhpc3RvcmljKGluZGV4ID0gJ2FsbCcpe1xyXG4gICAgICAgIFxyXG4gICAgICAgIGxldCByZXNwb25zZSA9ICcnO1xyXG5cclxuICAgICAgICBzd2l0Y2goaW5kZXgpe1xyXG4gICAgICAgICAgICBjYXNlICdhbGwnIDpcclxuICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gdGhpcy5oaXN0b3JpYztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdsYXN0JyA6IFxyXG4gICAgICAgICAgICAgICAgcmVzcG9uc2UgPSB0aGlzLmhpc3RvcmljWzJdO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcblxyXG4gICAgfVxyXG4gICAgICAgIFxyXG59XHJcblxyXG52YXIgcGxheWVycyA9IG5ldyBQbGF5ZXJzKCk7XG5jbGFzcyBSb2Nrc3tcclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICovICAgXHJcbiAgICBjb25zdHJ1Y3Rvcigpe1xyXG4gICAgICAgIHRoaXMucm9ja3MgPSBbXTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQWRkIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSByb2NrIChvYmplY3QpIHt4OiB4LCB5Onl9XHJcbiAgICAgKi8gIFxyXG4gICAgYWRkKHJvY2spe1xyXG4gICAgICAgIGlmKHRoaXMucm9ja3Nbcm9jay54XSA9PSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICB0aGlzLnJvY2tzW3JvY2sueF0gPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yb2Nrc1tyb2NrLnhdW3JvY2sueV0gPSBuZXcgUm9jayhyb2NrKTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IGFsbCByb2Nrc1xyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5yb2Nrc1xyXG4gICAgICovICBcclxuICAgIGdldCgpe1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJvY2tzO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBTZWxlY3QgYSByb2NrXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHJvY2sgKG9iamVjdCkge3g6IHgsIHk6eX1cclxuICAgICAqIEByZXR1cm4gcm9jayBvYmplY3Qgc2VsZWN0ZWRcclxuICAgICAqLyAgXHJcbiAgICBzZWxlY3Qocm9jayl7XHJcbiAgICAgICAgaWYodGhpcy5yb2Nrc1tyb2NrLnhdICE9IHVuZGVmaW5lZCAmJiB0aGlzLnJvY2tzW3JvY2sueF1bcm9jay55XSAhPSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5yb2Nrc1tyb2NrLnhdW3JvY2sueV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG59XHJcblxyXG5jbGFzcyBSb2Nre1xyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB4IGFuZCB5IChudW1iZXIpXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKHJvY2spe1xyXG4gICAgICAgIHRoaXMuY2hhaW4gPSAwO1xyXG4gICAgICAgIHRoaXMueCA9IHJvY2sueDtcclxuICAgICAgICB0aGlzLnkgPSByb2NrLnk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSAwO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBBZGQgYSByb2NrXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGFkZChwbGF5ZXIpe1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBSZW1vdmUgYSByb2NrXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIHJlbW92ZShwbGF5ZXIpe1xyXG4gICAgICAgIHRoaXMucGxheWVyID0gMDtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IG5laWdoYm9yaW5nIHJvY2tzXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIHNlbGVjdCAoc3RyaW5nKVxyXG4gICAgICogQHJldHVybiBuZWlnaGJvcmluZyByb2NrcyAoYXJyYXkpXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0TmVpZ2hib3JpbmdSb2NrcyhzZWxlY3QgPSAnYWxsJyl7XHJcblxyXG4gICAgICAgIHRoaXMubmVpZ2hib3JpbmdSb2NrcyA9IFtdO1xyXG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yKGxldCBpPTEgOyBpIDw9IDQgOyBpKyspe1xyXG4gICAgICAgICAgICBsZXQgeCA9IHRoaXMueDtcclxuICAgICAgICAgICAgbGV0IHkgPSB0aGlzLnk7XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2goaSl7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE6XHJcbiAgICAgICAgICAgICAgICAgICAgeSA9IHkgLSAxOyAvLyB0b3BcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIDI6XHJcbiAgICAgICAgICAgICAgICAgICAgeCsrOyAvLyByaWdodFxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgMzpcclxuICAgICAgICAgICAgICAgICAgICB5Kys7IC8vIGJvdHRvbVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgNDpcclxuICAgICAgICAgICAgICAgICAgICB4ID0geCAtIDE7IC8vIGxlZnRcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbGV0IHJvY2sgPSByb2Nrcy5zZWxlY3Qoe3gsIHl9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKHNlbGVjdCAhPSAnZW1wdHknKXtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2sgJiYgcm9jay5nZXRQbGF5ZXIoKSAhPSAwKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2gocm9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxzZXtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2sgJiYgcm9jay5nZXRQbGF5ZXIoKSA9PSAwKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2gocm9jayk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHNlbGVjdCAhPSAnYWxsJyAmJiBzZWxlY3QgIT0gJ2VtcHR5Jyl7XHJcblxyXG4gICAgICAgICAgICBsZXQgcGxheWVyID0gc2VsZWN0O1xyXG4gICAgICAgICAgICBpZih0eXBlb2Yoc2VsZWN0KSA9PSAnc3RyaW5nJyl7XHJcbiAgICAgICAgICAgICAgICBwbGF5ZXIgPSAoKHRoaXMuZ2V0UGxheWVyKCkgKyAyKSAlIDIpICsgMTtcclxuICAgICAgICAgICAgICAgIGlmKHNlbGVjdCA9PSAnY3VycmVudCcpe1xyXG4gICAgICAgICAgICAgICAgICAgIHBsYXllciA9IHRoaXMuZ2V0UGxheWVyKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGZvcihsZXQgaSBpbiB0aGlzLmNhY2hlKXtcclxuICAgICAgICAgICAgICAgIGxldCByb2NrID0gdGhpcy5jYWNoZVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2suZ2V0UGxheWVyKCkgPT0gcGxheWVyKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MucHVzaChyb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICB0aGlzLm5laWdoYm9yaW5nUm9ja3MgPSB0aGlzLmNhY2hlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHRoaXMubmVpZ2hib3JpbmdSb2Nrcy5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgbGliZXJ0aWVzXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiBsaWJlcnRpZXNcclxuICAgICAqLyAgXHJcbiAgICBnZXRMaWJlcnRpZXMocGFyYW0gPSAnY291bnQnKXsgIFxyXG5cclxuICAgICAgICBsZXQgbmVpZ2hib3JzID0gdGhpcy5nZXROZWlnaGJvcmluZ1JvY2tzKCdlbXB0eScpO1xyXG4gICAgICAgIGlmKHBhcmFtID09ICdjb3VudCcpe1xyXG4gICAgICAgICAgICByZXR1cm4gbmVpZ2hib3JzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIG5laWdoYm9ycztcclxuXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCB0aGUgcGxheWVyIFxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5wbGF5ZXJcclxuICAgICAqLyAgXHJcbiAgICBnZXRQbGF5ZXIoKXsgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLnBsYXllcjtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogU2V0IGNoYWluIFxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSBjaGFpbiAobnVtYmVyKVxyXG4gICAgICovICBcclxuICAgIHNldENoYWluKGNoYWluKXsgIFxyXG4gICAgICAgIHRoaXMuY2hhaW4gPSBjaGFpbjsgXHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIEdldCBjaGFpbiBcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMuY2hhaW5cclxuICAgICAqLyAgXHJcbiAgICBnZXRDaGFpbigpeyAgXHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hhaW47XHJcbiAgICB9XHJcblxyXG5cclxufVxyXG5cclxudmFyIHJvY2tzID0gbmV3IFJvY2tzKCk7XHJcblxuLyoqXG4gKiBNaW5pb25zIGluIGRh4oCZIGdhbWUsIGJyb3RoYSDwn5iOXG4gKiBSYXBoYcOrbGxlIExpbW9nZXMsIEFsZXhhbmRyYSBDb3NzaWQsIENoYXJsZXMgTWFuZ3dhLCBUSMOpbyBLbnV0eiBldCBMw6lvIExlIEJyYXNcbiAqIEhFVElDIFAyMDE5XG4gKlxuICogV29yayB3aXRoIEVTNisgKHdpdGggYmFiZWwgdHJhbnNwaWxlbGVyKVxuICpcbiAqIENvcHlyaWdodCAyMDE1XG4gKiBSZWxlYXNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2VcbiAqIGh0dHA6Ly9vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqXG4gKiBEYXRlIG9mIGNyZWF0aW9uIDogMjAxNS0wNS0xOVxuICovXG5cbnZhciBvcHRpb25zID0ge1xuICAgIGdvYmFuOiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2JhbidcbiAgICB9LFxuICAgIGdhbWVwbGF5OiB7XG4gICAgICAgIGVsZW1lbnQ6ICcuR2FtZV9nb2Jhbl9nYW1lcGxheSdcbiAgICB9LFxuICAgIGdyaWQ6IHtcbiAgICAgICAgbmJyZTogJzE5JyxcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuX2dyaWQnLFxuICAgICAgICBjZWxsU2l6ZTogNDAsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogJ3doaXRlJyxcbiAgICAgICAgYm9yZGVyQ29sb3I6ICdibGFjaycsXG4gICAgICAgIGJvcmRlcldpZHRoOiAyXG4gICAgfSxcbiAgICByb2NrOntcbiAgICAgICAgc2l6ZTogMjAsXG4gICAgICAgIHBsYXllcjE6ICdncmV5JyxcbiAgICAgICAgcGxheWVyMjogJ2JsYWNrJ1xuICAgIH0sXG4gICAgY29udHJvbDp7XG4gICAgICAgIG5leHQ6ICcuR2FtZV9jb250cm9sX25leHQnXG4gICAgfVxufTtcblxuR29HYW1lKCk7XG4iXX0=
