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
        this.start = `${this.x};${this.y - 1}`;
        this.cache = [];
        this.around = [];
        this.territory = [];
        this.borderTerritory = [];
    }

    findTerritory(){

        // Init around rocks
        this.around= [];

        this.cache[`${this.x};${this.y}`] = 'check';
        this.territory.push(`${this.x};${this.y}`);

        // We check rocks around
        for(var i = 1; i <= 4; i++){
            switch(i){
                case 1:
                    if(this.tab[`${this.x};${this.y - 1}`] == this.enemy && this.cache[`${this.x};${this.y - 1}`]  != 'check'){
                        this.around.push(`${this.x};${this.y - 1}`);
                    }
                    break;

                case 2:
                    if(this.tab[`${this.x + 1};${this.y}`] == this.enemy && this.cache[`${this.x + 1};${this.y}`]  != 'check'){
                        this.around.push(`${this.x + 1};${this.y}`);
                    }
                    break;

                case 3:
                    if(this.tab[`${this.x};${this.y + 1}`] == this.enemy && this.cache[`${this.x};${this.y + 1}`]  != 'check'){
                        this.around.push(`${this.x};${this.y + 1}`);
                    }
                    break;

                case 4:
                    if(this.tab[`${this.x - 1};${this.y}`] == this.enemy && this.cache[`${this.x - 1};${this.y}`]  != 'check'){
                        this.around.push(`${this.x - 1};${this.y}`);
                    }
                    break;
            }
        }

        // If no enemies
        if(this.around.length == 0){

            // This is the end, Hold your breath and count to ten, Feel the earth move, and them ... ♪♫
            if(this.start == `${this.x};${this.y}`){
            }
            
            // Go back !
            else{

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
            this.findTerritory();

        }

    }

    findBorderTerritory(){

        this.findTerritory();

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

        return this.borderTerritory.sort();

    }
}

module.exports = Territory; 