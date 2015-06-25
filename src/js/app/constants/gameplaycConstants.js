/**
 * Gameplay constants
 *
 */  

 // Gameplay
const mode = 'rush';
const grid = 13;

// Selectors goban
const $goban = $('.Game_goban'); 
const $goban_grid = $('.Game_goban_grid');
const $goban_gameplay = $('.Game_goban_gameplay');

// Selector gameplay control
const $next = $('.Game_control_button.-next');
const $stop = $('.Game_control_button.-stop');

// Selector for select mode and player
const $wrapper = $('.Wrapper')
const $choicePlayers = $('.ChoosePlayer');
const $player = $('.ChoosePlayer_item');
const $player1 = $('.ChoosePlayer_item.-yellow');
const $player2 = $('.ChoosePlayer_item.-purple');
const $playerCurrent = $('.Game_control_currentPlayer');
const $choiceModes = $('.SelectMode');
const $choiceModes_minion = $('.SelectMode_minion');
const $rush = $('.SelectMode_item.-rush');
const $clash = $('.SelectMode_item.-clash');

// Social Networks
const $facebook = $('.Score_share_item.-facebook');
const $twitter = $('.Score_share_item.-twitter');

// Canvas goban
const $goban_gameplay_canvas = document.querySelector('.Game_goban_gameplay');
const $goban_grid_canvas = document.querySelector('.Game_goban_grid');

// Goban style
const cellSize = 40;
const gobanSize = (grid + 1) * cellSize;
const grid_border_width = 1;
const grid_border_color_purple = 'rgba(255,255,255,.3)';
const grid_border_color_yellow = 'rgba(0,0,0,.15)';
const rockSize = 24;
const rock_player1_color = '#ffd84e';
const rock_player1_color_dark = '#DDB316';
const rock_player2_color = '#966ad1';
const rock_player2_color_dark = '#6D479D';
