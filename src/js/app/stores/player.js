class Players{

    constructor(){
        this.current = 1;
        this.players = [];
        this.players[1] = new Player(1);
        this.players[2] = new Player(2);
    }

    getCurrent(){
        return this.players[this.current];
    }

    getAdversary(){
        return this.players[((this.current + 2) % 2) + 1];
    }

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
        this.historic[0] = {
            type: '',
        };
        this.historic[1] = this.historic[0];
        this.historic[2] = this.historic[1];
    }




    /**
     * Get player
     *
     * @return this.name
     */  
    getName(){
        return this.name;
    }




    /**
     * Update historic
     *
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
        
        let response = '';

        switch(index){
            case 'all' :
                response = this.historic;
                break;
            case 'last' : 
                response = this.historic[2];
                break;
        }

        return response;

    }
        
}

var players = new Players();