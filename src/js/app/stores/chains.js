var chains = [];

class Chain{


    /**
     * Constructor
     *
     */   
    constructor(){
        this.rocks = [];
        this.border = [];
        this.territory = [];
        this.state = 'alive';
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
     * Remove a chain
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
    getBorders(param = 'objects'){

        var player = rocks[this.rocks[0].x][this.rocks[0].y].getPlayer();

        for(let rock of this.rocks){
            if(rocks[rock.x][rock.y].getNeighboringRocks(rocks, 'current').length != 4){
                this.border.push(rock);
            }
        }

        if(param == 'count'){
            return this.border.length;
        }

        return this.border.sort();

    }






    /**
     * Get liberties of the territories
     *
     * @return this.liberties (number)
     */ 
    getLiberties(param = 'objects'){

        // Get borders of the territory
        this.liberties = 0;
        
        for(let rock of this.getBorders(rocks)){
            //this.liberties += rocks[rock.x][rock.y].getLiberties();
        }

        console.log(this.liberties);

        return this.liberties;

    }

}