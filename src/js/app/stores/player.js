class Players{


    /**
     * Constructor
     *
     */   
    constructor(){
        this.current = 1;
        this.players = [];
        this.players[1] = new Player(1);
        this.players[2] = new Player(2);
    }





    /**
     * Initialyze
     *
     */  
    initialyze(player){
        this.current = player;
    }




    /**
     * Get the current player
     *
     * @return current player (object)
     */  
    getCurrent(){
        return this.players[this.current];
    }




    /**
     * Get the adversary of the current player
     *
     * @return adversary player (object)
     */  
    getAdversary(){
        return this.players[((this.current + 2) % 2) + 1];
    }




    /**
     * Get the player by id
     *
     * @return id (number)
     */  
    get(id){
        return this.players[id];
    }




    /**
     * Switch player
     *
     */  
    switch(){
        this.current = ((this.current++) % 2) + 1;
    }
}



class Player{


    /**
     * Constructor
     *
     * @param name of the current player
     */   
    constructor(player){
        this.chains = [];
        this.tour = 0;
        this.name = player;
        this.historic = [];
        this.historic[0], this.historic[1], this.historic[2] = {
            type: '',
        };
    }




    /**
     * Get player
     *
     * @return name (number)
     */  
    getName(){
        return this.name;
    }




    /**
     * Get tour
     *
     * @return tour (number)
     */  
    getTour(){
        return this.tour;
    }




    /**
     * Update historic
     *
     * @param action (object)
     */  
    updateHistoric(action){
        this.historic[0] = this.historic[1];
        this.historic[1] = this.historic[2];
        this.historic[2] = action;
        this.tour++;
    }




    /**
     * Get historic
     *
     */  
    getHistoric(index = 'all'){
        
        let response = this.historic;
        if(index == 'last'){
            response = this.historic[2];
        }

        return response;

    }




    /**
     * Get chains
     *
     */  
    getChains(){
        
        this.chains = [];
        for(let chain of chains.get()){
            if(chain.getPlayer() == players.getCurrent().getName()){
                this.chains.push(chain.getName());
            }
        }

        return this.chains;

    }
}



var players = new Players();