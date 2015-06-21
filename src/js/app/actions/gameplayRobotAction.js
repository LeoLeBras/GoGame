class gameplayRobotActions extends GameplayActions{


    /**
     * Constructor
     *
     */   
    constructor(){
        super();
    }





    /**
     * Play
     *
     */  
    play(){

        this.delay = Math.floor(Math.random() * 200) + 100;
        this.delay = 0;
        let type = 'random';

        do{
            // CASE 1 : random (just at the begining)
            if(players.getCurrent().getTour() < 2){
                this.x = Math.floor(Math.random() * grid) + 1;
                this.y = Math.floor(Math.random() * grid) + 1;
            }
            else{

                // Check type of last three action
                let cache = [];
                let i = 0;
                for(let item of players.getCurrent().getHistoric()){
                    if(item != undefined &&
                       item.params != undefined &&
                       item.params.type != undefined){
                        i++;
                        if(cache.indexOf(item.params.type) == -1){
                            cache.push(item.params.type);
                        }
                    }
                }

                // CASE 2 : Defensive strategy
                if(!(i == 3 && cache.length == 1 && cache[0] == 'defensive')){
                    let chainsOfPlayer = players.getCurrent().getChains();
                    let cache = [];

                    // Collected the rocks to protect
                    for(let chain of chainsOfPlayer){
                        chain = chains.select(chain)
                        let liberties = chain.getLiberties();
                        if(liberties < 4 && chain.getBorders('count') > 2){
                            for(let rock of chain.getLiberties('objects')){
                                if(rock.getLiberties()) < 3){
                                    cache.push({
                                        x: rock.x,
                                        y: rock.y
                                    });
                                }
                            }
                        }
                    }
                    if(cache.length != 0){
                        let rock = cache[Math.floor(Math.random() * (cache.length)) + 0];
                        this.x = rock.x;
                        this.y = rock.y;
                        type = 'defensive';
                    }
                }

                // CASE 3 : Offensive strategy
                if(type != 'defensive' &&
                   !(i == 3 && cache.length == 1 && cache[0] == 'offensive')){
                        this.x = Math.floor(Math.random() * grid) + 1;
                        this.y = Math.floor(Math.random() * grid) + 1;
                        type = 'offensive';
                }

                // CASE 4 : Sustainable strategy
                else if(type != 'defensive'){
                    this.x = Math.floor(Math.random() * grid) + 1;
                    this.y = Math.floor(Math.random() * grid) + 1;
                    type = 'sustainable';
                }
            }
        }while(!super.check());

        console.log(`Strategy : ${type}`);

        let rock = {
            x: this.x, 
            y: this.y
        };

        setTimeout(() => {
            super.x = this.x;
            super.y = this.y;
            super.addRock(rock, 'robot', type);
        }, this.delay);

    }





    /**
     * Get delay (use for the dispatcher to update the gameplay)
     *
     * @return delay (number)
     */  

    getDelay(){
        return this.delay;
    }





    /**
     * Get current rock
     *
     * @return rock (object)
     */  
    getLastRock(){
        return {x: this.x, y:this.y};
    }
}
