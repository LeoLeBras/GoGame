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

        this.tab = [];
        this.chains = [];
        this.cache = [];

        for(this.x= 1; this.x <= this.grid ; this.x++){
            this.tab[this.x] = [];
            for(this.y = 1; this.y <= this.grid ; this.y++){
                this.tab[this.x][this.y] = new Rock(this.x, this.y);
            }
        }
        
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

        // If we are on the goban
        if(1 <= this.x && this.x <= this.grid && 1 <= this.y && this.y <= this.grid ){
            this.getRock();

            // If the rock can be placed here, handle actions
            if(this.rock.canPlay(this.player, this.tab)){
                
                // Debug
                console.log('****');
                console.log(`Player ${this.player.get()} en ${this.x};${this.y}`);

                this.rock.create(this.player);
                this.setRock();
                this.handleChains();
                this.handleGoban();
                this.player.next();
                this.ennemy.next();

            }
        }
    }




    
    /* ------------------------------------- */






    /**
     * Save this.rock in this.tab
     *
     */  
    setRock(){
        this.tab[this.x][this.y] = this.rock;
    }





    /**
     * Use this.rock instead of this.tab[this.x][this.y]
     *
     */  
    getRock(){
        this.rock = this.tab[this.x][this.y];
    }




    
    /* ------------------------------------- */






    /**
     * Handle the chains
     *
     */  
    handleChains(){

        console.log(this.chains);

        var neighboringIntersections = this.rock.getNeighboringIntersections(this.tab, 'current');
        var currentRock = {
            x: this.rock.x,
            y: this.rock.y
        };

        if(neighboringIntersections != 0){
            
            // Get chains of the current player around the current rock            
            let chains = [];
            for(let rock of neighboringIntersections){
                if(chains.indexOf(rock.getChain()) == -1){
                    chains.push(rock.getChain());
                }
            }

            this.getRock();

            // Add the rock to the chain
            if(chains.length == 1){
                let chain = chains[0]
                this.rock.setChain(chain);
                this.chains[chain].push(currentRock);
            }

            // Join chains
            else{
                chains = chains.sort();
                let joinChain = chains[0];
                this.chains[joinChain].push(currentRock);
                for(let chain of chains.reverse()){
                    if(chain != joinChain){
                        for(let rock of this.chains[chain]){
                            this.tab[rock.x][rock.y].setChain(joinChain);
                            this.chains[joinChain].push(rock);
                        }   
                        this.chains.splice(chain, 1);
                    }
                }
            }
        }

        // Create new chain
        else{
            let chain = this.chains.length;
            this.rock.setChain(chain);
            this.chains[chain] = [];
            this.chains[chain].push(currentRock);
        }

        this.setRock();
        console.log(this.chains);
    }





    /**
     * Handle the goban with the new territories
     *
     */  
    handleGoban(){
/*
        if(this.rock.touchEnnemyNeighbors()){

            let chains = [];

            // Tiny chains (delete boublon)
            for(let rock of this.rock.getEnemyNeighbors()){
                if(this.cache.indexOf(this.rock) == -1){
                    chains.push(this.rock.getChain());
                }
                else{
                    this.cache.push(this.rock.getChain());
                }
            }   

            console.log(chains);
        }*/
    }

/*

        // Chek if there are ennemies around the last rock placed
        if(
            this.tab[this.x][this.y - 1] == this.enemy ||
            this.tab[this.x + 1][this.y] == this.enemy ||
            this.tab[this.x][this.y + 1] == this.enemy ||
            this.tab[this.x - 1][this.y] == this.enemy)
        {

            // Return the territory of the neighbors 
            if(this.tab[this.x][this.y - 1] == this.enemy){
                this.territory['top'] = new Territory(this.tab, this.enemy, this.x, this.y - 1);
            }
            if(this.tab[this.x + 1][this.y] == this.enemy){
                this.territory['right'] = new Territory(this.tab, this.enemy, this.x + 1, this.y);
            }
            if(this.tab[this.x][this.y + 1] == this.enemy){
                this.territory['bottom'] = new Territory(this.tab, this.enemy, this.x, this.y + 1);
            }
            if(this.tab[this.x - 1][this.y] == this.enemy){
                this.territory['left'] = new Territory(this.tab, this.enemy, this.x - 1, this.y);
            } 

            // Tiny territories (delete boublon)
            this.cache = [];
            this.territories = [];
            for(let i in this.territory){
                let territory = this.territory[i];
                if(this.cache.indexOf(JSON.stringify(territory.get())) == -1){
                    this.territories.push(territory);
                    this.cache.push(JSON.stringify(territory.get()));
                }
            }

            // Verification of encirclement territories
            for(let territory of this.territories){
                // The territory is circled
                if(territory.isDead()){

                    // Deubg
                    console.log('**');
                    console.log(`Enemy territory circled by player ${this.player} !`);
                    console.log(territory.get());

                }
            }
        }
    }*/
}
