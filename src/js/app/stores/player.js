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
        this.name = player;
        this.historic = [];
        this.historic[0], this.historic[1], this.historic[2] = {
            type: ''
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
     * Update historic
     *
     * @param action (object)
     */  
    updateHistoric(action){
        this.historic[0] = this.historic[1];
        this.historic[1] = this.historic[2];
        this.historic[2] = action;
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
}



var players = new Players();