class GameplayDispatcher{


    /**
     * Constructor
     *
     */  
    constructor(){
        this.Save = new SaveActions();
        this.Score = new ScoreActions();
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

        // Select mode "RUSH"
        const $rush = $('.SelectMode_item.-rush');
        $rush::on('click', () => {
            this.View.showChoicePlayers('rush');
            this.initialyzePlayers('rush');
        });

        // Select mode "CLASH"
        const $clash = $('.SelectMode_item.-clash');
        $clash::on('click', () => {
            this.View.showChoicePlayers('clash');
            this.initialyzePlayers('clash');
        });
        
    }





    /**
     * Initialyze players
     *
     */  
     initialyzePlayers(modeSelect){
        setTimeout(() => {
            const $player1 = $('.ChoosePlayer_item.-yellow');
            const $player2 = $('.ChoosePlayer_item.-purple');

            // Select player 1
            $player1::on('click', () => {
                this.View.showGoban('player1', modeSelect);
                this.initialyzeGameplay('player1', modeSelect);
            });

            // Select player 2
            $player2::on('click', () => {
                this.View.showGoban('player2', modeSelect);
                this.initialyzeGameplay('player2', modeSelect);
            });
        }, 3000);
     }





    /**
     * Initialyze the gameplay
     *
     */  
    initialyzeGameplay(player, modeSelect){
        let color = 'yellow';
        if(player == 'player2'){
            color = 'purple';
        }
        const mode = modeSelect;        

        setTimeout(() => {
            this.Gameplay = new GameplayActions(color);
            this.Gameplay.initialyze();
            if(mode == 'clash'){
                this.AI = new gameplayRobotActions(color);
                this.AI.initialyze();
            }

            // Add a rock
            const $goban = $('.Game_goban'); 
            $goban::on('click', (e) => {
                if(this.Gameplay.addRock(e)){
                    this.update();

                    // Artificial Intelligence
                    if(mode == 'clash' &&
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

            // Stop the gameplay
            const $stop = $('.Game_control_button.-stop');
            $stop::on('click', () => {
                this.initialyzeScore();
            });

            // Switch player
            const $next = $('.Game_control_button.-next');
            $next::on('click', () => {
                if(!this.Gameplay.isFinished({
                    type: 'next',
                    player: 'players.getCurrent()'
                })){
                    this.Gameplay.switchPlayers('user');
                    this.View.switchPlayers();
                }
                else{
                    this.initialyzeScore();
                }
            });
        },3300);
    }





    /**
     * Initialyze the score
     *
     */     
    initialyzeScore(player){
        this.View.showScore();

        const $facebook = $('.Score_share_item.-facebook');
        const $twitter = $('.Score_share_item.-twitter');
        const $reload = $('.Score_restart');

        $facebook::on('click', () => {
            this.View.showFacebookShare();
        });

        $twitter::on('click', () => {
            this.View.showTwitterShare();
        });

        $reload::on('click', () => {
            this.View.showChoiceMode();
            setTimeout(() => {
                this.listenner();
            }, 1900);
        });
    }
}