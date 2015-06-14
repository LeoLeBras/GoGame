function GoGame(){
    var GameBuilder = new Builder();
    GameBuilder.run();
    var GameGameplay = new Gameplay();
    GameGameplay.listenner();
}