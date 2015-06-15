class GameplayActions{

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

        this.cache = [];

        for(this.x= 1; this.x <= this.grid ; this.x++){
            for(this.y = 1; this.y <= this.grid ; this.y++){
                rocks.add({
                    x : this.x,
                    y : this.y
                });
            }
        }
    }





    /**
     * Switch players
     *
     */  
    switchPlayers(){
        this.player.next();
        this.ennemy.next();
    }






    /**
     * Get object of the current rock
     *
     * @parma type (string)
     * @return rock (object)
     */  
    getRock(type = 'complete'){

        let rock = {
            x: this.x, 
            y: this.y
        }

        if(type == 'simple'){
            return rock;
        }

        return rocks.select(rock);

    }






    /**
     * The player click on the goban to put a rock
     *
     */  
    addRock(e){

        // Set current rock
        this.x = Math.floor((e.layerX + this.cellSize / 2) / this.cellSize);
        this.y = Math.floor((e.layerY + this.cellSize / 2) / this.cellSize);

        // If the player can play here
        if(1 <= this.x && this.x <= this.grid && 1 <= this.y && this.y <= this.grid && this.getRock().getPlayer() == 0){

            // Debug
            console.log('****');
            console.log(`Player ${this.player.get()} en ${this.x};${this.y}`);

            this.getRock().add(this.player);

            let color = options['rock'].player1;
            if(this.player.get() == 2){
                color =  options['rock'].player2;
            }

            var c = this.canvas;
            c.beginPath();
            c.arc(this.x * this.cellSize, this.y * this.cellSize, this.rockSize / 2, 0, 2 * Math.PI, false);
            c.closePath();
            c.fillStyle = color;
            c.fill();

            return true;
        }

        return false;
    }






    /**
     * Update chains
     *
     */  
    updateChains(){

        // Get neighbors
        var neighbors = this.getRock().getNeighboringRocks('current');

        if(neighbors.length != 0){
            
            // Get chains from neighborings intersections        
            let chainsOfNeighbors = [];
            for(let rock of neighbors){
                if(chainsOfNeighbors.indexOf(rock.getChain()) == -1){
                    chainsOfNeighbors.push(rock.getChain());
                }
            }

            // CASE 1 : Add the rock to the chain
            if(chainsOfNeighbors.length == 1){
                var chain = chainsOfNeighbors[0]; // Set index of the chain
            }

            // CASE 2 : Join chains
            else{
                chainsOfNeighbors = chainsOfNeighbors.sort();
                let joinChain = chainsOfNeighbors[0];
                for(let chain of chainsOfNeighbors.reverse()){
                    if(chain != joinChain){
                        for(let rock of chains.select(chain).getRocks()){
                            rocks.select(rock).setChain(joinChain);
                            chains.select(joinChain).addRock(rock);
                        }   
                        chains.select(chain).remove();
                    }
                }

                var chain = joinChain; // Set index of the chain
            }
        }

        // CASE 3 : Create new chain
        else{
            var chain = chains.count();
            chains.add(chain);
        }

        // Add current rock to the chain
        chains.select(chain).addRock(this.getRock('simple'));
        this.getRock().setChain(chain);

    }





    /**
     * Handle the goban with the update of chains
     *
     */  
    updateGoban(){

        let neighbors = this.getRock().getNeighboringRocks('ennemy');

        if(neighbors.length != 0){
            
            // Get chains from neighborings intersections        
            let chainsOfNeighbors = [];
            for(let rock of neighbors){
                if(chainsOfNeighbors.indexOf(rock.getChain()) == -1){
                    chainsOfNeighbors.push(rock.getChain());
                }
            }

            for(let chain of chainsOfNeighbors){
                if(chains.select(chain).getLiberties() == 0){
                    console.log(`Remove chain ${chain}`);
                    for(let rock of chains.select(chain).getRocks()){
                        //this.tab[rock.x][rock.y].remove();
                    }
                }
            }
        }
    }
}