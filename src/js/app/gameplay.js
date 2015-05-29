 /**
  * Minions in da’ game, brotha 😎
  * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
  * HETIC P2019
  *
  * Gameplay module
  *
  * Work with ES6+ (with babel transpiler)
  *
  * Copyright 2015
  * Released under the MIT license
  * http://opensource.org/licenses/MIT
  *
  * Date of creation : 2015-05-19
  */

import Territory from "./territory.js";

class Gameplay{


    /**
     * Init params
     *
     * @param array options
     */   
    constructor(options){

        this.$goban = Sprint(options['element']);
        this.canvas = this.$goban.dom[0].getContext('2d');
        
        this.grid = options['grid'].nbre;
        this.cellSize = options['grid'].cellSize;

        this.rockSize = options['rock'].size;
        this.rockPlayer1 = options['rock'].player1;
        this.rockPlayer2 = options['rock'].player2;

        this.player = 1;
        this.enemy = this.player++;

        this.tab = [];
        this.territories = [];
        this.territory = [];
        this.cache = [];

        // Initialyse the tab
        for(var x = 1; x <= this.grid ; x++){
            for(var y = 1; y <= this.grid ; y++){
                this.tab[`${x};${y}`] = 0;
            }
        }

    }






    /**
     * Listen event on the gameplay 
     *
     */  
    listenner(){

        // The player click on the goban to play
        Sprint(this.$goban).on('click', function(e){

            // Set coordinates 
            this.x = Math.floor((e.layerX + this.cellSize / 2) / this.cellSize);
            this.y = Math.floor((e.layerY + this.cellSize / 2) / this.cellSize);

            if(this.create(this.x, this.y)){
                
                // Debug
                console.log(`*********************************`);
                var color = this.rockPlayer1;
                if(this.player == 2){
                    color = this.rockPlayer2;
                }
                console.log(`Joueur ${this.player} (${color}) en ${this.x};${this.y}`);

                this.rewriteGoban();
                this.player = ((this.player++) % 2) + 1;
                this.enemy = ((this.enemy++) % 2) + 1;
            }
        }.bind(this));

    }






    /**
     * Check if we are in a case of suicide
     *
     */  
    checkSuicide(){
        return false;
    }






    /**
     * Check if we are in a case of KO
     *
     */  
    checkKO(){
        return false;
    }






    /**
     * Create a rock
     *
     * @params coordinates click
     * @return a rock drawn on the canvas
     */  
    create(x, y){

        // Set color
        var color = this.rockPlayer1;
        if(this.player == 2){
            color = this.rockPlayer2;
        }

        // Check if we are on the goban
        if(1 <= this.x && this.x <= this.grid && 1 <= this.y && this.y <= this.grid ){

            // Check if the player can play at this place
            if(!this.checkSuicide() && !this.checkKO() && this.tab[`${this.x};${this.y}`] == 0){

                // Draw the rock
                var c = this.canvas;
                c.beginPath();
                c.arc(this.x * this.cellSize, this.y * this.cellSize, this.rockSize / 2, 0, 2 * Math.PI, false);
                c.closePath();
                c.fillStyle = color;
                c.fill();

                // Save in the tab
                this.tab[`${this.x};${this.y}`] = this.player;

                return true;
            }
            else{
                return false;
            }
        }
        else{
            return false;
        }
    }






    /**
     * Rewrite goban with the last action of the player
     *
     */  
    rewriteGoban(){

        // Init territory
        this.territory = [];

        // Chek if there are ennemies around the last rock placed
        if(
            this.tab[`${this.x};${this.y - 1}`] == this.enemy ||
            this.tab[`${this.x + 1};${this.y}`] == this.enemy ||
            this.tab[`${this.x};${this.y + 1}`] == this.enemy ||
            this.tab[`${this.x - 1};${this.y}`] == this.enemy)
        {

            // Return the territory of the neighbors 
            if(this.tab[`${this.x};${this.y - 1}`] == this.enemy){
                this.territory['top'] = new Territory(this.tab, this.enemy, this.x, this.y - 1);
            }
            if(this.tab[`${this.x + 1};${this.y}`] == this.enemy){
                this.territory['right'] = new Territory(this.tab, this.enemy, this.x + 1, this.y);
            }
            if(this.tab[`${this.x};${this.y + 1}`] == this.enemy){
                this.territory['bottom'] = new Territory(this.tab, this.enemy, this.x, this.y + 1);
            }
            if(this.tab[`${this.x - 1};${this.y}`] == this.enemy){
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
                    console.log('Enemy territory circled !');
                    console.log(territory.get());

                    // Delete each rock
                    for(let rockDied of territory.get()){

                        // In the tab
                        this.tab[rockDied] = 0 ;

                        // On the interface
                        let index = rockDied.lastIndexOf(';');
                        this.x = parseInt(rockDied.substr(0, index)) * this.cellSize - 1 - this.rockSize / 2;
                        this.y = parseInt(rockDied.substring(index + 1)) * this.cellSize - 1 - this.rockSize / 2;
                        this.canvas.clearRect(this.x,this.y,this.rockSize + 2, this.rockSize + 2);

                    }
                }
            }
        }
    }
}

module.exports = Gameplay;