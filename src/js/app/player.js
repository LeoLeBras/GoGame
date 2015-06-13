class Player{


    /**
     * Constructor
     *
     * @param name of the current player
     */   
    constructor(player){
        switch(player){
            case 'current': 
                this.name = 1;
                break;
            case 'ennemy': 
                this.name = 2;
                break;
        }
    }




    /**
     * Next player
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
    get(){
    	return this.name;
    }

        
}