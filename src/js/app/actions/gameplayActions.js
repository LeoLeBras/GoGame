class GameplayActions{


    /**
     * Constructor
     *
     */   
    constructor(style){
        this.style = style;
        for(this.x= 1; this.x <= grid ; this.x++){
            for(this.y = 1; this.y <= grid ; this.y++){
                rocks.add({
                    x : this.x,
                    y : this.y
                });
            }
        }
    }





    /**
     * Initialyze
     *
     */  
    initialyze(){
        const $goban_gameplay_canvas = document.querySelector('.Game_goban_gameplay');
        this.canvas = $goban_gameplay_canvas.getContext('2d');
    }





    /* ******************************************* */





    /**
     * Add a rock of goban
     *
     * @param e: position of the rock (object)
     * @param origin (string)
     * @return response: true or false, depend if the rock was added (boolean)
     */  
    addRock(e, origin = 'human', type = null){

        // Set current rock
        if(origin == 'human'){
            this.x = Math.floor((e.layerX + cellSize / 2) / cellSize);
            this.y = Math.floor((e.layerY + cellSize / 2) / cellSize);
        }
        else{
            this.x = e.x;
            this.y = e.y;
        }

        // If the player can play here (the test is before done if it's a robot who did the actio)
        if(
           (origin == 'robot') ||
           (this.check()))
        {


            // Save
            this.getRock().add(players.getCurrent().getName());

            // Update the historic
            players.getCurrent().updateHistoric({
                type: 'add-rock',
                params: {
                    x: this.x,
                    y: this.y,
                    type: type
                }
            });

            // Set color
            let color = rock_player1_color_dark;
            if(players.getCurrent().getName() == 2){
                color =  rock_player2_color;
            }

            if(this.style == "purple"){
                color = rock_player1_color;
                if(players.getCurrent().getName() == 2){
                    color =  rock_player2_color_dark;
                }
            }

            // Draw the rock
            var c = this.canvas;
            c.beginPath();
            c.arc(this.x * cellSize, this.y * cellSize, rockSize / 2, 0, 2 * Math.PI, false);
            c.closePath();
            c.fillStyle = color;
            c.fill();

            // The rock was created
            return true;
        }

        return false;
    }





    /**
     * Get object of the current rock
     *
     * @parma type (string)
     * @return rock (object)
     */  
    getRock(type = 'complete'){

        let rock = {
            x: this.x, 
            y: this.y
        }

        if(type == 'simple'){
            return rock;
        }

        return rocks.select(rock);

    }





    /* ******************************************* */





    /**
     * Check if the player is on a case of KO
     *
     * @return response (boolean)
     */  
    checkKO(){

        let response = false;

        // Get historic of the player and test it
        let item = players.getCurrent().getHistoric('last');
        if(item.type == 'add-rock' &&
           item.params.x == this.x &&
           item.params.y == this.y){
            response = true;
        }

        return response;

    }





    /**
     * Check if the player is on a case of suicide
     *
     * @return response (boolean)
     */  
    checkSuicide(){

        let response = false;
        let neighbors = this.getRock().getNeighboringRocks(players.getAdversary().getName());
        let count = 0;
        this.cache = [];

        // Get chains of neighbors (adversary player)
        for(let neighbor of neighbors){
            if(this.cache.indexOf(neighbor.getChain()) == -1){
                this.cache.push(neighbor.getChain());
            }
        }

        // Test if the player kills an adversary chain 
        for(let item of this.cache){
            if(chains.select(item).getLiberties() == 1){
                let rock = chains.select(item).getLiberties('objects')[0];
                if(rock.x == this.x && rock.y == this.y){
                    count++;
                }
            }
        }

        // If the player not kill any chains
        if(count == 0){
            neighbors = this.getRock().getNeighboringRocks(players.getCurrent().getName());
            this.cache = [];

            // Get chains of neighbors (current player)
            for(let neighbor of neighbors){
                if(this.cache.indexOf(neighbor.getChain()) == -1){
                    this.cache.push(neighbor.getChain());
                }
            }

            // Check if we are on border of the goban
            let possibleNeighbors = 4;
            if(this.x == 1 || this.y == 1 || this.x == grid || this.y == grid){
                // In corner ?
                if((this.x == 1 && this.y == 1) ||
                   (this.x == grid && this.y == grid) ||
                   (this.x == 1 && this.y == grid) ||
                   (this.x == grid && this.y == 1)){
                    possibleNeighbors = 2;
                }
                else{
                    possibleNeighbors = 3;
                }
            }

            if(this.cache.length !=  0){
                count = 0;
                let rock = chains.select(this.cache[0]).getLiberties('objects')[0];

                // Count chain who have just on liberties
                for(let chain of this.cache){
                    if(chains.select(chain).getLiberties() == 1){
                        count++;
                    }
                }

                // Check if it's a suicide
                if(count == this.cache.length &&
                   rock.x == this.x && rock.y == this.y &&
                   rock.getNeighboringRocks().length == possibleNeighbors){
                    response = true;
                }
            }
            else if(this.getRock().getNeighboringRocks(players.getAdversary().getName()).length == possibleNeighbors){
                response = true;
            }   
        }

        return response;

    }





    /**
     * Check if the player can play on {this.x, this.y}
     *
     * @return response (boolean)
     */  
    check(){
        if(1 <= this.x && this.x <= grid && 1 <= this.y && this.y <= grid &&
           this.getRock().getPlayer() == 0 &&
           !this.checkSuicide() &&
           !this.checkKO()){
            return true;
        }
        return false;
    }




    /* ******************************************* */




    /**
     * Switch players
     *
     */  
    switchPlayers(origin = 'dispatcher'){

        // Update historic if click on $next
        if(origin == 'user'){
            players.getCurrent().updateHistoric({
                type: 'next',
            });
        }

        players.switch();

    }






    /**
     * Check if the game is finised
     *
     * @return response (boolean)
     */  
    isFinished(action = null){

        let response = false;

        // Test if the game is over
        if(action != null &&
           action.type == 'next' &&
           players.getAdversary().getHistoric('last').type == 'next'){
            response = true;
        }

        return response;

    }





    /**
     * Game Over
     *
     */  
    gameOver(){
        alert('Game Over ! :/');
    }





    /* ******************************************* */





    /**
     * Update rock
     *
     * @param rock (object)
     */  
    setRock(rock){
        this.x = rock.x;
        this.y = rock.y;
    }






    /**
     * Update chains
     *
     */  
    updateChains(){

        // Get neighbors
        var neighbors = this.getRock().getNeighboringRocks('current');

        if(neighbors.length != 0){
            
            // Get chains from neighborings intersections        
            let chainsOfNeighbors = [];
            for(let rock of neighbors){
                if(chainsOfNeighbors.indexOf(rock.getChain()) == -1){
                    chainsOfNeighbors.push(rock.getChain());
                }
            }

            // CASE 1 : Add the rock to the chain
            if(chainsOfNeighbors.length == 1){
                var chain = chainsOfNeighbors[0]; // Set index of the chain
            }

            // CASE 2 : Join chains
            else{
                chainsOfNeighbors = chainsOfNeighbors.sort();
                let joinChain = chainsOfNeighbors[0];
                for(let chain of chainsOfNeighbors.reverse()){
                    if(chain != joinChain){
                        for(let rock of chains.select(chain).getRocks()){
                            rocks.select(rock).setChain(joinChain);
                        }   
                        chains.join(joinChain, chain);
                        chains.select(chain).remove();
                    }
                }

                var chain = joinChain; // Set index of the chain
            }
        }

        // CASE 3 : Create new chain
        else{
            var chain = chains.count();
            chains.add(chain);
        }

        // Add current rock to the chain
        chains.select(chain).addRock(this.getRock('simple'));
        this.getRock().setChain(chain);

    }





    /**
     * Handle the goban with the update of chains
     *
     * @return response (array)
     */  
    updateGoban(){

        let neighbors = this.getRock().getNeighboringRocks('ennemy');
        let response = [];

        if(neighbors.length != 0){

            // Get chains of neighbors
            let chainsOfNeighbors = [];
            for(let rock of neighbors){
                if(chainsOfNeighbors.indexOf(rock.getChain()) == -1){
                    chainsOfNeighbors.push(rock.getChain());
                }
            }

            // Check is the chains is dead
            for(let chain of chainsOfNeighbors){
                if(chains.select(chain).getLiberties() == 0){
                    for(let rock of chains.select(chain).getRocks()){
                        let x = rock.x * cellSize - 1 - rockSize / 2;
                        let y = rock.y * cellSize - 1 - rockSize / 2;
                        this.canvas.clearRect(x,y,rockSize + 2, rockSize + 2);
                        rocks.select(rock).remove();
                        response.push({x: rock.x, y: rock.y, player: players.getCurrent().getName()});
                    }
                }
            }
        }

        return response;
    }
}
