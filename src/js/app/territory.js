class Territory{

    /**
     * Init options
     *
     * @param tab (array)
     * @param ennemy (number)
     * @param x and y coordinate (numbers)
     */     
    constructor(tab, enemy, x, y){

        this.tab = tab;
        
        this.enemy = enemy;
        
        this.coordinate;
        this.x = x;
        this.y = y;
        
        this.liberties = 0;
        this.territory = [];
        this.borderTerritory = [];
        
        this.start = `${this.x};${this.y}`;
        this.indexGoBack;
        this.newRock = true;
        this.cache = [];
        this.around = [];

        this.run();

    }






    /**
     * Find the territory by recursion
     *
     */  
    run(){

        // Init around rocks
        this.around= [];

        // Save
        if(this.newRock == true){
            this.cache['`${this.x};${this.y}`'] = 'check';
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

                this.territoy[this.indexGoBack] // 1;1

                var index = this.territory[this.indexGoBack].lastIndexOf(';');
                this.x = parseInt(this.territory[this.indexGoBack].substr(0, index));
                this.y = parseInt(this.territory[this.indexGoBack].substring(index + 1));

                // Jump by recursion to an another rock
                this.run();
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
            this.run();

        }
    }





    /**
     * Return all the territory
     *
     * @return array
     */ 
    get(){
        return this.territory.sort();
    }





    /**
     * Return borders of the territory
     *
     * @return array
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






    /**
     * Check if the territory is dead
     *
     * @return true or false
     */ 
    isDead(){

        // Get borders of the territory
        if(this.borderTerritory.length == 0){
            this.getBorders();
        }

        // Get liberties of the territory
        if(this.liberties == 0){
            this.getLiberties();
        }

        if(this.liberties == this.borderTerritory.length){
            return true;
        }
        else{
            return false;
        }

    }






    /**
     * Get liberties of the territories
     *
     * @return this.liberties (number)
     */ 
    getLiberties(){

        // Get borders of the territory
        if(this.borderTerritory.length == 0){
            this.getBorders();
        }

        this.liberties = 0;
        
        for(let rock of this.borderTerritory){
            let index = rock.lastIndexOf(';');
            let x = parseInt(rock.substr(0, index));
            let y = parseInt(rock.substring(index + 1));

            // Check if the rock has any liberties
            if(this.tab[`${x};${y - 1}`] != 0 &&
               this.tab[`${x + 1};${y}`] != 0 &&
               this.tab[`${x};${y + 1}`] != 0 &&
               this.tab[`${x - 1};${y}`] != 0)
            {
                this.liberties++;
            }
        }

        return this.liberties;

    }
}