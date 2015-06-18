class Rocks{


    /**
     * Constructor
     *
     */   
    constructor(){
        this.rocks = [];
    }





    /**
     * Select a rock
     *
     * @param rock (object) {x: x, y:y}
     * @return rock object selected ()
     */  
    select(rock){
        if(this.rocks[rock.x] != undefined && this.rocks[rock.x][rock.y] != undefined){
            return this.rocks[rock.x][rock.y];
        }
        return false; // If the rock doesn't exist
    }





    /**
     * Get all rocks
     *
     * @return rocks (array)
     */  
    get(){
        return this.rocks;
    }




    /**
     * Add a rock
     *
     * @param rock (object, format : {x: x, y:y})
     */  
    add(rock){
        if(this.rocks[rock.x] == undefined){
            this.rocks[rock.x] = [];
        }
        this.rocks[rock.x][rock.y] = new Rock(rock);
    }
}



class Rock{


    /**
     * Constructor
     *
     * @param rock (object, format : {x: .., y: ..})
     */   
    constructor(rock){
        this.chain = 0;
        this.x = rock.x;
        this.y = rock.y;
        this.player = 0;
    }





    /**
     * Add a rock
     *
     * @param player (number)
     */  
    add(player){
        this.player = player;
    }





    /**
     * Remove a rock
     *
     */  
    remove(){
        this.player = 0;
    }





    /**
     * Get the player 
     *
     * @return player (number)
     */  
    getPlayer(){  
        return this.player;
    }





    /**
     * Set chain 
     *
     * @param chain (number)
     */  
    setChain(chain){  
        this.chain = chain; 
    }





    /**
     * Get chain 
     *
     * @return chain (number)
     */  
    getChain(){  
        return this.chain;
    }





    /**
     * Get neighboring rocks
     *
     * @param select (string)
     * @return neighboring rocks (array)
     */  
    getNeighboringRocks(select = 'all'){

        this.neighboringRocks = [];
        this.cache = [];

        // Select neighboring intersections, empty or nor 
        // (depends of the param select)
        for(let i=1 ; i <= 4 ; i++){
            let x = this.x;
            let y = this.y;

            switch(i){
                case 1:
                    y = y - 1; // top
                    break;

                case 2:
                    x++; // right
                    break;

                case 3:
                    y++; // bottom
                    break;

                case 4:
                    x = x - 1; // left
                    break;
            }

            let rock = rocks.select({x, y});

            if((select != 'empty' && rock && rock.getPlayer() != 0) ||
               (select == 'empty' && rock && rock.getPlayer() == 0)){
                this.cache.push(rock);
            }
        }

        // Select rock of a particulary user
        // (depends of the param select)       
        if(select != 'all' && select != 'empty'){
            let player = select;
            if(typeof(select) == 'string'){
                player = ((this.getPlayer() + 2) % 2) + 1;
                if(select == 'current'){
                    player = this.getPlayer();
                }
            }
            this.neighboringRocks = [
                for(rock of this.cache)
                if(rock.getPlayer() == player)
                rock
            ];
        }
        else{
            this.neighboringRocks = this.cache;
        }

        return this.neighboringRocks.sort();

    }





    /**
     * Get liberties
     *
     * @return liberties
     */  
    getLiberties(param = 'count'){  
        let neighbors = this.getNeighboringRocks('empty');
        if(param == 'count'){
            return neighbors.length;
        }
        return neighbors;
    }
}



var rocks = new Rocks();