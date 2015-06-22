/**
 * Gameplay constants
 *
 */  
const mode = 'clash';
const $goban = $('.Game_goban'); 
const $goban_gameplay = $('.Game_goban_gameplay');
const $goban_gameplay_canvas = document.querySelector('.Game_goban_gameplay');
const $goban_grid = $('.Game_goban_grid');
const $goban_grid_canvas = document.querySelector('.Game_goban_grid');
const $next = $('.Game_control_next');
const $stop = $('.Game_controle_stop');
const grid = 13;
const cellSize = 40;
const gobanSize = (grid + 1) * cellSize;
const grid_border_width = 1;
const grid_border_color = '#B9B892';
const rockSize = 20;
const rock_player1_color = '#ffd84e';
const rock_player2_color = '#966ad1';
