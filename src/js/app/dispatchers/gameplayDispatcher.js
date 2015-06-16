class GameplayDispatcher{
	
    constructor(){
        this.$goban = Sprint(options['gameplay'].element);
        this.$next = Sprint(options['control'].next);
    	this.$stop = Sprint(options['control'].stop);
    	this.Gameplay = new GameplayActions();
        this.Save = new SaveActions();
        this.Score = new ScoreActions();
    	this.listenner();
    }


    listenner(){

    	Sprint(this.$goban).on('click', (e) => {
            if(this.Gameplay.addRock(e)){
            	this.Gameplay.updateChains();
            	this.Gameplay.updateGoban();
                this.Save.update();
                this.Gameplay.switchPlayers();
            }
        });

        Sprint(this.$next).on('click', () => {
            if(!this.Gameplay.isFinished({
                type: 'next',
                player: 'players.getCurrent()'
            })){
                this.Gameplay.switchPlayers('user');
            }
            else{
                this.Gameplay.gameOver();
                this.Score.get();
            }
        });

        Sprint(this.$stop).on('click', () => {
            this.Gameplay.gameOver();
            this.Score.get();
        });

    }

}