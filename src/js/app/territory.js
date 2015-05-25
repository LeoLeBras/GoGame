 /**
  * Minions in da’ game, brotha 😎
  * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
  * HETIC P2019
  *
  * Territory module
  *
  * Work with ES6+ (with babel transpiler)
  *
  * Copyright 2015
  * Released under the MIT license
  * http://opensource.org/licenses/MIT
  *
  * Date of creation : 2015-05-19
  */

export class Territory{

    constructor(tab, enemy, x, y){
        this.tab = tab;
        this.enemy = enemy;
        this.x = x;
        this.y = y;
        this.start = `${this.x};${this.y}`;
        this.coordinate;
        this.cache = [];
        this.around = [];
        this.territory = [];
        this.borderTerritory = [];
        this.indexGoBack;
        this.newRock = true;
    }

    findTerritory(){

        // Init around rocks
        this.around= [];

        // Save
        if(this.newRock){
            this.cache[`${this.x};${this.y}`] = 'check';
            this.indexGoBack = this.territory.length;
            this.territory.push(`${this.x};${this.y}`);
        }

        // We check rocks around
        for(var i = 1; i <= 4; i++){
            switch(i){
                case 1:
                    this.coordinate = `${this.x};${this.y - 1}`;
                    break;

                case 2:
                    this.coordinate = `${this.x + 1};${this.y}`;
                    break;

                case 3:
                    this.coordinate = `${this.x};${this.y + 1}`;
                    break;

                case 4:
                    this.coordinate = `${this.x - 1};${this.y}`;
                    break;
            }


            if(this.tab[this.coordinate] == this.enemy && this.cache[this.coordinate]  != 'check'){
                this.around.push(this.coordinate);
            }
        }

        // If no enemies
        if(this.around.length == 0){

            // If we can go back to find more new rocks
            if(!(this.start == `${this.x};${this.y}`)){

                // Said we go back
                this.newRock = false;
                this.indexGoBack = this.indexGoBack - 1;
                
                // Set new coordinates for the next jump
                var index = this.territory[this.indexGoBack].lastIndexOf(';');
                this.x = parseInt(this.territory[this.indexGoBack].substr(0, index));
                this.y = parseInt(this.territory[this.indexGoBack].substring(index + 1));

                // Jump by recursion to an another rock
                this.findTerritory();

            }
        }

        else{

            // Check one enemy
            this.random = Math.floor(Math.random() * this.around.length);

            // Set new coordinates for the next jump
            var index = this.around[this.random].lastIndexOf(';');
            this.x = parseInt(this.around[this.random].substr(0, index));
            this.y = parseInt(this.around[this.random].substring(index + 1));

            // Jump by recursion to an another rock
            this.newRock = true;
            this.findTerritory();

        }
    }


    /**
     * Return all the territory
     *
     * @return this.territory array
     */ 
    get(){
        return this.territory.sort();
    }


    /**
     * Return borders of the territory
     *
     * @return this.territory array
     */ 
    getBorders(){

        if(this.borderTerritory.length == 0){
            for(var item of this.territory){

                // Set coordinates of the current rock
                var index = item.lastIndexOf(';');
                this.x = parseInt(item.substr(0, index));
                this.y = parseInt(item.substring(index + 1));

                // Check if the rock is not totally around to know if it's on the border
                if(!(this.tab[`${this.x};${this.y - 1}`] == this.enemy &&
                    this.tab[`${this.x + 1};${this.y}`] == this.enemy &&
                    this.tab[`${this.x};${this.y + 1}`] == this.enemy &&
                    this.tab[`${this.x - 1};${this.y}`] == this.enemy)){
                    this.borderTerritory.push(item);
                }
            }
        }

        return this.borderTerritory.sort();

    }
}

module.exports = Territory; 