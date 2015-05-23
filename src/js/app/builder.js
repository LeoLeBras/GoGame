 /**
  * Minions in da’ game, brotha 😎
  * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
  * HETIC P2019
  *
  * Builder module
  *
  * Work with ES6+ (with babel transpiler)
  *
  * Copyright 2012, 2014
  * Released under the MIT license
  * http://opensource.org/licenses/MIT
  *
  * Date of creation : 2015-05-19
  */

class Builder{


    /**
     * Init options
     *
     * @param array options
     */     
    constructor(options){
        this.grid = options['grid'].nbre;
        this.cellSize = options['grid'].cellSize;
        this.gridSize = (parseInt(this.grid) + 1) * this.cellSize;

        this.$goban = Sprint(options['goban'].element);
        this.$goban_gameplay = Sprint(options['gameplay'].element);
        this.$goban_grid = Sprint(options['grid'].element);

        this.gridCanvas = this.$goban_grid.dom[0].getContext('2d');
        this.gameplayCanvas = this.$goban_gameplay.dom[0].getContext('2d');
    }







    /**
     * Build the goban
     *
     * @return css style of the goban
     */  
    buildGoban(){
        this.$goban.css({
            width: this.gridSize,
            height: this.gridSize,
        });
    }







    /**
     * Build the gameplay
     *
     * @return canvas
     */  
    buildGameplay(){

        // Set size of canvas
        this.$goban_gameplay.dom[0].width = this.gridSize;
        this.$goban_gameplay.dom[0].height = this.gridSize;
        this.$goban_gameplay.css({
            width: this.gridSize,
            height: this.gridSize
        })

    }







    /**
     * Build the grid
     *
     * @return canvas with a grid drawn
     */  
    buildGrid(){

        // Set size of canvas
        this.$goban_grid.dom[0].width = this.gridSize;
        this.$goban_grid.dom[0].height = this.gridSize;
        this.$goban_grid.css({
            width: this.gridSize,
            height: this.gridSize
        })

        // Init the canvas
        var c = this.gridCanvas;

        // Draw each lines of the grid
        for(var x = 1; x <= this.grid ; x++){
            c.beginPath();
            c.moveTo(this.cellSize, this.cellSize * x);
            c.lineTo(this.gridSize - this.cellSize, this.cellSize * x);
            c.lineWidth = 2;
            c.stroke();
        }
        for(var y = 1; y <= this.grid ; y++){
            c.beginPath();
            c.moveTo(this.cellSize * y, this.cellSize);
            c.lineTo(this.cellSize * y, this.gridSize - this.cellSize);
            c.lineWidth = 2;
            c.stroke();
        }
    }






    /**
     * Build all elements
     *
     */  
    run(){
        this.buildGoban();
        this.buildGameplay();
        this.buildGrid();
    }

}

module.exports = Builder;