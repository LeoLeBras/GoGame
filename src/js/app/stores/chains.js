class Chains{


    /**
     * Constructor
     *
     */   
    constructor(){
        this.chains = [];
    }




    /**
     * Select a chain
     *
     * @param chain (chain)
     * @return chain object selected (array)
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
     * Count chains
     *
     * @return this.chains.length
     */  
    count(){
        return this.chains.length;
    }




    /**
     * Add a chain
     *
     * @param chain (number)
     */  
    add(chain){
        this.chains[chain] = new Chain(chain);
    }




    /**
     * Join 2 chains
     *
     * @param joinChain (number)
     * @param chain (number)
     */  
    join(joinChain, chain){
        this.chains[joinChain].rocks.push(...this.chains[chain].rocks);
    }
}



class Chain{


    /**
     * Constructor
     *
     */   
    constructor(name){
        this.name = name;
        this.state = 'alive';
        this.rocks = [];
        this.border = [];
        this.territory = [];
        this.cache = [];
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
     * Add rock
     *
     */  
    addRock(rock){
        this.rocks.push(rock);
    }




    /**
     * Get rocks
     *
     * @return this.rocks
     */  
    getRocks(){
        return this.rocks.sort();
    }




    /**
     * Return the border of the chain
     *
     * @param param (string, default : 'objects')
     * @return this.border (array or number)
     */ 
    getBorders(param = 'objects'){

        // Select the rocks not completely surrounded by the current
        // player (player who created this chain).
        this.border = [
            for(rock of this.rocks)
            if(rocks.select({x: rock.x, y: rock.y}).getNeighboringRocks(rocks, 'current').length != 4)
            rock    
        ];

        if(param == 'count'){
            return this.border.length;
        }
        return this.border.sort();

    }




    /**
     * Get liberties of the chain
     *
     * @param param (string, default : 'count')     
     * @return this.liberties (number)
     */ 
    getLiberties(param = 'count'){

        // Add the liberties of each rock of the border of this chain
        // to get liberties of this chain (with removing doublons).
        this.liberties = [];
        let cache;  this.cache = []; // Use to detect doublons
        for(let rock of this.getBorders(rocks)){
            for(let object of rocks.select(rock).getLiberties('objects')){
                cache = `${object.x};${object.y}`;
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