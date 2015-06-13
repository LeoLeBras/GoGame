class Chain{


    /**
     * Constructor
     *
     * @param name of the current player
     */   
    constructor(){
        this.rocks = [];
        this.state = 'alive';
        this.borders = [];
    }




    /**
     * Add rock
     *
     */  
    addRock(rock){
    	this.rocks.push(rock);
    }




    /**
     * Get rocks
     *
     */  
    getRocks(){
        return this.rocks.sort();
    }




    /**
     * Remove
     *
     */  
    remove(){
        this.rocks = [];
        this.state = 'dead';
    }





    /**
     * Return borders of the chain
     *
     * @return array
     */ 
    getBorders(rocks){

        var player = rocks[this.rocks[0].x][this.rocks[0].y].getPlayer();

        for(let rock of this.rocks){
            if(rocks[rock.x][rock.y].getNeighboringIntersections(rocks, 'current').length != 4){
                this.borders.push(rock);
            }
        }

        return this.borders.sort();

    }






    /**
     * Check if the territory is dead
     *
     * @return true or false
     */ 
    isDead(rocks){

        this.getLiberties(rocks);

        if(this.liberties == 0){
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
    getLiberties(rocks){

        // Get borders of the territory
        this.liberties = 0;
        
        for(let rock of this.getBorders(rocks)){
            if(rocks[rock.x][rock.y].getNeighboringIntersections(rocks).length != 4){
                this.liberties++;
            }
        }

        console.log(this.liberties);

        return this.liberties;

    }

}