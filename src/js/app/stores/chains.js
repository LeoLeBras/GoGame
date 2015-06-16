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
     * Get all chains
     *
     * @return this.chains
     */  
    get(){
        return this.chains;
    }




    /**
     * Join 2 chains
     *
     */  
    join(joinChain, chain){
        this.chains[joinChain].rocks.push(...this.chains[chain].rocks);
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

        this.border = [];

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
    getLiberties(param = 'count'){

        this.liberties = [];
        this.cache = [];
        let cache = '';

        for(let rock of this.getBorders(rocks)){

            for(let object of rocks.select(rock).getLiberties('objects')){
                cache = `${object.x};${object.y}`
                if(this.cache.indexOf(cache) == -1){
                    this.liberties.push(object);
                    this.cache.push(cache);
                }
            }
        }     

        if(param == 'count'){
            return this.liberties.length;
        }    
        return this.liberties;

    }
}

var chains = new Chains();