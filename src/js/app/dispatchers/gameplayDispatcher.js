class GameplayDispatcher{
	
    constructor(){
    	this.$goban = Sprint(options['gameplay'].element);
    	var Gameplay = new GameplayActions();
    	this.listenner();
    }


    listenner(){

    	Sprint(this.$goban).on('click', function(e){
            if(Gameplay.click(e)){
            	Gameplay.handleChain();
            	Gameplay.handleGoban();
            	Gameplay.switchPlayers();
            }
        }.bind(this));

    }

}