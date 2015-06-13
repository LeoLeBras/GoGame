class Game{

    /**
     * Init options
     *
     * @param array options (optional)
     * @return 
     */     
    constructor(){
    }






    /**
     * Run the game
     *
     */  
    run(){

        // Builder
        var GameBuilder = new Builder();
        GameBuilder.run();

        // Gameplay
        var GameGameplay = new Gameplay();
        GameGameplay.listenner();

    }
}