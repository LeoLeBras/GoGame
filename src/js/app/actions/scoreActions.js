class ScoreActions{


    /**
     * Constructor
     *
     */   
    constructor(){
        this.players = [];
        this.players[0] = {
            winner: 0
        }
        this.players[1] = {
            prisoners: 0,
            chains: 0,
            total: 0
        };
        this.players[2] = {
            prisoners: 0,
            chains: 0,
            total: 0
        };
    }




    /**
     * Update score
     *
     * @param response (array)
     */  
    update(response){
        for(let item of response){
            this.players[item.player].prisoners++;
        }
    }




    /**
     * Recover the score
     *
     * @return response (array)
     */  
    get(){
        this.players[1].chains = players.get(1).getChains().length;
        this.players[2].chains = players.get(2).getChains().length;
        this.players[1].total = this.players[1].chains + this.players[1].prisoners;
        this.players[2].total = this.players[2].chains + this.players[2].prisoners;
        if(this.players[2].total > this.players[1].total){
            this.players[0].winner = 2;
        }
        else if(this.players[2].total < this.players[1].total){
            this.players[0].winner = 1;
        }
    	return this.players;
    }
    
   
}