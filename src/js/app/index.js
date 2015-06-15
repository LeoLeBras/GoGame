function GoGame(){

    var GameBuilder = new Builder();
    GameBuilder.run();
    var Gameplay = new GameplayDispatcher();
    Gameplay.listenner();
}