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
                height: this.gridSize
            });
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
                console.log('****');
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
                    type: 'next'
                });
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

var ScoreActions = (function () {
    function ScoreActions() {
        _classCallCheck(this, ScoreActions);
    }

    _createClass(ScoreActions, [{
        key: 'get',
        value: function get() {
            console.log('****');
            console.log('****');
            console.log('SCORE :');
        }
    }]);

    return ScoreActions;
})();

var $GOBAN = '';

var GameplayDispatcher = (function () {
    function GameplayDispatcher() {
        _classCallCheck(this, GameplayDispatcher);

        this.$goban = Sprint(options['gameplay'].element);
        this.$next = Sprint(options['control'].next);
        this.$stop = Sprint(options['control'].stop);
        this.Gameplay = new GameplayActions();
        this.Save = new SaveActions();
        this.Score = new ScoreActions();
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
                    _this.Score.get();
                }
            });

            Sprint(this.$stop).on('click', function () {
                _this.Gameplay.gameOver();
                _this.Score.get();
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
        key: 'select',

        /**
         * Select a chain
         *
         * @param chain (chain)
         * @return chain object selected (array)
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
        key: 'count',

        /**
         * Count chains
         *
         * @return this.chains.length
         */
        value: function count() {
            return this.chains.length;
        }
    }, {
        key: 'add',

        /**
         * Add a chain
         *
         * @param chain (number)
         */
        value: function add(chain) {
            this.chains[chain] = new Chain(chain);
        }
    }, {
        key: 'join',

        /**
         * Join 2 chains
         *
         * @param joinChain (number)
         * @param chain (number)
         */
        value: function join(joinChain, chain) {
            var _chains$joinChain$rocks;

            (_chains$joinChain$rocks = this.chains[joinChain].rocks).push.apply(_chains$joinChain$rocks, _toConsumableArray(this.chains[chain].rocks));
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

        this.name = name;
        this.state = 'alive';
        this.rocks = [];
        this.border = [];
        this.territory = [];
        this.cache = [];
    }

    _createClass(Chain, [{
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
         * @return this.rocks
         */
        value: function getRocks() {
            return this.rocks.sort();
        }
    }, {
        key: 'getBorders',

        /**
         * Return the border of the chain
         *
         * @param param (string, default : 'objects')
         * @return this.border (array or number)
         */
        value: function getBorders() {
            var _this2 = this;

            var param = arguments[0] === undefined ? 'objects' : arguments[0];

            // Select the rocks not completely surrounded by the current
            // player (player who created this chain).
            this.border = (function () {
                var _border = [];
                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                    for (var _iterator11 = _this2.rocks[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var rock = _step11.value;

                        if (rocks.select({ x: rock.x, y: rock.y }).getNeighboringRocks(rocks, 'current').length != 4) {
                            _border.push(rock);
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

                return _border;
            })();

            if (param == 'count') {
                return this.border.length;
            }
            return this.border.sort();
        }
    }, {
        key: 'getLiberties',

        /**
         * Get liberties of the chain
         *
         * @param param (string, default : 'count')     
         * @return this.liberties (number)
         */
        value: function getLiberties() {
            var param = arguments[0] === undefined ? 'count' : arguments[0];

            // Add the liberties of each rock of the border of this chain
            // to get liberties of this chain (with removing doublons).
            this.liberties = [];
            var cache = undefined;this.cache = []; // Use to detect doublons
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

    /**
     * Constructor
     *
     */

    function Players() {
        _classCallCheck(this, Players);

        this.current = 1;
        this.players = [];
        this.players[1] = new Player(1);
        this.players[2] = new Player(2);
    }

    _createClass(Players, [{
        key: 'getCurrent',

        /**
         * Get the current player
         *
         * @return current player (object)
         */
        value: function getCurrent() {
            return this.players[this.current];
        }
    }, {
        key: 'getAdversary',

        /**
         * Get the adversary of the current player
         *
         * @return adversary player (object)
         */
        value: function getAdversary() {
            return this.players[(this.current + 2) % 2 + 1];
        }
    }, {
        key: 'switch',

        /**
         * Switch player
         *
         */
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
        this.historic[0], this.historic[1] = {
            type: ''
        };
    }

    _createClass(Player, [{
        key: 'getName',

        /**
         * Get player
         *
         * @return name (number)
         */
        value: function getName() {
            return this.name;
        }
    }, {
        key: 'updateHistoric',

        /**
         * Update historic
         *
         * @param action (object)
         */
        value: function updateHistoric(action) {
            this.historic[0] = this.historic[1];
            this.historic[1] = action;
        }
    }, {
        key: 'getHistoric',

        /**
         * Get historic
         *
         */
        value: function getHistoric() {
            var index = arguments[0] === undefined ? 'all' : arguments[0];

            var response = this.historic;
            if (index == 'last') {
                response = this.historic[1];
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
        key: 'select',

        /**
         * Select a rock
         *
         * @param rock (object) {x: x, y:y}
         * @return rock object selected ()
         */
        value: function select(rock) {
            if (this.rocks[rock.x] != undefined && this.rocks[rock.x][rock.y] != undefined) {
                return this.rocks[rock.x][rock.y];
            }
            return false; // If the rock doesn't exist
        }
    }, {
        key: 'get',

        /**
         * Get all rocks
         *
         * @return rocks (array)
         */
        value: function get() {
            return this.rocks;
        }
    }, {
        key: 'add',

        /**
         * Add a rock
         *
         * @param rock (object, format : {x: x, y:y})
         */
        value: function add(rock) {
            if (this.rocks[rock.x] == undefined) {
                this.rocks[rock.x] = [];
            }
            this.rocks[rock.x][rock.y] = new Rock(rock);
        }
    }]);

    return Rocks;
})();

var Rock = (function () {

    /**
     * Constructor
     *
     * @param rock (object, format : {x: .., y: ..})
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
         * @param player (number)
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
        value: function remove() {
            this.player = 0;
        }
    }, {
        key: 'getPlayer',

        /**
         * Get the player 
         *
         * @return player (number)
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
         * @return chain (number)
         */
        value: function getChain() {
            return this.chain;
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
            var _this3 = this;

            var select = arguments[0] === undefined ? 'all' : arguments[0];

            this.neighboringRocks = [];
            this.cache = [];

            // Select neighboring intersections, empty or nor
            // (depends of the param select)
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

                if (select != 'empty' && rock && rock.getPlayer() != 0 || select == 'empty' && rock && rock.getPlayer() == 0) {
                    this.cache.push(rock);
                }
            }

            // Select rock of a particulary user
            // (depends of the param select)      
            if (select != 'all' && select != 'empty') {
                (function () {
                    var player = select;
                    if (typeof select == 'string') {
                        player = (_this3.getPlayer() + 2) % 2 + 1;
                        if (select == 'current') {
                            player = _this3.getPlayer();
                        }
                    }
                    _this3.neighboringRocks = (function () {
                        var _neighboringRocks = [];
                        var _iteratorNormalCompletion14 = true;
                        var _didIteratorError14 = false;
                        var _iteratorError14 = undefined;

                        try {
                            for (var _iterator14 = _this3.cache[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                                var rock = _step14.value;

                                if (rock.getPlayer() == player) {
                                    _neighboringRocks.push(rock);
                                }
                            }
                        } catch (err) {
                            _didIteratorError14 = true;
                            _iteratorError14 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion14 && _iterator14['return']) {
                                    _iterator14['return']();
                                }
                            } finally {
                                if (_didIteratorError14) {
                                    throw _iteratorError14;
                                }
                            }
                        }

                        return _neighboringRocks;
                    })();
                })();
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
        nbre: 13,
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
        next: '.Game_control_next',
        stop: '.Game_controle_stop'
    }
};

GoGame(options);