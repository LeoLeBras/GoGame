 /**
  * Minions in da’ game, brotha 😎
  * Raphaëlle Limoges, Alexandra Cossid, Charles Mangwa et Léo Le Bras
  * HETIC P2019
  *
  * Work with ES6+ (with babel transpileler)
  *
  * Copyright 2012, 2014
  * Released under the MIT license
  * http://opensource.org/licenses/MIT
  *
  * Date of creation : 2015-05-19
  */

// Import the app
import Game from "./app/index.js";

// Set options
var options = {
    goban: {
        element: '.Game_goban',
    },
    gameplay: {
        element: '.Game_goban_gameplay',
    },
    grid: {
        nbre: '19',
        element: '.Game_goban_grid',
        cellSize: 40,
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
    },
    rock:{
        size: 15,
        player1Color : 'grey',
        player2Color : 'black',
    }
};

// Initialize and run the game
var GoGame = new Game(options);
GoGame.run();