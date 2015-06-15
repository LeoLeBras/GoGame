class GameplayDispatcher{
	
    constructor(){
    	this.$goban = Sprint(options['gameplay'].element);
    	this.Gameplay = new GameplayActions();
    	this.listenner();
    }


    listenner(){

    	Sprint(this.$goban).on('click', (e) =>{
            if(this.Gameplay.addRock(e)){
            	this.Gameplay.updateChains();
            	this.Gameplay.updateGoban();
            	this.Gameplay.switchPlayers();
            }
        }, this);

    }

}