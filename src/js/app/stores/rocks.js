class Rocks{

    /**
     * Constructor
     *
     */   
    constructor(){
        this.rocks = [];
    }






    /**
     * Add a rock
     *
     * @param rock (object) {x: x, y:y}
     */  
    add(rock){
        if(this.rocks[rock.x] == undefined){
            this.rocks[rock.x] = [];
        }
        this.rocks[rock.x][rock.y] = new Rock(rock);
    }






    /**
     * Select a rock
     *
     * @param rock (object) {x: x, y:y}
     * @return rock object selected
     */  
    select(rock){
        if(this.rocks[rock.x] != undefined && this.rocks[rock.x][rock.y] != undefined){
            return this.rocks[rock.x][rock.y];
        }
        return false;
    }


}

class Rock{



    /**
     * Constructor
     *
     * @param x and y (number)
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
     */  
    add(player){
        this.player = player.get();
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

            if(rock && rock.getPlayer() != 0){
                this.cache.push(rock);
            }
        }

        if(select != 'all'){
            let player = ((this.getPlayer() + 2) % 2) + 1;
            if(select == 'current'){
                player = this.getPlayer();
            }

            for(let i in this.cache){
                let rock = this.cache[i];
                if(rock.getPlayer() == player){
                    this.neighboringRocks.push(rock);
                }
            }
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
    getLiberties(){  
        return (4 - this.getNeighboringRocks().length);
    }






    /**
     * Get the player 
     *
     * @return this.player
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
     * @return this.chain
     */  
    getChain(){  
        return this.chain;
    }


}

var rocks = new Rocks();
