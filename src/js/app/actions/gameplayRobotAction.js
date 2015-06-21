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

        do{
            this.x = Math.floor(Math.random() * 18) + 2;
            this.y = Math.floor(Math.random() * 18) + 2;
        }while(!super.check());

        let rock = {
            x: this.x, 
            y: this.y
        };


        setTimeout(() => {
            super.addRock(rock, 'robot');
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
}
