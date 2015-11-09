var PLAYER_ROTATION_SPEED = 200;
var PLAYER_MOVEMENT_SPEED = 300; // 100
var PLAYER_LIVES = 2;
var SLOW_BULLET_SPEED = 160;
var FAST_BULLET_SPEED = 320;
var PLAYER_BULLET_LIMIT = 3;
var PLAYER_BULLET_SPEED = 360; // 160
var PLAYER_RICOCHET = 1;
var GAME_WIDTH = 1200;
var GAME_HEIGHT = 800;
var WALL_WIDTH = 40;
var WALL_HEIGHT = 40;


var O_PLAYER_ROTATION_SPEED = 200;
var O_PLAYER_MOVEMENT_SPEED = 100;
var O_PLAYER_BULLET_LIMIT = 2;
var O_PLAYER_BULLET_SPEED = 160;
var O_PLAYER_LIVES = 2;

function restoreConfig () {
	PLAYER_ROTATION_SPEED = O_PLAYER_ROTATION_SPEED;
	PLAYER_MOVEMENT_SPEED = O_PLAYER_MOVEMENT_SPEED;
	PLAYER_BULLET_LIMIT = O_PLAYER_BULLET_LIMIT;
	PLAYER_BULLET_SPEED = O_PLAYER_BULLET_SPEED;
	PLAYER_LIVES = O_PLAYER_LIVES;
}