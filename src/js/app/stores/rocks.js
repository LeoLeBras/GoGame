var rocks = [];

class Rock{



    /**
     * Constructor
     *
     * @param x and y (number)
     */   
    constructor(x, y){

        this.chain = 0;
        this.x = x;
        this.y = y;
        this.player = 0;
        this.color;
        this.cellSize = options['grid'].cellSize;
        this.rockSize = options['rock'].size;
        this.canvas = Sprint(options['gameplay'].element).dom[0].getContext('2d');
        this.chains;

    }




    
    /* ------------------------------------- */






    /**
     * Create a rock
     *
     */  
    create(player){

        // Set player
        this.player = player.get();

        // Set color
        this.color = options['rock'].player1;
        if(this.player == 2){
            this.color =  options['rock'].player2;
        }

        // Draw
        var c = this.canvas;
        c.beginPath();
        c.arc(this.x * this.cellSize, this.y * this.cellSize, this.rockSize / 2, 0, 2 * Math.PI, false);
        c.closePath();
        c.fillStyle = this.color;
        c.fill();
        
    }




    
    /* ------------------------------------- */






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

            if(rocks[x] != undefined && rocks[x][y] != undefined){
                let rock = rocks[x][y];
                if(rock.getPlayer() != 0){
                    this.cache.push(rock);
                }
            }
        }

        if(select != 'all'){
            let player = ((rocks[this.x][this.y].getPlayer() + 2) % 2) + 1;
            if(select == 'current'){
                player = rocks[this.x][this.y].getPlayer();
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




    
    /* ------------------------------------- */






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
