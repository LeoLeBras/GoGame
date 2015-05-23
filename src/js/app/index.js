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
        this.$goban = options['goban'].element;
        this.$goban_grid = options['grid'].element;
        this.$goban_gameplay = options['gameplay'].element;
        this.cellSize = options['grid'].cellSize;
        this.rockSize = options['rock'].size;
    }






    /**
     * Run the game
     *
     */  
    run(){

        // Builder
        var GameBuilder = new Builder({
          goban: {
              element: this.$goban
          },
          gameplay: {
              element: this.$goban_gameplay
          },
          grid: {
              element: this.$goban_grid,
              nbre: this.grid,
              cellSize: this.cellSize
          }
        });
        GameBuilder.run();


        // Gameplay
        var GameGameplay = new Gameplay({
            element: this.$goban_gameplay,
            grid: {
                nbre: this.grid,
                cellSize: this.cellSize
            },
            rock: {
                size: this.rockSize,
            }
        });
        GameGameplay.listenner();

    }
}

module.exports = Game;

