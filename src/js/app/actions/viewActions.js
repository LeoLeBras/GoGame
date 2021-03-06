class ViewActions{


    /**
     * Constructor
     *
     */   
    constructor(){
    	// ...
    }




    /**
     * Show select mode
     *
     */  
    showChoicePlayers(mode){
        const $rush = $('.SelectMode_item.-rush');
        const $clash = $('.SelectMode_item.-clash');
        const $help = $('.SelectMode_help');

        let $elClick = $clash;
        let $elDisappear = $rush;

        if(mode == 'rush'){
            $elClick = $rush;
            $elDisappear = $clash;
        }

    	Velocity($elDisappear[0], {
            opacity: .4
        });

        $elClick::addClass('is-active');

        setTimeout(() => {
            const $choiceModes_minion = $('.SelectMode_minion');
            Velocity($help,{
                opacity: 0
            });
            Velocity($choiceModes_minion[0], {
                top: '-100%'
            },{
                delay: 300,
                duration: 400
            }); 

            Velocity($elClick[0], {
                top: '-100%'
            },{
                delay: 500,
                duration: 400,
                complete: () => {

                    Velocity($('body')[0],{
                        backgroundColor: '#ffd850'
                    },{
                        delay: 400
                    });
                    const $choiceModes = $('.SelectMode');
                    $choiceModes::remove();
                    $wrapper::insert(`
                        <div class="ChoosePlayer" style="opacity:0">
                            <h1 style="top: -600px" class="ChoosePlayer_title">Choisis ton camp <span class="-yellow">Jaune</span> <span class="-italic">vs</span> <span class="-purple">Violet</span></h1>
                            <a href="#" class="ChoosePlayer_item -yellow" style="top: -100%"></a>
                            <a href="#" class="ChoosePlayer_item -purple" style="top: -100%"></a>
                        </div>
                    `);

                    const $choicePlayers = $('.ChoosePlayer');
                    const $player = $('.ChoosePlayer_item');
                    const $player1 = $('.ChoosePlayer_item.-yellow');
                    const $player2 = $('.ChoosePlayer_item.-purple');
                    const $choicePlayers_title = $('.ChoosePlayer_title');

                    Velocity($choicePlayers,{
                        opacity: 1
                    },{
                        delay: 400
                    });
                    
                    setTimeout(() => {
                        Velocity($player1,{
                            top: 0
                        },{
                            delay: 500
                        });

                        Velocity($player2,{
                            top: 0
                        },{
                            delay: 900
                        });

                        Velocity($choicePlayers_title,{
                            top: 0
                        },{
                            delay: 1300
                        });
                    });
                }
            }); 

            Velocity($elDisappear[0], {
                top: '-100%'
            },{
                delay: 160,
                duration: 400,
            });
        }, 600);
    }




    /**
     * Show goban
     *
     */  
    showGoban(player){

        const $choicePlayers = $('.ChoosePlayer');
        const $player = $('.ChoosePlayer_item');
        const $player1 = $('.ChoosePlayer_item.-yellow');
        const $player2 = $('.ChoosePlayer_item.-purple');
        const $choicePlayers_title = $('.ChoosePlayer_title');

        let $elClick = $player1;
        let $elDisappear = $player2;

        if(player == 'player2'){
            $elClick = $player2;
            $elDisappear = $player1;
        }   
        
        Velocity($choicePlayers_title,{
            translateY: '-200%'
        },{
            duration: 500
        });     

        Velocity($elDisappear,{
            top: '-100%'
        },{
            delay: 200,
            duration: 400
        });  

        let left = '50%';
        let translateY = '-50%';
        if(player == 'player2'){
            let left = '-50%';
            let translateY = '50%';

            Velocity($('body')[0],{
                backgroundColor: '#9669d1'
            })
        }

        Velocity($elClick,{
            left: left,
            translateX: translateY
        },{
            delay: 600,
            duration: 600,
            complete: () => {
                $elClick::addClass('is-active');

                setTimeout(() => {
                     Velocity($choicePlayers[0], {
                        opacity: 0
                     },{
                        complete: () => {
                            $choicePlayers::remove();
                            let className = 'yellow';
                            if(player == 'player2'){
                                className = 'purple';
                            }

                            if(player == 'player1'){
                                players.initialyze(1);
                            }
                            else{
                                players.initialyze(2);
                            }

                            $wrapper::insert(`
                                <div class="Game -${className}">
                                    <div class="Game_goban" style="margin-top: 150%">
                                        <canvas class="Game_goban_grid"></canvas>
                                        <canvas class="Game_goban_gameplay"></canvas>
                                    </div>
                                    <div class="Game_control" style="margin-top: 150%">
                                        <span class="Game_control_currentPlayer">Joueur ${players.getCurrent().getName()}</span>
                                        <a role="button" class="Game_control_button -next">Passer mon tour</a>
                                        <a role="button" class="Game_control_button -stop">Abandonner</a>
                                        <a role="button" class="Game_control_button -stop">Sauvegarder</a>
                                    </div>
                                </div>
                            `);

                            this.Builder = new BuilderActions(className);
                            this.Builder.run();

                            const $goban = $('.Game_goban'); 
                            const $control = $('.Game_control'); 

                            Velocity($goban, {
                                marginTop: 0
                            },{
                                duration: 400,
                                delay: 100
                            });

                            Velocity($control, {
                                marginTop: 0
                            },{
                                duration: 400,
                                delay: 200
                            });

                        }
                     });
                }, 900)
            }
        });
    }




    /**
     * Show score
     *
     * @param query (array)
     * @param user (number)
     */  
    showScore(query, user){
        const $goban = $('.Game_goban'); 
        const $control = $('.Game_control'); 

        Velocity($goban, {
            marginTop: '150%'
        },{
            duration: 400,
            delay: 100
        });

        Velocity($control, {
            marginTop: '150%'
        },{
            duration: 400,
            delay: 200,
            complete: () => {
                $('.Game')::remove();
            }
        });

        Velocity($('body')[0], {
            backgroundColor: '#fffed7'
        },{
            duration: 400,
            delay: 280
        });

        var type;
        if(query[0].winner == 0){
            type = '-equal';
        }
        else if(query[0].winner != user){
            type = '-loose';
        }

        $wrapper::insert(`
            <div class="Score" style="top: 150%">
                <div class="Score_minion ${type}"></div>
                <a class="Score_restart" style="margin-top: 102px;"></a>
                <div class="Score_players">
                    <div class="Score_player">
                        <h2 class="Score_player_title">Joueur 1</h2>
                        <ul class="Score_player_list">
                            <li class="Score_player_item">Pierres mangées: ${query[1].prisoners}</li>
                            <li class="Score_player_item">Territoire: ${query[1].chains}</li>
                        </ul>
                        <span class="Score_player_total">Total: ${query[1].total}</span>
                    </div>
                    <div class="Score_player">
                        <h2 class="Score_player_title">Joueur 2</h2>
                        <ul class="Score_player_list">
                            <li class="Score_player_item">Pierres mangées: ${query[2].prisoners}</li>
                            <li class="Score_player_item">Territoire: ${query[2].chains}</li>
                        </ul>
                        <span class="Score_player_total">Total: ${query[2].total}</span>
                    </div>
                </div>
                <div class="Score_share">
                    <span role="button" class="Score_share_item -twitter">Twitter</span>
                    <span role="button" href="" class="Score_share_item -facebook">Facebook</span>
                </div>
            </div>
        `);

        Velocity($('.Score')[0], {
            top: 0
        },{
            duration: 500,
            delay: 400,
            complete: () => {
                Velocity($('.Score_restart')[0],{
                    marginTop: 0,
                },{
                    duration: 280,
                    complete: () => {
                        $('.Score_restart')::css({
                            zIndex: 10
                        });
                    }
                })
            }
        })
    }




    /**
     * Show choice mode
     *
     */  
    showChoiceMode(){
        $('.Score_restart')::css({
            zIndex: -1
        });

        Velocity($('.Score_restart'),{
            marginTop: '102px'
        })

        Velocity($('.Score'),{
            top: '150%'
        },{
            delay: 500,
            complete: () => {
                $('.Score')::remove();
                Velocity($('body'), {
                    backgroundColor : '#fdd961'
                });
                $wrapper::insert(`
                    <div class="SelectMode">
                        <div class="SelectMode_item -rush" style="margin-top: 150%">Minion Rush <p>Envie de jouer entre amis au sein d'un mode multijouer ?</p></div>
                        <div class="SelectMode_item -clash" style="margin-top: 150%">Minion Clash <p>Tenterez-vous de combatre notre féroce intelligence artificielle ?</p></div>
                        <div class="SelectMode_minion" style="top: -150%"></div>
                        <div class="SelectMode_help">BESOINS D’AIDE DANS LE CHOIX DE VOTRE MODE ?</div>
                    </div>
                `);

                Velocity($('.SelectMode_minion'), {
                    top: '50%'
                });

                Velocity($('.SelectMode_item.-rush'), {
                    marginTop: 0
                },{
                    delay: 200
                });

                Velocity($('.SelectMode_item.-clash'), {
                    marginTop: 0
                },{
                    delay: 400
                });
            }
        })
    }




    /**
     * Switch players
     *
     */  
    switchPlayers(){
        const $playerCurrent = $('.Game_control_currentPlayer');
        $playerCurrent::text(`Joueur ${players.getCurrent().getName()}`);
    }




    /**
     * Share on facebook
     *
     * @param score (array)
     */  
    showFacebookShare(score){
        let url = 'minions.leolebras.com';
        window.open('http://www.facebook.com/sharer.php?s=100&p[title]=Nouveau score !&p[summary]=J’ai atteint ' + score[1].total + ' points sur minionsindagame.com : on parie que personne ne fait mieux ? Do or do not: there is no try! »&p[url]=' + url, 'sharer', 'width=700','height=450');
    }




    /**
     * Tweet on Twiter
     *
     * @param score (array)
     */  
    showTwitterShare(score){
        let url = 'minions.leolebras.com';
        window.open('https://twitter.com/intent/tweet?text=J’ai atteint ' + score[1].total + ' points sur ' + url + ' : on parie que personne ne fait mieux ? Do or do not: there is no try! »&source=webclient', 'Tweet your record', 'width=700, height=450');
    }
}