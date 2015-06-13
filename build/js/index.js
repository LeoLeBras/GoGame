(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _get = function get(_x3, _x4, _x5) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x3,
    property = _x4,
    receiver = _x5; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x3 = parent; _x4 = property; _x5 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

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

var Chains = (function () {

    /**
     * Constructor
     *
     * @param name of the current player
     */

    function Chains() {
        var current = arguments[0] === undefined ? 1 : arguments[0];

        _classCallCheck(this, Chains);

        this.name = current;
    }

    _createClass(Chains, [{
        key: 'next',

        /**
         * Next player
         *
         */
        value: function next() {
            this.name = this.player++ % 2 + 1;
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

    return Chains;
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
         * Handle the chains
         *
         */
        value: function handleChains() {

            console.log(this.chains);

            var neighboringIntersections = this.rock.getNeighboringIntersections(this.tab, 'current');
            var currentRock = {
                x: this.rock.x,
                y: this.rock.y
            };

            if (neighboringIntersections != 0) {

                // Get chains of the current player around the current rock           
                var chains = [];
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = neighboringIntersections[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var rock = _step.value;

                        if (chains.indexOf(rock.getChain()) == -1) {
                            chains.push(rock.getChain());
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

                this.getRock();

                // Add the rock to the chain
                if (chains.length == 1) {
                    var chain = chains[0];
                    this.rock.setChain(chain);
                    this.chains[chain].push(currentRock);
                }

                // Join chains
                else {
                    chains = chains.sort();
                    var joinChain = chains[0];
                    this.chains[joinChain].push(currentRock);
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                        for (var _iterator2 = chains.reverse()[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                            var chain = _step2.value;

                            if (chain != joinChain) {
                                var _iteratorNormalCompletion3 = true;
                                var _didIteratorError3 = false;
                                var _iteratorError3 = undefined;

                                try {
                                    for (var _iterator3 = this.chains[chain][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                        var rock = _step3.value;

                                        this.tab[rock.x][rock.y].setChain(joinChain);
                                        this.chains[joinChain].push(rock);
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

                                this.chains.splice(chain, 1);
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
                }
            }

            // Create new chain
            else {
                var chain = this.chains.length;
                this.rock.setChain(chain);
                this.chains[chain] = [];
                this.chains[chain].push(currentRock);
            }

            this.setRock();
            console.log(this.chains);
        }
    }, {
        key: 'handleGoban',

        /**
         * Handle the goban with the new territories
         *
         */
        value: function handleGoban() {}

        /*
        
                // Chek if there are ennemies around the last rock placed
                if(
                    this.tab[this.x][this.y - 1] == this.enemy ||
                    this.tab[this.x + 1][this.y] == this.enemy ||
                    this.tab[this.x][this.y + 1] == this.enemy ||
                    this.tab[this.x - 1][this.y] == this.enemy)
                {
        
                    // Return the territory of the neighbors 
                    if(this.tab[this.x][this.y - 1] == this.enemy){
                        this.territory['top'] = new Territory(this.tab, this.enemy, this.x, this.y - 1);
                    }
                    if(this.tab[this.x + 1][this.y] == this.enemy){
                        this.territory['right'] = new Territory(this.tab, this.enemy, this.x + 1, this.y);
                    }
                    if(this.tab[this.x][this.y + 1] == this.enemy){
                        this.territory['bottom'] = new Territory(this.tab, this.enemy, this.x, this.y + 1);
                    }
                    if(this.tab[this.x - 1][this.y] == this.enemy){
                        this.territory['left'] = new Territory(this.tab, this.enemy, this.x - 1, this.y);
                    } 
        
                    // Tiny territories (delete boublon)
                    this.cache = [];
                    this.territories = [];
                    for(let i in this.territory){
                        let territory = this.territory[i];
                        if(this.cache.indexOf(JSON.stringify(territory.get())) == -1){
                            this.territories.push(territory);
                            this.cache.push(JSON.stringify(territory.get()));
                        }
                    }
        
                    // Verification of encirclement territories
                    for(let territory of this.territories){
                        // The territory is circled
                        if(territory.isDead()){
        
                            // Deubg
                            console.log('**');
                            console.log(`Enemy territory circled by player ${this.player} !`);
                            console.log(territory.get());
        
                        }
                    }
                }
            }*/

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
                    player = (tab[this.x][this.y].getPlayer() + 1) % 2 + 1;
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

var Territory = (function () {

    /**
     * Init options
     *
     * @param tab (array)
     * @param ennemy (number)
     * @param x and y coordinate (numbers)
     */

    function Territory(tab, enemy, x, y) {
        _classCallCheck(this, Territory);

        this.tab = tab;

        this.enemy = enemy;

        this.coordinate;
        this.x = x;
        this.y = y;

        this.liberties = 0;
        this.territory = [];
        this.borderTerritory = [];

        this.start = '' + this.x + ';' + this.y;
        this.indexGoBack;
        this.newRock = true;
        this.cache = [];
        this.around = [];

        this.run();
    }

    _createClass(Territory, [{
        key: 'run',

        /**
         * Find the territory by recursion
         *
         */
        value: function run() {

            // Init around rocks
            this.around = [];

            // Save
            if (this.newRock == true) {
                this.cache['`${this.x};${this.y}`'] = 'check';
                this.indexGoBack = this.territory.length;
                this.territory.push('' + this.x + ';' + this.y);
            }

            // We check rocks around
            for (var i = 1; i <= 4; i++) {
                switch (i) {
                    case 1:
                        this.coordinate = '' + this.x + ';' + (this.y - 1);
                        break;

                    case 2:
                        this.coordinate = '' + (this.x + 1) + ';' + this.y;
                        break;

                    case 3:
                        this.coordinate = '' + this.x + ';' + (this.y + 1);
                        break;

                    case 4:
                        this.coordinate = '' + (this.x - 1) + ';' + this.y;
                        break;
                }

                if (this.tab[this.coordinate] == this.enemy && this.cache[this.coordinate] != 'check') {
                    this.around.push(this.coordinate);
                }
            }

            // If no enemies
            if (this.around.length == 0) {

                // If we can go back to find more new rocks
                if (!(this.start == '' + this.x + ';' + this.y)) {

                    // Said we go back
                    this.newRock = false;
                    this.indexGoBack = this.indexGoBack - 1;

                    // Set new coordinates for the next jump

                    this.territoy[this.indexGoBack]; // 1;1

                    var index = this.territory[this.indexGoBack].lastIndexOf(';');
                    this.x = parseInt(this.territory[this.indexGoBack].substr(0, index));
                    this.y = parseInt(this.territory[this.indexGoBack].substring(index + 1));

                    // Jump by recursion to an another rock
                    this.run();
                }
            } else {

                // Check one enemy
                this.random = Math.floor(Math.random() * this.around.length);

                // Set new coordinates for the next jump
                var index = this.around[this.random].lastIndexOf(';');
                this.x = parseInt(this.around[this.random].substr(0, index));
                this.y = parseInt(this.around[this.random].substring(index + 1));

                // Jump by recursion to an another rock
                this.newRock = true;
                this.run();
            }
        }
    }, {
        key: 'get',

        /**
         * Return all the territory
         *
         * @return array
         */
        value: function get() {
            return this.territory.sort();
        }
    }, {
        key: 'getBorders',

        /**
         * Return borders of the territory
         *
         * @return array
         */
        value: function getBorders() {

            if (this.borderTerritory.length == 0) {
                var _iteratorNormalCompletion4 = true;
                var _didIteratorError4 = false;
                var _iteratorError4 = undefined;

                try {
                    for (var _iterator4 = this.territory[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                        var item = _step4.value;

                        // Set coordinates of the current rock
                        var index = item.lastIndexOf(';');
                        this.x = parseInt(item.substr(0, index));
                        this.y = parseInt(item.substring(index + 1));

                        // Check if the rock is not totally around to know if it's on the border
                        if (!(this.tab['' + this.x + ';' + (this.y - 1)] == this.enemy && this.tab['' + (this.x + 1) + ';' + this.y] == this.enemy && this.tab['' + this.x + ';' + (this.y + 1)] == this.enemy && this.tab['' + (this.x - 1) + ';' + this.y] == this.enemy)) {
                            this.borderTerritory.push(item);
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
            }

            return this.borderTerritory.sort();
        }
    }, {
        key: 'isDead',

        /**
         * Check if the territory is dead
         *
         * @return true or false
         */
        value: function isDead() {

            // Get borders of the territory
            if (this.borderTerritory.length == 0) {
                this.getBorders();
            }

            // Get liberties of the territory
            if (this.liberties == 0) {
                this.getLiberties();
            }

            if (this.liberties == this.borderTerritory.length) {
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
            if (this.borderTerritory.length == 0) {
                this.getBorders();
            }

            this.liberties = 0;

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = this.borderTerritory[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var rock = _step5.value;

                    var index = rock.lastIndexOf(';');
                    var x = parseInt(rock.substr(0, index));
                    var y = parseInt(rock.substring(index + 1));

                    // Check if the rock has any liberties
                    if (this.tab['' + x + ';' + (y - 1)] != 0 && this.tab['' + (x + 1) + ';' + y] != 0 && this.tab['' + x + ';' + (y + 1)] != 0 && this.tab['' + (x - 1) + ';' + y] != 0) {
                        this.liberties++;
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

            return this.liberties;
        }
    }]);

    return Territory;
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

var GoGame = new Game(options);
GoGame.run();

/*
        if(this.rock.touchEnnemyNeighbors()){

            let chains = [];

            // Tiny chains (delete boublon)
            for(let rock of this.rock.getEnemyNeighbors()){
                if(this.cache.indexOf(this.rock) == -1){
                    chains.push(this.rock.getChain());
                }
                else{
                    this.cache.push(this.rock.getChain());
                }
            }   

            console.log(chains);
        }*/

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkQ6XFxEcm9wYm94XFxTaXRlc1xcd3d3XFxHb0dhbWVcXG5vZGVfbW9kdWxlc1xcZ3VscC1icm93c2VyaWZ5XFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsIkQ6L0Ryb3Bib3gvU2l0ZXMvd3d3L0dvR2FtZS9zcmMvanMvYXBwL2Zha2VfZGY5MzA4YzYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7SUNBTSxPQUFPOzs7Ozs7O0FBTUUsYUFOVCxPQUFPLEdBTUk7OEJBTlgsT0FBTzs7QUFPTCxZQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUM7QUFDakMsWUFBSSxDQUFDLGVBQWUsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsV0FBVyxDQUFDOztBQUVuRCxZQUFJLENBQUMsUUFBUSxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLENBQUM7QUFDekMsWUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLEdBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQzs7QUFFMUQsWUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDO0FBQy9DLFlBQUksQ0FBQyxlQUFlLEdBQUcsTUFBTSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUMzRCxZQUFJLENBQUMsV0FBVyxHQUFHLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUM7O0FBRW5ELFlBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLElB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QUMsR0FBRyxDQUFDLENBQUEsQ0FBRyxJQUFJLENBQUMsSUFDOUIsSUFBSSxDQUFDLEdBQUcsT0FBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLFNBQUksQ0FBQyxDQUFHLElBQUksQ0FBQyxJQUM5QixJQUFJLENBQUMsR0FBRyxNQUFJLENBQUMsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBLENBQUcsSUFBSSxDQUFDLElBQzlCLElBQUksQ0FBQyxHQUFHLE9BQUksQ0FBQyxHQUFHLENBQUMsQ0FBQSxTQUFJLENBQUMsQ0FBRyxJQUFJLENBQUMsRUFDakM7QUFDSSw0QkFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO3FCQUNwQjtpQkFDSjs7Ozs7Ozs7Ozs7Ozs7OztBQUVELG1CQUFPLElBQUksQ0FBQyxTQUFTLENBQUM7U0FFekI7OztXQXZPQyxTQUFTOzs7Ozs7Ozs7Ozs7Ozs7OztBQXVQZixJQUFJLE9BQU8sR0FBRztBQUNWLFNBQUssRUFBRTtBQUNILGVBQU8sRUFBRSxhQUFhO0tBQ3pCO0FBQ0QsWUFBUSxFQUFFO0FBQ04sZUFBTyxFQUFFLHNCQUFzQjtLQUNsQztBQUNELFFBQUksRUFBRTtBQUNGLFlBQUksRUFBRSxJQUFJO0FBQ1YsZUFBTyxFQUFFLGtCQUFrQjtBQUMzQixnQkFBUSxFQUFFLEVBQUU7QUFDWix1QkFBZSxFQUFFLE9BQU87QUFDeEIsbUJBQVcsRUFBRSxPQUFPO0FBQ3BCLG1CQUFXLEVBQUUsQ0FBQztLQUNqQjtBQUNELFFBQUksRUFBQztBQUNELFlBQUksRUFBRSxFQUFFO0FBQ1IsZUFBTyxFQUFFLE1BQU07QUFDZixlQUFPLEVBQUUsT0FBTztLQUNuQjtDQUNKLENBQUM7O0FBRUYsSUFBSSxNQUFNLEdBQUcsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDL0IsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNsYXNzIEJ1aWxkZXJ7XG5cbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqXG4gICAgICovICAgICBcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgICAgICB0aGlzLmdyaWQgPSBvcHRpb25zWydncmlkJ10ubmJyZTtcbiAgICAgICAgdGhpcy5ncmlkYm9yZGVyV2lkdGggPSBvcHRpb25zWydncmlkJ10uYm9yZGVyV2lkdGg7XG5cbiAgICAgICAgdGhpcy5jZWxsU2l6ZSA9IG9wdGlvbnNbJ2dyaWQnXS5jZWxsU2l6ZTtcbiAgICAgICAgdGhpcy5ncmlkU2l6ZSA9IChwYXJzZUludCh0aGlzLmdyaWQpICsgMSkgKiB0aGlzLmNlbGxTaXplO1xuXG4gICAgICAgIHRoaXMuJGdvYmFuID0gU3ByaW50KG9wdGlvbnNbJ2dvYmFuJ10uZWxlbWVudCk7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5ID0gU3ByaW50KG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudCk7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQgPSBTcHJpbnQob3B0aW9uc1snZ3JpZCddLmVsZW1lbnQpO1xuXG4gICAgICAgIHRoaXMuZ3JpZENhbnZhcyA9IHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIHRoaXMuZ2FtZXBsYXlDYW52YXMgPSB0aGlzLiRnb2Jhbl9nYW1lcGxheS5kb21bMF0uZ2V0Q29udGV4dCgnMmQnKTtcbiAgICB9XG5cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB0aGUgZ29iYW5cbiAgICAgKlxuICAgICAqIEByZXR1cm4gY3NzIHN0eWxlIG9mIHRoZSBnb2JhblxuICAgICAqLyAgXG4gICAgYnVpbGRHb2Jhbigpe1xuICAgICAgICB0aGlzLiRnb2Jhbi5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIEJ1aWxkIHRoZSBnYW1lcGxheSBjYW52YXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4gY2FudmFzXG4gICAgICovICBcbiAgICBidWlsZEdhbWVwbGF5KCl7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dhbWVwbGF5LmRvbVswXS5oZWlnaHQgPSB0aGlzLmdyaWRTaXplO1xuICAgICAgICB0aGlzLiRnb2Jhbl9nYW1lcGxheS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6IHRoaXMuZ3JpZFNpemUsXG4gICAgICAgICAgICBoZWlnaHQ6IHRoaXMuZ3JpZFNpemVcbiAgICAgICAgfSlcbiAgICB9XG5cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBCdWlsZCB0aGUgZ3JpZFxuICAgICAqXG4gICAgICogQHJldHVybiBjYW52YXMgd2l0aCBhIGdyaWQgZHJhd25cbiAgICAgKi8gIFxuICAgIGJ1aWxkR3JpZCgpe1xuXG4gICAgICAgIC8vIFNldCBzaXplIG9mIGNhbnZhc1xuICAgICAgICB0aGlzLiRnb2Jhbl9ncmlkLmRvbVswXS53aWR0aCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuZG9tWzBdLmhlaWdodCA9IHRoaXMuZ3JpZFNpemU7XG4gICAgICAgIHRoaXMuJGdvYmFuX2dyaWQuY3NzKHtcbiAgICAgICAgICAgIHdpZHRoOiB0aGlzLmdyaWRTaXplLFxuICAgICAgICAgICAgaGVpZ2h0OiB0aGlzLmdyaWRTaXplXG4gICAgICAgIH0pXG5cbiAgICAgICAgLy8gSW5pdCB0aGUgY2FudmFzXG4gICAgICAgIHZhciBjID0gdGhpcy5ncmlkQ2FudmFzO1xuXG4gICAgICAgIC8vIERyYXcgZWFjaCBsaW5lcyBvZiB0aGUgZ3JpZFxuICAgICAgICBmb3IodmFyIHggPSAxOyB4IDw9IHRoaXMuZ3JpZCA7IHgrKyl7XG4gICAgICAgICAgICBjLmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgYy5tb3ZlVG8odGhpcy5jZWxsU2l6ZSwgdGhpcy5jZWxsU2l6ZSAqIHgpO1xuICAgICAgICAgICAgYy5saW5lVG8odGhpcy5ncmlkU2l6ZSAtIHRoaXMuY2VsbFNpemUsIHRoaXMuY2VsbFNpemUgKiB4KTtcbiAgICAgICAgICAgIGMubGluZVdpZHRoID0gdGhpcy5ncmlkYm9yZGVyV2lkdGg7XG4gICAgICAgICAgICBjLnN0cm9rZSgpO1xuICAgICAgICB9XG4gICAgICAgIGZvcih2YXIgeSA9IDE7IHkgPD0gdGhpcy5ncmlkIDsgeSsrKXtcbiAgICAgICAgICAgIGMuYmVnaW5QYXRoKCk7XG4gICAgICAgICAgICBjLm1vdmVUbyh0aGlzLmNlbGxTaXplICogeSwgdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgICAgICBjLmxpbmVUbyh0aGlzLmNlbGxTaXplICogeSwgdGhpcy5ncmlkU2l6ZSAtIHRoaXMuY2VsbFNpemUpO1xuICAgICAgICAgICAgYy5saW5lV2lkdGggPSB0aGlzLmdyaWRib3JkZXJXaWR0aDtcbiAgICAgICAgICAgIGMuc3Ryb2tlKCk7XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogQnVpbGQgYWxsIGVsZW1lbnRzXG4gICAgICpcbiAgICAgKi8gIFxuICAgIHJ1bigpe1xuICAgICAgICB0aGlzLmJ1aWxkR29iYW4oKTtcbiAgICAgICAgdGhpcy5idWlsZEdhbWVwbGF5KCk7XG4gICAgICAgIHRoaXMuYnVpbGRHcmlkKCk7XG4gICAgfVxuXG59XG5jbGFzcyBDaGFpbnN7XHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ29uc3RydWN0b3JcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gbmFtZSBvZiB0aGUgY3VycmVudCBwbGF5ZXJcclxuICAgICAqLyAgIFxyXG4gICAgY29uc3RydWN0b3IoY3VycmVudCA9IDEpe1xyXG4gICAgICAgIHRoaXMubmFtZSA9IGN1cnJlbnQ7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBOZXh0IHBsYXllclxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBuZXh0KCl7XHJcbiAgICBcdHRoaXMubmFtZSA9ICgodGhpcy5wbGF5ZXIrKykgJSAyKSArIDE7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgcGxheWVyXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLm5hbWVcclxuICAgICAqLyAgXHJcbiAgICBnZXQoKXtcclxuICAgIFx0cmV0dXJuIHRoaXMubmFtZTtcclxuICAgIH1cclxuXHJcbiAgICAgICAgXHJcbn1cbmNsYXNzIEdhbWVwbGF5e1xuXG4gICAgLyoqXG4gICAgICogQ29uc3RydWN0b3JcbiAgICAgKlxuICAgICAqIEBwYXJhbSBhcnJheSBvcHRpb25zXG4gICAgICovICAgXG4gICAgY29uc3RydWN0b3IoKXtcblxuICAgICAgICB0aGlzLiRnb2JhbiA9IFNwcmludChvcHRpb25zWydnYW1lcGxheSddLmVsZW1lbnQpO1xuICAgICAgICB0aGlzLmNhbnZhcyA9IHRoaXMuJGdvYmFuLmRvbVswXS5nZXRDb250ZXh0KCcyZCcpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5ncmlkID0gb3B0aW9uc1snZ3JpZCddLm5icmU7XG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XG5cbiAgICAgICAgdGhpcy5yb2NrO1xuICAgICAgICB0aGlzLnJvY2tTaXplID0gb3B0aW9uc1sncm9jayddLnNpemU7XG4gICAgICAgIHRoaXMucm9ja1BsYXllcjEgPSBvcHRpb25zWydyb2NrJ10ucGxheWVyMTtcbiAgICAgICAgdGhpcy5yb2NrUGxheWVyMiA9IG9wdGlvbnNbJ3JvY2snXS5wbGF5ZXIyO1xuXG4gICAgICAgIHRoaXMucGxheWVyID0gbmV3IFBsYXllcignY3VycmVudCcpO1xuICAgICAgICB0aGlzLmVubmVteSA9IG5ldyBQbGF5ZXIoJ2VubmVteScpO1xuXG4gICAgICAgIHRoaXMudGFiID0gW107XG4gICAgICAgIHRoaXMuY2hhaW5zID0gW107XG4gICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcblxuICAgICAgICBmb3IodGhpcy54PSAxOyB0aGlzLnggPD0gdGhpcy5ncmlkIDsgdGhpcy54Kyspe1xuICAgICAgICAgICAgdGhpcy50YWJbdGhpcy54XSA9IFtdO1xuICAgICAgICAgICAgZm9yKHRoaXMueSA9IDE7IHRoaXMueSA8PSB0aGlzLmdyaWQgOyB0aGlzLnkrKyl7XG4gICAgICAgICAgICAgICAgdGhpcy50YWJbdGhpcy54XVt0aGlzLnldID0gbmV3IFJvY2sodGhpcy54LCB0aGlzLnkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH1cblxuXG5cblxuICAgIFxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBMaXN0ZW4gZXZlbnQgb24gdGhlIGdhbWVwbGF5IChkaXNwYXRjaGVyKVxuICAgICAqXG4gICAgICovICBcbiAgICBsaXN0ZW5uZXIoKXtcblxuICAgICAgICAvLyBDbGljayBvbiB0aGUgZ29iYW5cbiAgICAgICAgU3ByaW50KHRoaXMuJGdvYmFuKS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHRoaXMuY2xpY2soZSk7XG4gICAgICAgIH0uYmluZCh0aGlzKSk7XG5cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogVGhlIHBsYXllciBjbGljayBvbiB0aGUgZ29iYW4gdG8gcHV0IGEgcm9ja1xuICAgICAqXG4gICAgICovICBcbiAgICBjbGljayhlKXtcblxuICAgICAgICAvLyBTZXQgY3VycmVudCByb2NrXG4gICAgICAgIHRoaXMueCA9IE1hdGguZmxvb3IoKGUubGF5ZXJYICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG4gICAgICAgIHRoaXMueSA9IE1hdGguZmxvb3IoKGUubGF5ZXJZICsgdGhpcy5jZWxsU2l6ZSAvIDIpIC8gdGhpcy5jZWxsU2l6ZSk7XG5cbiAgICAgICAgLy8gSWYgd2UgYXJlIG9uIHRoZSBnb2JhblxuICAgICAgICBpZigxIDw9IHRoaXMueCAmJiB0aGlzLnggPD0gdGhpcy5ncmlkICYmIDEgPD0gdGhpcy55ICYmIHRoaXMueSA8PSB0aGlzLmdyaWQgKXtcbiAgICAgICAgICAgIHRoaXMuZ2V0Um9jaygpO1xuXG4gICAgICAgICAgICAvLyBJZiB0aGUgcm9jayBjYW4gYmUgcGxhY2VkIGhlcmUsIGhhbmRsZSBhY3Rpb25zXG4gICAgICAgICAgICBpZih0aGlzLnJvY2suY2FuUGxheSh0aGlzLnBsYXllciwgdGhpcy50YWIpKXtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBEZWJ1Z1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcqKioqJyk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFBsYXllciAke3RoaXMucGxheWVyLmdldCgpfSBlbiAke3RoaXMueH07JHt0aGlzLnl9YCk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLnJvY2suY3JlYXRlKHRoaXMucGxheWVyKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFJvY2soKTtcbiAgICAgICAgICAgICAgICB0aGlzLmhhbmRsZUNoYWlucygpO1xuICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlR29iYW4oKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBsYXllci5uZXh0KCk7XG4gICAgICAgICAgICAgICAgdGhpcy5lbm5lbXkubmV4dCgpO1xuXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cblxuXG5cbiAgICBcbiAgICAvKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tICovXG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogU2F2ZSB0aGlzLnJvY2sgaW4gdGhpcy50YWJcbiAgICAgKlxuICAgICAqLyAgXG4gICAgc2V0Um9jaygpe1xuICAgICAgICB0aGlzLnRhYlt0aGlzLnhdW3RoaXMueV0gPSB0aGlzLnJvY2s7XG4gICAgfVxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBVc2UgdGhpcy5yb2NrIGluc3RlYWQgb2YgdGhpcy50YWJbdGhpcy54XVt0aGlzLnldXG4gICAgICpcbiAgICAgKi8gIFxuICAgIGdldFJvY2soKXtcbiAgICAgICAgdGhpcy5yb2NrID0gdGhpcy50YWJbdGhpcy54XVt0aGlzLnldO1xuICAgIH1cblxuXG5cblxuICAgIFxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGNoYWluc1xuICAgICAqXG4gICAgICovICBcbiAgICBoYW5kbGVDaGFpbnMoKXtcblxuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNoYWlucyk7XG5cbiAgICAgICAgdmFyIG5laWdoYm9yaW5nSW50ZXJzZWN0aW9ucyA9IHRoaXMucm9jay5nZXROZWlnaGJvcmluZ0ludGVyc2VjdGlvbnModGhpcy50YWIsICdjdXJyZW50Jyk7XG4gICAgICAgIHZhciBjdXJyZW50Um9jayA9IHtcbiAgICAgICAgICAgIHg6IHRoaXMucm9jay54LFxuICAgICAgICAgICAgeTogdGhpcy5yb2NrLnlcbiAgICAgICAgfTtcblxuICAgICAgICBpZihuZWlnaGJvcmluZ0ludGVyc2VjdGlvbnMgIT0gMCl7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIEdldCBjaGFpbnMgb2YgdGhlIGN1cnJlbnQgcGxheWVyIGFyb3VuZCB0aGUgY3VycmVudCByb2NrICAgICAgICAgICAgXG4gICAgICAgICAgICBsZXQgY2hhaW5zID0gW107XG4gICAgICAgICAgICBmb3IobGV0IHJvY2sgb2YgbmVpZ2hib3JpbmdJbnRlcnNlY3Rpb25zKXtcbiAgICAgICAgICAgICAgICBpZihjaGFpbnMuaW5kZXhPZihyb2NrLmdldENoYWluKCkpID09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgY2hhaW5zLnB1c2gocm9jay5nZXRDaGFpbigpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2V0Um9jaygpO1xuXG4gICAgICAgICAgICAvLyBBZGQgdGhlIHJvY2sgdG8gdGhlIGNoYWluXG4gICAgICAgICAgICBpZihjaGFpbnMubGVuZ3RoID09IDEpe1xuICAgICAgICAgICAgICAgIGxldCBjaGFpbiA9IGNoYWluc1swXVxuICAgICAgICAgICAgICAgIHRoaXMucm9jay5zZXRDaGFpbihjaGFpbik7XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFpbnNbY2hhaW5dLnB1c2goY3VycmVudFJvY2spO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBKb2luIGNoYWluc1xuICAgICAgICAgICAgZWxzZXtcbiAgICAgICAgICAgICAgICBjaGFpbnMgPSBjaGFpbnMuc29ydCgpO1xuICAgICAgICAgICAgICAgIGxldCBqb2luQ2hhaW4gPSBjaGFpbnNbMF07XG4gICAgICAgICAgICAgICAgdGhpcy5jaGFpbnNbam9pbkNoYWluXS5wdXNoKGN1cnJlbnRSb2NrKTtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGNoYWluIG9mIGNoYWlucy5yZXZlcnNlKCkpe1xuICAgICAgICAgICAgICAgICAgICBpZihjaGFpbiAhPSBqb2luQ2hhaW4pe1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yKGxldCByb2NrIG9mIHRoaXMuY2hhaW5zW2NoYWluXSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJbcm9jay54XVtyb2NrLnldLnNldENoYWluKGpvaW5DaGFpbik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFpbnNbam9pbkNoYWluXS5wdXNoKHJvY2spO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGFpbnMuc3BsaWNlKGNoYWluLCAxKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIENyZWF0ZSBuZXcgY2hhaW5cbiAgICAgICAgZWxzZXtcbiAgICAgICAgICAgIGxldCBjaGFpbiA9IHRoaXMuY2hhaW5zLmxlbmd0aDtcbiAgICAgICAgICAgIHRoaXMucm9jay5zZXRDaGFpbihjaGFpbik7XG4gICAgICAgICAgICB0aGlzLmNoYWluc1tjaGFpbl0gPSBbXTtcbiAgICAgICAgICAgIHRoaXMuY2hhaW5zW2NoYWluXS5wdXNoKGN1cnJlbnRSb2NrKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuc2V0Um9jaygpO1xuICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmNoYWlucyk7XG4gICAgfVxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBIYW5kbGUgdGhlIGdvYmFuIHdpdGggdGhlIG5ldyB0ZXJyaXRvcmllc1xuICAgICAqXG4gICAgICovICBcbiAgICBoYW5kbGVHb2Jhbigpe1xuLypcbiAgICAgICAgaWYodGhpcy5yb2NrLnRvdWNoRW5uZW15TmVpZ2hib3JzKCkpe1xuXG4gICAgICAgICAgICBsZXQgY2hhaW5zID0gW107XG5cbiAgICAgICAgICAgIC8vIFRpbnkgY2hhaW5zIChkZWxldGUgYm91YmxvbilcbiAgICAgICAgICAgIGZvcihsZXQgcm9jayBvZiB0aGlzLnJvY2suZ2V0RW5lbXlOZWlnaGJvcnMoKSl7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5jYWNoZS5pbmRleE9mKHRoaXMucm9jaykgPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICBjaGFpbnMucHVzaCh0aGlzLnJvY2suZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaCh0aGlzLnJvY2suZ2V0Q2hhaW4oKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSAgIFxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjaGFpbnMpO1xuICAgICAgICB9Ki9cbiAgICB9XG5cbi8qXG5cbiAgICAgICAgLy8gQ2hlayBpZiB0aGVyZSBhcmUgZW5uZW1pZXMgYXJvdW5kIHRoZSBsYXN0IHJvY2sgcGxhY2VkXG4gICAgICAgIGlmKFxuICAgICAgICAgICAgdGhpcy50YWJbdGhpcy54XVt0aGlzLnkgLSAxXSA9PSB0aGlzLmVuZW15IHx8XG4gICAgICAgICAgICB0aGlzLnRhYlt0aGlzLnggKyAxXVt0aGlzLnldID09IHRoaXMuZW5lbXkgfHxcbiAgICAgICAgICAgIHRoaXMudGFiW3RoaXMueF1bdGhpcy55ICsgMV0gPT0gdGhpcy5lbmVteSB8fFxuICAgICAgICAgICAgdGhpcy50YWJbdGhpcy54IC0gMV1bdGhpcy55XSA9PSB0aGlzLmVuZW15KVxuICAgICAgICB7XG5cbiAgICAgICAgICAgIC8vIFJldHVybiB0aGUgdGVycml0b3J5IG9mIHRoZSBuZWlnaGJvcnMgXG4gICAgICAgICAgICBpZih0aGlzLnRhYlt0aGlzLnhdW3RoaXMueSAtIDFdID09IHRoaXMuZW5lbXkpe1xuICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3J5Wyd0b3AnXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCwgdGhpcy55IC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aGlzLnRhYlt0aGlzLnggKyAxXVt0aGlzLnldID09IHRoaXMuZW5lbXkpe1xuICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3J5WydyaWdodCddID0gbmV3IFRlcnJpdG9yeSh0aGlzLnRhYiwgdGhpcy5lbmVteSwgdGhpcy54ICsgMSwgdGhpcy55KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMudGFiW3RoaXMueF1bdGhpcy55ICsgMV0gPT0gdGhpcy5lbmVteSl7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXJyaXRvcnlbJ2JvdHRvbSddID0gbmV3IFRlcnJpdG9yeSh0aGlzLnRhYiwgdGhpcy5lbmVteSwgdGhpcy54LCB0aGlzLnkgKyAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKHRoaXMudGFiW3RoaXMueCAtIDFdW3RoaXMueV0gPT0gdGhpcy5lbmVteSl7XG4gICAgICAgICAgICAgICAgdGhpcy50ZXJyaXRvcnlbJ2xlZnQnXSA9IG5ldyBUZXJyaXRvcnkodGhpcy50YWIsIHRoaXMuZW5lbXksIHRoaXMueCAtIDEsIHRoaXMueSk7XG4gICAgICAgICAgICB9IFxuXG4gICAgICAgICAgICAvLyBUaW55IHRlcnJpdG9yaWVzIChkZWxldGUgYm91YmxvbilcbiAgICAgICAgICAgIHRoaXMuY2FjaGUgPSBbXTtcbiAgICAgICAgICAgIHRoaXMudGVycml0b3JpZXMgPSBbXTtcbiAgICAgICAgICAgIGZvcihsZXQgaSBpbiB0aGlzLnRlcnJpdG9yeSl7XG4gICAgICAgICAgICAgICAgbGV0IHRlcnJpdG9yeSA9IHRoaXMudGVycml0b3J5W2ldO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2FjaGUuaW5kZXhPZihKU09OLnN0cmluZ2lmeSh0ZXJyaXRvcnkuZ2V0KCkpKSA9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3JpZXMucHVzaCh0ZXJyaXRvcnkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNhY2hlLnB1c2goSlNPTi5zdHJpbmdpZnkodGVycml0b3J5LmdldCgpKSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBWZXJpZmljYXRpb24gb2YgZW5jaXJjbGVtZW50IHRlcnJpdG9yaWVzXG4gICAgICAgICAgICBmb3IobGV0IHRlcnJpdG9yeSBvZiB0aGlzLnRlcnJpdG9yaWVzKXtcbiAgICAgICAgICAgICAgICAvLyBUaGUgdGVycml0b3J5IGlzIGNpcmNsZWRcbiAgICAgICAgICAgICAgICBpZih0ZXJyaXRvcnkuaXNEZWFkKCkpe1xuXG4gICAgICAgICAgICAgICAgICAgIC8vIERldWJnXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCcqKicpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgRW5lbXkgdGVycml0b3J5IGNpcmNsZWQgYnkgcGxheWVyICR7dGhpcy5wbGF5ZXJ9ICFgKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2codGVycml0b3J5LmdldCgpKTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0qL1xufVxuXG5jbGFzcyBHYW1le1xuXG4gICAgLyoqXG4gICAgICogSW5pdCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gYXJyYXkgb3B0aW9ucyAob3B0aW9uYWwpXG4gICAgICogQHJldHVybiBcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgfVxuXG5cblxuXG5cblxuICAgIC8qKlxuICAgICAqIFJ1biB0aGUgZ2FtZVxuICAgICAqXG4gICAgICovICBcbiAgICBydW4oKXtcblxuICAgICAgICAvLyBCdWlsZGVyXG4gICAgICAgIHZhciBHYW1lQnVpbGRlciA9IG5ldyBCdWlsZGVyKCk7XG4gICAgICAgIEdhbWVCdWlsZGVyLnJ1bigpO1xuXG4gICAgICAgIC8vIEdhbWVwbGF5XG4gICAgICAgIHZhciBHYW1lR2FtZXBsYXkgPSBuZXcgR2FtZXBsYXkoKTtcbiAgICAgICAgR2FtZUdhbWVwbGF5Lmxpc3Rlbm5lcigpO1xuXG4gICAgfVxufVxuY2xhc3MgUGxheWVye1xyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENvbnN0cnVjdG9yXHJcbiAgICAgKlxyXG4gICAgICogQHBhcmFtIG5hbWUgb2YgdGhlIGN1cnJlbnQgcGxheWVyXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKHBsYXllcil7XHJcbiAgICAgICAgc3dpdGNoKHBsYXllcil7XHJcbiAgICAgICAgICAgIGNhc2UgJ2N1cnJlbnQnOiBcclxuICAgICAgICAgICAgICAgIHRoaXMubmFtZSA9IDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgY2FzZSAnZW5uZW15JzogXHJcbiAgICAgICAgICAgICAgICB0aGlzLm5hbWUgPSAyO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogTmV4dCBwbGF5ZXJcclxuICAgICAqXHJcbiAgICAgKi8gIFxyXG4gICAgbmV4dCgpe1xyXG4gICAgICAgIHRoaXMubmFtZSA9ICgodGhpcy5uYW1lKyspICUgMikgKyAxO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogR2V0IHBsYXllclxyXG4gICAgICpcclxuICAgICAqIEByZXR1cm4gdGhpcy5uYW1lXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0KCl7XHJcbiAgICBcdHJldHVybiB0aGlzLm5hbWU7XHJcbiAgICB9XHJcblxyXG4gICAgICAgIFxyXG59XG5jbGFzcyBSb2Nre1xyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBDb25zdHJ1Y3RvclxyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB4IGFuZCB5IChudW1iZXIpXHJcbiAgICAgKi8gICBcclxuICAgIGNvbnN0cnVjdG9yKHgsIHkpe1xyXG5cclxuICAgICAgICB0aGlzLmNoYWluID0gMDtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5wbGF5ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMuY29sb3I7XHJcblxyXG4gICAgICAgIHRoaXMuY2VsbFNpemUgPSBvcHRpb25zWydncmlkJ10uY2VsbFNpemU7XHJcbiAgICAgICAgdGhpcy5yb2NrU2l6ZSA9IG9wdGlvbnNbJ3JvY2snXS5zaXplO1xyXG4gICAgICAgIHRoaXMuY2FudmFzID0gU3ByaW50KG9wdGlvbnNbJ2dhbWVwbGF5J10uZWxlbWVudCkuZG9tWzBdLmdldENvbnRleHQoJzJkJyk7XHJcblxyXG4gICAgICAgIHRoaXMuY2hhaW5zO1xyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICBcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgd2UgYXJlIGluIGEgY2FzZSBvZiBzdWljaWRlXHJcbiAgICAgKlxyXG4gICAgICovICBcclxuICAgIGNoZWNrU3VpY2lkZSgpe1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ2hlY2sgaWYgd2UgYXJlIGluIGEgY2FzZSBvZiBLT1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBjaGVja0tPKCl7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIENoZWNrIGlmIHRoZSBwbGF5ZXIgY2FuIHBsYXkgaGVyZVxyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBjYW5QbGF5KHBsYXllciwgdGFiKXtcclxuXHJcbiAgICAgICAgaWYoIXRoaXMuY2hlY2tTdWljaWRlKCkgJiYgIXRoaXMuY2hlY2tLTygpICYmIHRoaXMuZ2V0UGxheWVyKCkgPT0gMCl7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBlbHNle1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcblxyXG5cclxuXHJcbiAgICBcclxuICAgIC8qIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cclxuXHJcblxyXG5cclxuXHJcblxyXG5cclxuICAgIC8qKlxyXG4gICAgICogQ3JlYXRlIGEgcm9ja1xyXG4gICAgICpcclxuICAgICAqLyAgXHJcbiAgICBjcmVhdGUocGxheWVyKXtcclxuXHJcbiAgICAgICAgLy8gU2V0IHBsYXllclxyXG4gICAgICAgIHRoaXMucGxheWVyID0gcGxheWVyLmdldCgpO1xyXG5cclxuICAgICAgICAvLyBTZXQgY29sb3JcclxuICAgICAgICB0aGlzLmNvbG9yID0gb3B0aW9uc1sncm9jayddLnBsYXllcjE7XHJcbiAgICAgICAgaWYodGhpcy5wbGF5ZXIgPT0gMil7XHJcbiAgICAgICAgICAgIHRoaXMuY29sb3IgPSAgb3B0aW9uc1sncm9jayddLnBsYXllcjI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBEcmF3XHJcbiAgICAgICAgdmFyIGMgPSB0aGlzLmNhbnZhcztcclxuICAgICAgICBjLmJlZ2luUGF0aCgpO1xyXG4gICAgICAgIGMuYXJjKHRoaXMueCAqIHRoaXMuY2VsbFNpemUsIHRoaXMueSAqIHRoaXMuY2VsbFNpemUsIHRoaXMucm9ja1NpemUgLyAyLCAwLCAyICogTWF0aC5QSSwgZmFsc2UpO1xyXG4gICAgICAgIGMuY2xvc2VQYXRoKCk7XHJcbiAgICAgICAgYy5maWxsU3R5bGUgPSB0aGlzLmNvbG9yO1xyXG4gICAgICAgIGMuZmlsbCgpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIFxyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgbmVpZ2hib3JpbmcgaW50ZXJzZWN0aW9uc1xyXG4gICAgICpcclxuICAgICAqIEBwYXJhbSB0YWIgKGFycmF5KVxyXG4gICAgICogQHJldHVybiBuZWlnaGJvcmluZyBpbnRlcnNlY3Rpb25zIChhcnJheSlcclxuICAgICAqLyAgXHJcbiAgICBnZXROZWlnaGJvcmluZ0ludGVyc2VjdGlvbnModGFiLCBwbGF5ZXIgPSAnYWxsJyl7XHJcblxyXG4gICAgICAgIHRoaXMubmVpZ2hib3JpbmdJbnRlcnNlY3Rpb25zID0gW107XHJcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IobGV0IGk9MSA7IGkgPD0gNCA7IGkrKyl7XHJcbiAgICAgICAgICAgIGxldCB4ID0gdGhpcy54O1xyXG4gICAgICAgICAgICBsZXQgeSA9IHRoaXMueTtcclxuXHJcbiAgICAgICAgICAgIHN3aXRjaChpKXtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICB5ID0geSAtIDE7IC8vIHRvcFxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgICAgICAgICB4Kys7IC8vIHJpZ2h0XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICAgICAgICAgIHkrKzsgLy8gYm90dG9tXHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSA0OlxyXG4gICAgICAgICAgICAgICAgICAgIHggPSB4IC0gMTsgLy8gbGVmdFxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZih0YWJbeF0gIT0gdW5kZWZpbmVkICYmIHRhYlt4XVt5XSAhPSB1bmRlZmluZWQpe1xyXG4gICAgICAgICAgICAgICAgbGV0IHJvY2sgPSB0YWJbeF1beV07XHJcbiAgICAgICAgICAgICAgICBpZihyb2NrLmdldFBsYXllcigpICE9IDApe1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2FjaGUucHVzaChyb2NrKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgc3dpdGNoKHBsYXllcil7XHJcbiAgICAgICAgICAgIGNhc2UgJ2N1cnJlbnQnOlxyXG4gICAgICAgICAgICAgICAgcGxheWVyID0gdGFiW3RoaXMueF1bdGhpcy55XS5nZXRQbGF5ZXIoKTtcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdlbm5lbXknOlxyXG4gICAgICAgICAgICAgICAgcGxheWVyID0gKCh0YWJbdGhpcy54XVt0aGlzLnldLmdldFBsYXllcigpICsgMSkgJSAyKSArIDE7XHJcbiAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKHBsYXllciAhPSAnYWxsJyl7XHJcbiAgICAgICAgICAgIGZvcihsZXQgaSBpbiB0aGlzLmNhY2hlKXtcclxuICAgICAgICAgICAgICAgIGxldCByb2NrID0gdGhpcy5jYWNoZVtpXTtcclxuICAgICAgICAgICAgICAgIGlmKHJvY2suZ2V0UGxheWVyKCkgPT0gcGxheWVyKXtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5laWdoYm9yaW5nSW50ZXJzZWN0aW9ucy5wdXNoKHJvY2spO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGVsc2V7XHJcbiAgICAgICAgICAgIHRoaXMubmVpZ2hib3JpbmdJbnRlcnNlY3Rpb25zID0gdGhpcy5jYWNoZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB0aGlzLm5laWdoYm9yaW5nSW50ZXJzZWN0aW9ucy5zb3J0KCk7XHJcblxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgIFxyXG4gICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgdGhlIHBsYXllciBcclxuICAgICAqXHJcbiAgICAgKiBAcmV0dXJuIHRoaXMucGxheWVyXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0UGxheWVyKCl7ICBcclxuICAgICAgICByZXR1cm4gdGhpcy5wbGF5ZXI7XHJcbiAgICB9XHJcblxyXG5cclxuXHJcblxyXG5cclxuXHJcbiAgICAvKipcclxuICAgICAqIFNldCBjaGFpbiBcclxuICAgICAqXHJcbiAgICAgKiBAcGFyYW0gY2hhaW4gKG51bWJlcilcclxuICAgICAqLyAgXHJcbiAgICBzZXRDaGFpbihjaGFpbil7ICBcclxuICAgICAgICB0aGlzLmNoYWluID0gY2hhaW47IFxyXG4gICAgfVxyXG5cclxuXHJcblxyXG5cclxuXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBHZXQgY2hhaW4gXHJcbiAgICAgKlxyXG4gICAgICogQHJldHVybiB0aGlzLmNoYWluXHJcbiAgICAgKi8gIFxyXG4gICAgZ2V0Q2hhaW4oKXsgIFxyXG4gICAgICAgIHJldHVybiB0aGlzLmNoYWluO1xyXG4gICAgfVxyXG5cclxufVxyXG5cbmNsYXNzIFNhdmUgZXh0ZW5kcyBHYW1lcGxheXtcblxuICAgIGNvbnN0cnVjdG9yKCl7XG4gICAgXHRzdXBlcigpO1xuICAgICAgICB0aGlzLnNjb3JlID0gW107XG4gICAgfVxuXG59XG5jbGFzcyBTY29yZXtcbiAgICBjb25zdHJ1Y3Rvcigpe1xuICAgIH1cbn1cblxuY2xhc3MgVGVycml0b3J5e1xuXG4gICAgLyoqXG4gICAgICogSW5pdCBvcHRpb25zXG4gICAgICpcbiAgICAgKiBAcGFyYW0gdGFiIChhcnJheSlcbiAgICAgKiBAcGFyYW0gZW5uZW15IChudW1iZXIpXG4gICAgICogQHBhcmFtIHggYW5kIHkgY29vcmRpbmF0ZSAobnVtYmVycylcbiAgICAgKi8gICAgIFxuICAgIGNvbnN0cnVjdG9yKHRhYiwgZW5lbXksIHgsIHkpe1xuXG4gICAgICAgIHRoaXMudGFiID0gdGFiO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5lbmVteSA9IGVuZW15O1xuICAgICAgICBcbiAgICAgICAgdGhpcy5jb29yZGluYXRlO1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICBcbiAgICAgICAgdGhpcy5saWJlcnRpZXMgPSAwO1xuICAgICAgICB0aGlzLnRlcnJpdG9yeSA9IFtdO1xuICAgICAgICB0aGlzLmJvcmRlclRlcnJpdG9yeSA9IFtdO1xuICAgICAgICBcbiAgICAgICAgdGhpcy5zdGFydCA9IGAke3RoaXMueH07JHt0aGlzLnl9YDtcbiAgICAgICAgdGhpcy5pbmRleEdvQmFjaztcbiAgICAgICAgdGhpcy5uZXdSb2NrID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5jYWNoZSA9IFtdO1xuICAgICAgICB0aGlzLmFyb3VuZCA9IFtdO1xuXG4gICAgICAgIHRoaXMucnVuKCk7XG5cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogRmluZCB0aGUgdGVycml0b3J5IGJ5IHJlY3Vyc2lvblxuICAgICAqXG4gICAgICovICBcbiAgICBydW4oKXtcblxuICAgICAgICAvLyBJbml0IGFyb3VuZCByb2Nrc1xuICAgICAgICB0aGlzLmFyb3VuZD0gW107XG5cbiAgICAgICAgLy8gU2F2ZVxuICAgICAgICBpZih0aGlzLm5ld1JvY2sgPT0gdHJ1ZSl7XG4gICAgICAgICAgICB0aGlzLmNhY2hlWydgJHt0aGlzLnh9OyR7dGhpcy55fWAnXSA9ICdjaGVjayc7XG4gICAgICAgICAgICB0aGlzLmluZGV4R29CYWNrID0gdGhpcy50ZXJyaXRvcnkubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy50ZXJyaXRvcnkucHVzaChgJHt0aGlzLnh9OyR7dGhpcy55fWApO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gV2UgY2hlY2sgcm9ja3MgYXJvdW5kXG4gICAgICAgIGZvcih2YXIgaSA9IDE7IGkgPD0gNDsgaSsrKXtcbiAgICAgICAgICAgIHN3aXRjaChpKXtcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueH07JHt0aGlzLnkgLSAxfWA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvb3JkaW5hdGUgPSBgJHt0aGlzLnggKyAxfTske3RoaXMueX1gO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgICAgICAgIGNhc2UgMzpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb29yZGluYXRlID0gYCR7dGhpcy54fTske3RoaXMueSArIDF9YDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29vcmRpbmF0ZSA9IGAke3RoaXMueCAtIDF9OyR7dGhpcy55fWA7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZih0aGlzLnRhYlt0aGlzLmNvb3JkaW5hdGVdID09IHRoaXMuZW5lbXkgJiYgdGhpcy5jYWNoZVt0aGlzLmNvb3JkaW5hdGVdICAhPSAnY2hlY2snKXtcbiAgICAgICAgICAgICAgICB0aGlzLmFyb3VuZC5wdXNoKHRoaXMuY29vcmRpbmF0ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBJZiBubyBlbmVtaWVzXG4gICAgICAgIGlmKHRoaXMuYXJvdW5kLmxlbmd0aCA9PSAwKXtcblxuICAgICAgICAgICAgLy8gSWYgd2UgY2FuIGdvIGJhY2sgdG8gZmluZCBtb3JlIG5ldyByb2Nrc1xuICAgICAgICAgICAgaWYoISh0aGlzLnN0YXJ0ID09IGAke3RoaXMueH07JHt0aGlzLnl9YCkpe1xuXG4gICAgICAgICAgICAgICAgLy8gU2FpZCB3ZSBnbyBiYWNrXG4gICAgICAgICAgICAgICAgdGhpcy5uZXdSb2NrID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pbmRleEdvQmFjayA9IHRoaXMuaW5kZXhHb0JhY2sgLSAxO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIC8vIFNldCBuZXcgY29vcmRpbmF0ZXMgZm9yIHRoZSBuZXh0IGp1bXBcblxuICAgICAgICAgICAgICAgIHRoaXMudGVycml0b3lbdGhpcy5pbmRleEdvQmFja10gLy8gMTsxXG5cbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnRlcnJpdG9yeVt0aGlzLmluZGV4R29CYWNrXS5sYXN0SW5kZXhPZignOycpO1xuICAgICAgICAgICAgICAgIHRoaXMueCA9IHBhcnNlSW50KHRoaXMudGVycml0b3J5W3RoaXMuaW5kZXhHb0JhY2tdLnN1YnN0cigwLCBpbmRleCkpO1xuICAgICAgICAgICAgICAgIHRoaXMueSA9IHBhcnNlSW50KHRoaXMudGVycml0b3J5W3RoaXMuaW5kZXhHb0JhY2tdLnN1YnN0cmluZyhpbmRleCArIDEpKTtcblxuICAgICAgICAgICAgICAgIC8vIEp1bXAgYnkgcmVjdXJzaW9uIHRvIGFuIGFub3RoZXIgcm9ja1xuICAgICAgICAgICAgICAgIHRoaXMucnVuKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZXtcblxuICAgICAgICAgICAgLy8gQ2hlY2sgb25lIGVuZW15XG4gICAgICAgICAgICB0aGlzLnJhbmRvbSA9IE1hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIHRoaXMuYXJvdW5kLmxlbmd0aCk7XG5cbiAgICAgICAgICAgIC8vIFNldCBuZXcgY29vcmRpbmF0ZXMgZm9yIHRoZSBuZXh0IGp1bXBcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuYXJvdW5kW3RoaXMucmFuZG9tXS5sYXN0SW5kZXhPZignOycpO1xuICAgICAgICAgICAgdGhpcy54ID0gcGFyc2VJbnQodGhpcy5hcm91bmRbdGhpcy5yYW5kb21dLnN1YnN0cigwLCBpbmRleCkpO1xuICAgICAgICAgICAgdGhpcy55ID0gcGFyc2VJbnQodGhpcy5hcm91bmRbdGhpcy5yYW5kb21dLnN1YnN0cmluZyhpbmRleCArIDEpKTtcblxuICAgICAgICAgICAgLy8gSnVtcCBieSByZWN1cnNpb24gdG8gYW4gYW5vdGhlciByb2NrXG4gICAgICAgICAgICB0aGlzLm5ld1JvY2sgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5ydW4oKTtcblxuICAgICAgICB9XG4gICAgfVxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYWxsIHRoZSB0ZXJyaXRvcnlcbiAgICAgKlxuICAgICAqIEByZXR1cm4gYXJyYXlcbiAgICAgKi8gXG4gICAgZ2V0KCl7XG4gICAgICAgIHJldHVybiB0aGlzLnRlcnJpdG9yeS5zb3J0KCk7XG4gICAgfVxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm4gYm9yZGVycyBvZiB0aGUgdGVycml0b3J5XG4gICAgICpcbiAgICAgKiBAcmV0dXJuIGFycmF5XG4gICAgICovIFxuICAgIGdldEJvcmRlcnMoKXtcblxuICAgICAgICBpZih0aGlzLmJvcmRlclRlcnJpdG9yeS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICBmb3IodmFyIGl0ZW0gb2YgdGhpcy50ZXJyaXRvcnkpe1xuXG4gICAgICAgICAgICAgICAgLy8gU2V0IGNvb3JkaW5hdGVzIG9mIHRoZSBjdXJyZW50IHJvY2tcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBpdGVtLmxhc3RJbmRleE9mKCc7Jyk7XG4gICAgICAgICAgICAgICAgdGhpcy54ID0gcGFyc2VJbnQoaXRlbS5zdWJzdHIoMCwgaW5kZXgpKTtcbiAgICAgICAgICAgICAgICB0aGlzLnkgPSBwYXJzZUludChpdGVtLnN1YnN0cmluZyhpbmRleCArIDEpKTtcblxuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHRoZSByb2NrIGlzIG5vdCB0b3RhbGx5IGFyb3VuZCB0byBrbm93IGlmIGl0J3Mgb24gdGhlIGJvcmRlclxuICAgICAgICAgICAgICAgIGlmKCEodGhpcy50YWJbYCR7dGhpcy54fTske3RoaXMueSAtIDF9YF0gPT0gdGhpcy5lbmVteSAmJlxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRhYltgJHt0aGlzLnggKyAxfTske3RoaXMueX1gXSA9PSB0aGlzLmVuZW15ICYmXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3RoaXMueH07JHt0aGlzLnkgKyAxfWBdID09IHRoaXMuZW5lbXkgJiZcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7dGhpcy54IC0gMX07JHt0aGlzLnl9YF0gPT0gdGhpcy5lbmVteSkpe1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmJvcmRlclRlcnJpdG9yeS5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuYm9yZGVyVGVycml0b3J5LnNvcnQoKTtcblxuICAgIH1cblxuXG5cblxuXG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGUgdGVycml0b3J5IGlzIGRlYWRcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdHJ1ZSBvciBmYWxzZVxuICAgICAqLyBcbiAgICBpc0RlYWQoKXtcblxuICAgICAgICAvLyBHZXQgYm9yZGVycyBvZiB0aGUgdGVycml0b3J5XG4gICAgICAgIGlmKHRoaXMuYm9yZGVyVGVycml0b3J5Lmxlbmd0aCA9PSAwKXtcbiAgICAgICAgICAgIHRoaXMuZ2V0Qm9yZGVycygpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gR2V0IGxpYmVydGllcyBvZiB0aGUgdGVycml0b3J5XG4gICAgICAgIGlmKHRoaXMubGliZXJ0aWVzID09IDApe1xuICAgICAgICAgICAgdGhpcy5nZXRMaWJlcnRpZXMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKHRoaXMubGliZXJ0aWVzID09IHRoaXMuYm9yZGVyVGVycml0b3J5Lmxlbmd0aCl7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICBlbHNle1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICB9XG5cblxuXG5cblxuXG4gICAgLyoqXG4gICAgICogR2V0IGxpYmVydGllcyBvZiB0aGUgdGVycml0b3JpZXNcbiAgICAgKlxuICAgICAqIEByZXR1cm4gdGhpcy5saWJlcnRpZXMgKG51bWJlcilcbiAgICAgKi8gXG4gICAgZ2V0TGliZXJ0aWVzKCl7XG5cbiAgICAgICAgLy8gR2V0IGJvcmRlcnMgb2YgdGhlIHRlcnJpdG9yeVxuICAgICAgICBpZih0aGlzLmJvcmRlclRlcnJpdG9yeS5sZW5ndGggPT0gMCl7XG4gICAgICAgICAgICB0aGlzLmdldEJvcmRlcnMoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGliZXJ0aWVzID0gMDtcbiAgICAgICAgXG4gICAgICAgIGZvcihsZXQgcm9jayBvZiB0aGlzLmJvcmRlclRlcnJpdG9yeSl7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSByb2NrLmxhc3RJbmRleE9mKCc7Jyk7XG4gICAgICAgICAgICBsZXQgeCA9IHBhcnNlSW50KHJvY2suc3Vic3RyKDAsIGluZGV4KSk7XG4gICAgICAgICAgICBsZXQgeSA9IHBhcnNlSW50KHJvY2suc3Vic3RyaW5nKGluZGV4ICsgMSkpO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB0aGUgcm9jayBoYXMgYW55IGxpYmVydGllc1xuICAgICAgICAgICAgaWYodGhpcy50YWJbYCR7eH07JHt5IC0gMX1gXSAhPSAwICYmXG4gICAgICAgICAgICAgICB0aGlzLnRhYltgJHt4ICsgMX07JHt5fWBdICE9IDAgJiZcbiAgICAgICAgICAgICAgIHRoaXMudGFiW2Ake3h9OyR7eSArIDF9YF0gIT0gMCAmJlxuICAgICAgICAgICAgICAgdGhpcy50YWJbYCR7eCAtIDF9OyR7eX1gXSAhPSAwKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMubGliZXJ0aWVzKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5saWJlcnRpZXM7XG5cbiAgICB9XG59XG4vKipcbiAqIE1pbmlvbnMgaW4gZGHigJkgZ2FtZSwgYnJvdGhhIPCfmI5cbiAqIFJhcGhhw6tsbGUgTGltb2dlcywgQWxleGFuZHJhIENvc3NpZCwgQ2hhcmxlcyBNYW5nd2EsIFRIw6lvIEtudXR6IGV0IEzDqW8gTGUgQnJhc1xuICogSEVUSUMgUDIwMTlcbiAqXG4gKiBXb3JrIHdpdGggRVM2KyAod2l0aCBiYWJlbCB0cmFuc3BpbGVsZXIpXG4gKlxuICogQ29weXJpZ2h0IDIwMTVcbiAqIFJlbGVhc2VkIHVuZGVyIHRoZSBNSVQgbGljZW5zZVxuICogaHR0cDovL29wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICpcbiAqIERhdGUgb2YgY3JlYXRpb24gOiAyMDE1LTA1LTE5XG4gKi9cblxudmFyIG9wdGlvbnMgPSB7XG4gICAgZ29iYW46IHtcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuJ1xuICAgIH0sXG4gICAgZ2FtZXBsYXk6IHtcbiAgICAgICAgZWxlbWVudDogJy5HYW1lX2dvYmFuX2dhbWVwbGF5J1xuICAgIH0sXG4gICAgZ3JpZDoge1xuICAgICAgICBuYnJlOiAnMTknLFxuICAgICAgICBlbGVtZW50OiAnLkdhbWVfZ29iYW5fZ3JpZCcsXG4gICAgICAgIGNlbGxTaXplOiA0MCxcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiAnd2hpdGUnLFxuICAgICAgICBib3JkZXJDb2xvcjogJ2JsYWNrJyxcbiAgICAgICAgYm9yZGVyV2lkdGg6IDJcbiAgICB9LFxuICAgIHJvY2s6e1xuICAgICAgICBzaXplOiAyMCxcbiAgICAgICAgcGxheWVyMTogJ2dyZXknLFxuICAgICAgICBwbGF5ZXIyOiAnYmxhY2snXG4gICAgfVxufTtcblxudmFyIEdvR2FtZSA9IG5ldyBHYW1lKG9wdGlvbnMpO1xuR29HYW1lLnJ1bigpO1xuIl19
