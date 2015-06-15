class Chains{

    /**
     * Constructor
     *
     */   
    constructor(){
        this.chains = [];
    }






    /**
     * Add a chain
     *
     * @param chain (string)
     */  
    add(chain){
        this.chains[chain] = new Chain(chain);
    }






    /**
     * Select a chain
     *
     * @param chain (chain)
     * @return chain object selected
     */  
    select(chain){
        return this.chains[chain];
    }






    /**
     * Count chains
     *
     * @return this.chains.length
     */  
    count(){
        return this.chains.length;
    }


}

class Chain{


    /**
     * Constructor
     *
     */   
    constructor(name){
        this.rocks = [];
        this.border = [];
        this.territory = [];
        this.name = name;
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

        for(let rock of this.rocks){
            if(rocks.select({x: rock.x, y: rock.y}).getNeighboringRocks(rocks, 'current').length != 4){
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

        this.liberties = 0;
        for(let rock of this.getBorders(rocks)){
            this.liberties += rocks.select(rock).getLiberties();
        }
        return this.liberties;

    }
}

var chains = new Chains();