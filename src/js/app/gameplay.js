 /**
  * Minions in da’ game, brotha 😎
  * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
  * HETIC P2019
  *
  * Gameplay module
  *
  * Work with ES6+ (with babel transpiler)
  *
  * Copyright 2012, 2014
  * Released under the MIT license
  * http://opensource.org/licenses/MIT
  *
  * Date of creation : 2015-05-19
  */

class Gameplay{


    /**
     * Init params
     *
     * @param array options
     */   
    constructor(options){
        this.grid = options['grid'].nbre;
        this.$goban = Sprint(options['element']);
        this.canvas = this.$goban.dom[0].getContext('2d');
        this.cellSize = options['grid'].cellSize;
        this.rockSize = options['rock'].size;
        this.player = 1;
    }


    /**
     * Listen event on the gameplay 
     *
     */  
    listenner(){
        this.create();
        Sprint(this.$goban).on('click', function(e){
            this.create(e.layerX, e.layerY);
        }.bind(this));
    }


    /**
     * Create a rock
     *
     * @params coordinates click
     * @return a rock drawn on the canvas
     */  
    create(layerX, layerY){

        console.log(((this.player++) % 2) + 1);

        // Set coordinates 
        var x = Math.floor((layerX + this.cellSize / 2) / this.cellSize);
        var y = Math.floor((layerY + this.cellSize / 2) / this.cellSize);

        // Draw the rock
        if(1 <= x && x <= this.grid && 1 <= y && y <= this.grid ){
          var c = this.canvas;
          c.beginPath();
          c.arc(x * this.cellSize, y * this.cellSize, this.rockSize, 0, 2 * Math.PI, false);
          c.closePath();
          c.fillStyle = 'black';
          c.fill();
        }
    }
}

module.exports = Gameplay;