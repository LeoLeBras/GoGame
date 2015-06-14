class Gameplay{

    /**
     * Constructor
     *
     * @param array options
     */   
    constructor(){

        this.$goban = Sprint(options['gameplay'].element);
        this.canvas = this.$goban.dom[0].getContext('2d');
        
        this.grid = options['grid'].nbre;
        this.cellSize = options['grid'].cellSize;

        this.rock;
        this.rockSize = options['rock'].size;
        this.rockPlayer1 = options['rock'].player1;
        this.rockPlayer2 = options['rock'].player2;

        this.player = new Player('current');
        this.ennemy = new Player('ennemy');

        this.chains = [];
        this.cache = [];

        for(this.x= 1; this.x <= this.grid ; this.x++){
            rocks[this.x] = [];
            for(this.y = 1; this.y <= this.grid ; this.y++){
                rocks[this.x][this.y] = new Rock(this.x, this.y);
            }
        }
        
    }


switchPlayers(){

            this.player.next();
            this.ennemy.next();
}


    
    /* ------------------------------------- */






    /**
     * Listen event on the gameplay (dispatcher)
     *
     */  
    listenner(){

        // Click on the goban
        Sprint(this.$goban).on('click', function(e){
            this.click(e);
        }.bind(this));

    }






    /**
     * The player click on the goban to put a rock
     *
     */  
    click(e){

        // Set current rock
        this.x = Math.floor((e.layerX + this.cellSize / 2) / this.cellSize);
        this.y = Math.floor((e.layerY + this.cellSize / 2) / this.cellSize);

        // If the player can play here
        if(1 <= this.x && this.x <= this.grid && 1 <= this.y && this.y <= this.grid && rocks[this.x][this.y].getPlayer() == 0){

            // Debug
            console.log('****');
            console.log(`Player ${this.player.get()} en ${this.x};${this.y}`);

            rocks[this.x][this.y].create(this.player);
            this.handleChains();
            this.handleGoban();
            this.switchPlayers();

        }
    }




    
    /* ------------------------------------- */






    /**
     * Handle chains
     *
     */  
    handleChains(){

        // Get neighbors
        var neighbors = rocks[this.x][this.y].getNeighboringRocks('current');

        if(neighbors.length != 0){
            
            // Get chains from neighborings intersections        
            let chains = [];
            for(let rock of neighbors){
                if(chains.indexOf(rock.getChain()) == -1){
                    chains.push(rock.getChain());
                }
            }

            // CASE 1 : Add the rock to the chain
            if(chains.length == 1){
                var chain = chains[0]; // Set index of the chain
            }

            // CASE 2 : Join chains
            else{
                chains = chains.sort();
                let joinChain = chains[0];
                for(let chain of chains.reverse()){
                    if(chain != joinChain){
                        for(let rock of this.chains[chain].getRocks()){
                            rocks[rock.x][rock.y].setChain(joinChain);
                            this.chains[joinChain].addRock(rock);
                        }   
                        this.chains[chain].remove();
                    }
                }

                var chain = joinChain; // Set index of the chain
            }
        }

        // CASE 3 : Create new chain
        else{
            var chain = this.chains.length; // Set index of the chain
            this.chains[chain] = new Chain(); // Create new chain object
        }

        // Add current rock to the chain
        var rock = {
            x: this.x,
            y: this.y
        };        
        this.chains[chain].addRock(rock);
        rocks[this.x][this.y].setChain(chain);

    }





    /**
     * Handle the goban with the new chain
     *
     */  
    handleGoban(){

        var neighbors = rocks[this.x][this.y].getNeighboringRocks('ennemy');

        if(neighbors.length != 0){
            
            // Get chains from neighborings intersections        
            let chains = [];
            for(let rock of neighbors){
                if(chains.indexOf(rock.getChain()) == -1){
                    chains.push(rock.getChain());
                }
            }

            for(let chain of chains){
                if(this.chains[chain].getLiberties() == 0){
                    console.log('Dead');
                    for(let rock of this.chains[chain].getRocks()){
                        //this.tab[rock.x][rock.y].remove();
                    }
                }
            }
        }
    }
}
