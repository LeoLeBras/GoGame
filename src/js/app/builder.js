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
        this.$grid = Sprint(options['element']);
        this.gridCanvas = this.$grid.dom[0].getContext('2d');
        this.cellSize = options['grid'].cellSize;
        this.gridSize = this.grid * this.cellSize;
    }







    /**
     * Build the background grid
     *
     * @return canvas
     */  
    buildGrid(){

        // Set size of canvas
        this.$grid.dom[0].width = this.gridSize;
        this.$grid.dom[0].height = this.gridSize;

        // Init the canvas
        var c = this.gridCanvas;

        // Draw each lines of the grid
        for(var x = 1; x < this.grid ; x++){
            c.beginPath();
            c.moveTo(this.cellSize, this.cellSize * x);
            c.lineTo(this.gridSize - this.cellSize, this.cellSize * x);
            c.lineWidth = 1;
            c.stroke();
        }

        for(var y = 1; y < this.grid ; y++){
            c.beginPath();
            c.moveTo(this.cellSize * y, this.cellSize);
            c.lineTo(this.cellSize * y, this.gridSize - this.cellSize);
            c.lineWidth = 1;
            c.stroke();
        }

    }






    /**
     * Build all elements
     *
     */  
    run(){
        this.buildGrid();
    }

}

module.exports = Builder;