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
        let response = this.Gameplay.updateGoban();
        this.Score.update(response);
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

        // Click on helper
        const $modes_help = $('.SelectMode_help');
        $modes_help::on('click', () => {
            if($clash::hasClass('is-helped')){
                $clash::removeClass('is-helped');
                $rush::removeClass('is-helped');
            }
            else{
                $clash::addClass('is-helped');
                $rush::addClass('is-helped');
            }
        })

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
                const player_human = 1;
                this.View.showGoban('player1', modeSelect, 1);
                this.initialyzeGameplay('player1', modeSelect, 1);
            });

            // Select player 2
            $player2::on('click', () => {
                this.View.showGoban('player2', modeSelect, 2);
                this.initialyzeGameplay('player2', modeSelect, 2);
            });
        }, 3000);
     }





    /**
     * Initialyze the gameplay
     *
     */  
    initialyzeGameplay(player, modeSelect, user){
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
                       players.getCurrent().getName() != user){

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
                this.initialyzeScore(user);
            });

            // Stop the gameplay
            const $save = $('.Game_control_button.-save');
            $save::on('click', () => {
                this.Save().update();
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
                    this.initialyzeScore(user);
                }
            });
        },3300);
    }





    /**
     * Initialyze the score
     *
     */     
    initialyzeScore(player){
        let score = this.Score.get();
        this.View.showScore(score, player);

        const $facebook = $('.Score_share_item.-facebook');
        const $twitter = $('.Score_share_item.-twitter');
        const $reload = $('.Score_restart');

        $facebook::on('click', () => {
            this.View.showFacebookShare(score);
        });

        $twitter::on('click', () => {
            this.View.showTwitterShare(score);
        });

        $reload::on('click', () => {
            this.View.showChoiceMode();
            setTimeout(() => {
                this.listenner();
            }, 1900);
        });
    }
}