var PG_WIDTH = 800;
var CTRL_WIDTH = 150;
var CONTEXT_HEIGHT = 600;
var CONTEXT_WIDTH = PG_WIDTH + CTRL_WIDTH;

var DEFAULT_LIVES_AMOUNT = 3;

var SPRITESHEET = new Image();
var SPRITESHEET_SRC = 'img/sprites.png';
var SPRITE_BACKGROUND_1 = 'img/background1.png';

// Шарик
var BALL_SMALL_SIZE = 15;
var BALL_NORMAL_SIZE = 25;
var BALL_BIG_SIZE = 35;
var BALL_DEFAULT_SPEED = 6;
var BALL_MIN_SPEED = 2;
var BALL_MAX_SPEED = 20; // Если увеличить то надо менять алгоритм расчета столкновений с блоками
var BALL_SPEED_DELTA = 1;
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
var BONUS = {
        speed  : 4,
        size   : 30,
        types  : ['padIncrease', 'padDecrease', 'speedIncrease', 'speedDecrease', 'ballSmall', 'ballBig', 'ballReset', 'ballTriple'],
        sprites: {
            bonusCarcass : { width: 30, height: 30, top: 200, left: 0 },
            padIncrease  : { width: 30, height: 30, top: 200, left: 30 },
            padDecrease  : { width: 30, height: 30, top: 200, left: 60 },
            speedIncrease: { width: 30, height: 30, top: 200, left: 90 },
            speedDecrease: { width: 30, height: 30, top: 200, left: 120 },
            ballSmall    : { width: 30, height: 30, top: 200, left: 150 },
            ballBig      : { width: 30, height: 30, top: 200, left: 180 },
            ballReset    : { width: 30, height: 30, top: 200, left: 210 },
            ballTriple   : { width: 30, height: 30, top: 200, left: 240 }
        }
    }
    ;

// Кирпичи
var BRICK = {
    width  : 50,
    height : 25,
    metalWallThickness: 7,
    lives  : {
        0: 1,
        1: 2,
        2: 3,
        3: 1,
        4: 1
    },
    sprites: {
        bricks    : {
            0: { width: 50, height: 25, top: 150, left: 0 },
            1: { width: 50, height: 25, top: 150, left: 50 },
            2: { width: 50, height: 25, top: 150, left: 100 },
            3: { width: 50, height: 25, top: 150, left: 150 },
            4: { width: 50, height: 25, top: 150, left: 200 }
        },
        broken    : {
            0: { top: 175, width: 50, height: 25, left: 50 },
            1: { top: 175, width: 50, height: 25, left: 0 }
        },
        metalWalls: {
            0: { width: 50, height: 7, left: 0, top: 125 },
            1: { width: 7, height: 25, top: 125, left: 50 }
        }
    }
};

var DEVICE_KEYBOARD = 1;
var DEVICE_MOUSE = 2;

var LEFT = 1;
var RIGHT = 2;
var TOP = 3;
var BOT = 4;

var SAVE_DATA_KEY = 'arSaveData';

var LEVELS_COUNT = 2;
var LEVELS = [];

var BUTTON_TYPE_START = 1;
var BUTTON_TYPE_PAUSE = 2;
var BUTTON_TYPE_SAVE = 3;
var BUTTON_TYPE_LOAD = 4;
var BUTTON_WIDTH = 100;
var BUTTON_HEIGHT = 30;
var BUTTONS_LEFT = 825;

var BUTTONS_TOP = [];
BUTTONS_TOP[BUTTON_TYPE_START] = 10;
BUTTONS_TOP[BUTTON_TYPE_PAUSE] = 50;
BUTTONS_TOP[BUTTON_TYPE_SAVE] = 90;
BUTTONS_TOP[BUTTON_TYPE_LOAD] = 130;

var BUTTONS_LABEL = [];
BUTTONS_LABEL[BUTTON_TYPE_START] = 'Новая игра';
BUTTONS_LABEL[BUTTON_TYPE_PAUSE] = 'Пауза (P)';
BUTTONS_LABEL[BUTTON_TYPE_SAVE] = 'Сохранить';
BUTTONS_LABEL[BUTTON_TYPE_LOAD] = 'Загрузить';

var MESSAGE_GREETING = 'Arheynoid';
var MESSAGE_PRESS_START = 'Нажмите новая игра';

///////////////////////////////////////////////////////////////////
var SPRITE_BUTTONS = [];
SPRITE_BUTTONS[BUTTON_TYPE_START] = { left: 0, top: 40, width: BUTTON_WIDTH, height: BUTTON_HEIGHT };
SPRITE_BUTTONS[BUTTON_TYPE_PAUSE] = { left: 100, top: 40, width: BUTTON_WIDTH, height: BUTTON_HEIGHT };
SPRITE_BUTTONS[BUTTON_TYPE_SAVE] = { left: 200, top: 40, width: BUTTON_WIDTH, height: BUTTON_HEIGHT };
SPRITE_BUTTONS[BUTTON_TYPE_LOAD] = { left: 300, top: 40, width: BUTTON_WIDTH, height: BUTTON_HEIGHT };

var SPRITE_BALL = [];
SPRITE_BALL[BALL_SMALL_SIZE] = { left: 70, top: 0, width: BALL_SMALL_SIZE, height: BALL_SMALL_SIZE };
SPRITE_BALL[BALL_NORMAL_SIZE] = { left: 40, top: 0, width: BALL_NORMAL_SIZE, height: BALL_NORMAL_SIZE };
SPRITE_BALL[BALL_BIG_SIZE] = { left: 0, top: 0, width: BALL_BIG_SIZE, height: BALL_BIG_SIZE };

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