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
     * Check if we are in a case of suicide
     *
     */  
    checkSuicide(){
        return false;
    }






    /**
     * Check if we are in a case of KO
     *
     */  
    checkKO(){
        return false;
    }





    /**
     * Check if the player can play here
     *
     */  
    canPlay(player, tab){

        if(!this.checkSuicide() && !this.checkKO() && this.getPlayer() == 0){
            return true;
        }
        else{
            return false;
        }

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
     * Get neighboring intersections
     *
     * @param tab (array)
     * @return neighboring intersections (array)
     */  
    getNeighboringIntersections(tab, player = 'all'){

        this.neighboringIntersections = [];
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

            if(tab[x] != undefined && tab[x][y] != undefined){
                let rock = tab[x][y];
                if(rock.getPlayer() != 0){
                    this.cache.push(rock);
                }
            }
        }

        switch(player){
            case 'current':
                player = tab[this.x][this.y].getPlayer();
                break;
            case 'ennemy':
                player = ((tab[this.x][this.y].getPlayer() + 2) % 2) + 1;
                break;
        }

        if(player != 'all'){
            for(let i in this.cache){
                let rock = this.cache[i];
                if(rock.getPlayer() == player){
                    this.neighboringIntersections.push(rock);
                }
            }
        }
        else{
            this.neighboringIntersections = this.cache;
        }

        return this.neighboringIntersections.sort();

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
