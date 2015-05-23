 /**
  * Minions in da’ game, brotha 😎
  * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
  * HETIC P2019
  * 
  * Index
  *
  * Work with ES6+ (with babel transpiler)
  *
  * Copyright 2012, 2014
  * Released under the MIT license
  * http://opensource.org/licenses/MIT
  *
  * Date of creation : 2015-05-19
  */

import Builder from "./builder.js";
import Gameplay from "./gameplay.js";
import Save from "./save.js";
import Score from "./score.js";

class Game{

    /**
     * Init options
     *
     * @param array options (optional)
     * @return 
     */     
    constructor(options){
        this.grid = options['grid'].nbre;
        this.$goban = options['element'];
        this.cellSize = options['grid'].cellSize;
    }






    /**
     * Run the game
     *
     */  
    run(){

        // Builder
        var GameBuilder = new Builder({
            element: this.$goban,
            grid: {
                nbre: this.grid,
                cellSize: this.cellSize
            }
        });
        GameBuilder.run();

        // Gameplay
        var GameGameplay = new Gameplay({
            element: this.$goban,
        });
        GameGameplay.run();

    }
}

module.exports = Game;

