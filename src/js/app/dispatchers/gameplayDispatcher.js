class GameplayDispatcher{


    /**
     * Constructor
     *
     */  
    constructor(){
        this.Builder = new BuilderActions();
    	this.Gameplay = new GameplayActions();
        this.Gameplay.initialyze('purple');
        this.Builder.run('purple');
        this.Save = new SaveActions();
        this.Score = new ScoreActions();
        this.AI = new gameplayRobotActions();
        this.View = new ViewActions();
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
        this.View.switchPlayers();
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

                    // If the AI find something to do
                    if(this.AI.play()){
                        setTimeout(() => {
                            this.Gameplay.setRock(this.AI.getLastRock())
                            this.update();
                        }, this.AI.getDelay());
                    }

                    // Artificial intelligence passes his turn
                    else{
                        $next::trigger('click');
                    }

                }
            }
        });

        // Switch player
        $next::on('click', () => {
            console.log('next');
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

        // Select player
        $player::on('click', () => {
        });

        // Select mode "RUSH"
        $rush::on('click', () => {
            this.View.showChoicePlayers('rush');
        });

        // Select mode "CLASH"
        $clash::on('click', () => {
            this.View.showChoicePlayers('clash');
            setTimeout(() => {
                const $player1 = $('.ChoosePlayer_item.-yellow');
                const $player2 = $('.ChoosePlayer_item.-purple');

                // Select player 1
                $player1::on('click', () => {
                    this.View.showGoban('player1');
                });

                // Select player 2
                $player2::on('click', () => {
                    this.View.showGoban('player2');
                });
            },3000);
        });

        $facebook::on('click', () => {
            this.View.showFacebookShare();
        });

        $twitter::on('click', () => {
            this.View.showTwitterShare();
        });
    }
}