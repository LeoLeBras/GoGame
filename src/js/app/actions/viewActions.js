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

                            $wrapper::insert(`
                                <div class="Game -${className}">
                                    <div class="Game_goban" style="margin-top: 150%">
                                        <canvas class="Game_goban_grid"></canvas>
                                        <canvas class="Game_goban_gameplay"></canvas>
                                    </div>
                                    <div class="Game_control" style="margin-top: 150%">
                                        <span class="Game_control_currentPlayer">Joueur 2</span>
                                        <span class="Game_control_timer">00:34</span>
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
     * Switch players
     *
     */  
    switchPlayers(){
        $playerCurrent::text(`Joueur ${players.getCurrent().getName()}`);
    }




    /**
     * Share on facebook
     *
     */  
    showFacebookShare(){
        let url = 'minions.leolebras.com';
        window.open('http://www.facebook.com/sharer.php?s=100&p[title]=Nouveau score !&p[summary]=J’ai atteint 522 points sur minionsindagame.com : on parie que personne ne fait mieux ? Do or do not: there is no try! »&p[url]=' + url, 'sharer', 'width=700','height=450');
    }




    /**
     * Tweet on Twiter
     *
     */  
    showTwitterShare(){
        let url = 'minions.leolebras.com';
        window.open('https://twitter.com/intent/tweet?text=J’ai atteint 200 points sur ' + url + ' : on parie que personne ne fait mieux ? Do or do not: there is no try! »&source=webclient', 'Tweet your record', 'width=700, height=450');
    }
}