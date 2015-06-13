class Chains{


    /**
     * Constructor
     *
     * @param name of the current player
     */   
    constructor(current = 1){
        this.name = current;
    }




    /**
     * Next player
     *
     */  
    next(){
    	this.name = ((this.player++) % 2) + 1;
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