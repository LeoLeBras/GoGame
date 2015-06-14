var player = 'dd';

class Player{


    /**
     * Constructor
     *
     * @param name of the current player
     */   
    constructor(player){
        this.name = 1;
        if(player == 'ennemy'){
            this.name = 2;
        }
    }




    /**
     * Switch to the next player
     *
     */  
    next(){
        this.name = ((this.name++) % 2) + 1;
    }




    /**
     * Get player
     *
     * @return this.name
     */  
    get(select = 'current'){
    	return this.name;
    }

        
}