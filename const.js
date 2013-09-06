var SPRITE_SHEET_SRC = 'img/sprites.png';

var SPRITE_BACKGROUND_1 = 'img/background1.png';

// Типы объектов
var OBJECT_TYPE_BALL = 'ball';
var OBJECT_TYPE_PAD = 'pad';
var OBJECT_TYPE_BONUS = 'bonus';
var OBJECT_TYPE_BRICK = 'brick';

// Шарик
var BALL_NORMAL_SIZE = 25;
var BALL_BIG_SIZE = 50;
var BALL_DEFAULT_SPEED = 5;
var BALL_MIN_SPEED = 2;
var BALL_MAX_SPEED = 20; // Если увеличить то надо менять алгоритм расчета столкновений с блоками
var BALL_SPEED_DELTA = 1;
var BALL_TOP = 100;
var BALL_START_ANGEL_MIN = 45 * Math.PI / 180;
var BALL_START_ANGEL_MAX = 135 * Math.PI / 180;
var BALL_MIN_HORIZONTAL_ANGEL_DELTA = 10 * Math.PI / 180;

// Палка
var PAD_CORNER_WIDTH = 10;
var PAD_MIDDLE_WIDTH = 10;
var PAD_HEIGHT = 20;
var PAD_DEFAULT_SIZE = 8;
var PAD_MAX_SIZE = 20;
var PAD_MOVE_DELTA = 15;
var PAD_MIN_SIZE = 0;

// Бонусы
var BONUS_SPEED = 2;
var BONUS_SIZE = 25;
var BONUS_TYPE_PAD_INCREASE = 1;
var BONUS_TYPE_PAD_DECREASE = 2;
var BONUS_TYPE_SPEED_INCREASE = 3;
var BONUS_TYPE_SPEED_DECREASE = 4;
var BONUS_TYPE_TRIPLE_BALL = 5;

// Кирпичи
var BRICK_WIDTH = 50;
var BRICK_HEIGHT = 25;
var BRICK_DEFAULT_LIVES = 1;
var BRICK_DEFAULT_COLOR = 'fake';
var BRICK_COLORS = ['green', 'blue', 'yellow', 'purple'];

var METALL_WALL_WIDTH = 50;
var METALL_WALL_HEIGHT = 10;

var DEVICE_KEYBOARD = 1;
var DEVICE_MOUSE = 2;

var LEFT = 1;
var RIGHT = 2;

var SAVE_DATA_KEY = 'arSaveData';

var LEVELS_COUNT = 2;
var LEVELS = [];

//var DEBUG_STOP_ON_FRAME = false;
//var DEBUG_STOP_ON_FRAME = 1;

///////////////////////////////////////////////////////////////////

var SPRITE_ARRAY_BALL_BIG = [
    { left: 0, top: 0, width: BONUS_SIZE, height: BONUS_SIZE },
    { left: 50, top: 0, width: BONUS_SIZE, height: BONUS_SIZE },
    { left: 100, top: 0, width: BONUS_SIZE, height: BONUS_SIZE },
    { left: 150, top: 0, width: BONUS_SIZE, height: BONUS_SIZE },
    { left: 200, top: 0, width: BONUS_SIZE, height: BONUS_SIZE }
];

var SPRITE_METALL_WALL = [
    { left: 0, top: 125, width: METALL_WALL_WIDTH, height: METALL_WALL_HEIGHT }
];

var SPRITE_ARRAY_BALL_NORMAL = [
    { left: 0, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 25, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 50, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 75, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 100, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 125, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 150, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 175, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 200, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 225, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 250, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 275, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 300, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 325, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 350, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 375, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 400, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 425, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 450, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 475, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 500, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 525, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 550, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 575, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE }
];

var SPRITE_ARRAY_BONUS_TYPE_PAD_INCREASE = [
    { left: 0, top: 0, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 25, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 50, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 75, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 100, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 125, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 150, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 175, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 200, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 225, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 250, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 275, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 300, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 325, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 350, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 375, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 400, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 425, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 450, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 475, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 500, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 525, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 550, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE },
    { left: 575, top: 50, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE }
];

var SPRITE_ARRAY_BRICK_1 = [
    { left: 0, top: 100, width: BRICK_WIDTH, height: BRICK_HEIGHT },
];

var SPRITE_ARRAY_PAD = {
    leftCorner : {
        left: 0, top: 80, width: PAD_CORNER_WIDTH, height: PAD_HEIGHT
    },
    rightCorner: {
        left: 20, top: 80, width: PAD_CORNER_WIDTH, height: PAD_HEIGHT
    },
    middle     : {
        left: 10, top: 80, width: PAD_MIDDLE_WIDTH, height: PAD_HEIGHT
    }
};