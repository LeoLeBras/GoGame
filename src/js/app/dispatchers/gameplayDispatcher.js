class GameplayDispatcher{


    /**
     * Constructor
     *
     */  
    constructor(){
        this.$goban = Sprint(options['gameplay'].element);
        this.$next = Sprint(options['control'].next);
    	this.$stop = Sprint(options['control'].stop);
    	this.Gameplay = new GameplayActions();
        this.Save = new SaveActions();
        this.Score = new ScoreActions();
        this.AI = new gameplayRobotActions();
    	this.listenner();
    }

    update(){
        this.Gameplay.updateChains();
        this.Gameplay.updateGoban();
        this.Save.update();
        this.Gameplay.switchPlayers();
    }


    listenner(){
    	Sprint(this.$goban).on('click', (e) => {
            if(this.Gameplay.addRock(e)){
                this.update();

                // Artificial Intelligence
                /*if(mode == 'rush' &&
                   players.getCurrent().getName() == 2){
                    this.AI.play();
                    setTimeout(() => {
                        this.update();
                    }, this.AI.getDelay());
                }*/
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