class GameplayDispatcher{


    /**
     * Constructor
     *
     */  
    constructor(){
    	this.Gameplay = new GameplayActions();
        this.Save = new SaveActions();
        this.Score = new ScoreActions();
        this.AI = new gameplayRobotActions();
    	this.listenner();
    }





    /**
     * Update the gameplay
     *
     */  
    update(){
        this.Gameplay.updateChains();
        this.Gameplay.updateGoban();
        this.Save.update();
        this.Gameplay.switchPlayers();
    }





    /**
     * Listenner
     *
     */  
    listenner(){

        // Add a rock
    	$goban::on('click', (e) => {
            if(this.Gameplay.addRock(e)){
                this.update();

                // Artificial Intelligence
                if(mode == 'rush' &&
                   players.getCurrent().getName() == 2){
                    this.AI.play();
                    setTimeout(() => {
                        this.Gameplay.updateRock(this.AI.getLastRock())
                        this.update();
                    }, this.AI.getDelay() + 10);
                }
            }
        });

        // Switch player
        $next::on('click', () => {
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

        // Stop the gameplay
        $stop::on('click', () => {
            this.Gameplay.gameOver();
            this.Score.get();
        });

    }

}