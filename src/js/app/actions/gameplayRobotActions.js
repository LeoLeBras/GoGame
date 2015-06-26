class gameplayRobotActions extends GameplayActions{


    /**
     * Constructor
     *
     */   
    constructor(style){
        super(style);
        this.delay = 0;
    }





    /**
     * Initialyze
     *
     */  
    initialyze(){
        $('.Game_goban')::create(`$('.Wrapper')`;
        super.initialyze();
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





    /**
     * Play
     *
     */  
    play(){

        this.delay = Math.floor(Math.random() * 200) + 50;
        this.type = 'null';
        let i = 0;

        do{
            // CASE 1 : random (just at the begining and once in 20)
            let random = Math.floor(Math.random() * 18) + 1;
            if(players.getCurrent().getTour() < 2 || random == 14){
                this.x = Math.floor(Math.random() * grid) + 1;
                this.y = Math.floor(Math.random() * grid) + 1;
                this.type = 'random';
            }
            else{

                // Check type of last three actions
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
                    let response = this.collectRocks('current', 'in-danger', 'defensive');
                    if(response){
                        this.x = response.x;
                        this.y = response.y;
                        this.type = response.type;
                    }
                }

                // CASE 3 : Offensive strategy
                if(!(i == 3 && cache.length == 1 && cache[0] == 'offensive') &&
                    this.type != 'Offensive'){
                    let response = this.collectRocks('adversary', 'in-danger', 'offensive');
                    if(response){
                        this.x = response.x;
                        this.y = response.y;
                        this.type = response.type;
                    }
                }

                // CASE 4 : Sustainable strategy
                if(this.type != 'defensive' && this.type != 'offensive'){
                    let response = this.collectRocks('adversary', 'sustainable', 'sustainable');
                    if(response){
                        this.x = response.x;
                        this.y = response.y;
                        this.type = response.type;
                    }
                }

                // CASE 5 : Random
                if(this.type != 'defensive' && this.type != 'offensive' && this.type != 'sustainable'){
                    this.x = Math.floor(Math.random() * grid) + 1;
                    this.y = Math.floor(Math.random() * grid) + 1;
                    this.type = 'random';
                }
            }

            // To test if the boucle is not infinite
            i++;

        }while(!super.check() && i < 60); // Run while !Gameplay.check() (extends)
        
        if(this.type != 'null'){

            let rock = {
                x: this.x, 
                y: this.y
            };

            setTimeout(() => {
                super.x = this.x;
                super.y = this.y;
                super.addRock(rock, 'robot', this.type);
            }, this.delay);

            return true;
        }

        // CASE 6 : Nothing to do
        return false;


    }





    /**
     * Collect interresting rock to plau
     *
     * @param player (string)
     * @param type (string)
     * @return false or rock object
     */  
    collectRocks(player, select, type){
        let chainsOfPlayer = [];
        let cacheRocks = [];
        let cacheLiberties = 0;

        if(player == 'curent'){
            chainsOfPlayer = players.getCurrent().getChains();
        }
        else if(player == 'adversary'){
            chainsOfPlayer = players.getAdversary().getChains();
        }
        
        // Collected the rocks to protect // kill
        for(let chain of chainsOfPlayer){
            chain = chains.select(chain)
            let liberties = chain.getLiberties();

            // Set condition of the select
            let condition = liberties < 5 && chain.getBorders('count') > 2;
            if(select == 'sustainable'){
                condition = true;
                cacheLiberties = 9999; // infinite
            }

            if(condition){
                for(let rock of chain.getLiberties('objects')){
                    let rockLiberties = parseInt(rock.getLiberties());
                    
                    if(rockLiberties > 1){

                        // Save interesting rock
                        cacheRocks.push({
                            x: rock.x,
                            y: rock.y,
                            liberties: rockLiberties
                        });

                        // Minimum / Maximum liberties
                        condition = rockLiberties > parseInt(cacheLiberties);
                        if(select == 'sustainable'){
                            condition = rockLiberties < parseInt(cacheLiberties);
                        }
                        if(condition){
                            cacheLiberties = rockLiberties;
                        }

                    }
                }
            }
        }

        // Take the most interesting rock
        if(cacheRocks.length != 0){
            let rock = cacheRocks[Math.floor(Math.random() * (cacheRocks.length))];
            let i = 0;
            do{
                rock = cacheRocks[Math.floor(Math.random() * (cacheRocks.length))];    
                i++;
            }while(rock.liberties != cacheLiberties && i < 40);

            return{
                x: rock.x,
                y: rock.y,
                type: type
            };
        }

        return false;
    }
}
