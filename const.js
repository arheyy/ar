var SPRITESHEET = new Image();
var SPRITESHEET_SRC = 'img/sprites.png';
var IMAGE_BACKGROUND = 'img/background1.png';
var IMAGE_BACK = 'img/back.png';

var BG_WIDTH = 1010;
var BG_HEIGHT = 660;

var PG_WIDTH = 800;
var PG_HEIGHT = 600;
var SIDEBAR_WIDTH = 150;

var DEVICE_KEYBOARD = 1;
var DEVICE_MOUSE = 2;

var LEFT = 1;
var RIGHT = 2;
var TOP = 3;
var BOT = 4;

var SAVE_DATA_KEY = 'arSaveData';

var DEFAULT_LIVES_AMOUNT = 3;

var LEVELS_COUNT = 2;
var LEVELS = [];

///////////////////////////////////////////////////////////////////////////

var BORDER = {
    size: 30,
    sprites: {
        TOP: { top: 0, left: 0, width: 30, height: 860 },
        BOT: { top: 0, left: 30, width: 30, height: 860 },
        LEFT: { top: 0, left: 60, width: 30, height: 600 },
        RIGHT: { top: 0, left: 90, width: 30, height: 600 }
    }
};

var SIDEBAR = {
    width: 150,
    height: 600,
    left: 860,
    top: 0,
    sprite: { top: 0, left: 120, width: 150, height: 600 }
}

var MESSAGES = {
    greeting: 'Arheynoid',
    pressStart: 'Нажмите новая игра'
};

// Шарик
var BALL = {
    defaultSpeed: 6,
    minSpeed: 2,
    maxSpeed: 20,
    deltaSpeed: 1,
    minStartAngel: 45 * Math.PI / 180,
    maxStartAngel: 135 * Math.PI / 180,
    minHorizontalAngelDelta: 10 * Math.PI / 180,
    defaultSize: 'normal',
    size: {
        small: 15,
        normal: 25,
        big: 35
    },
    sprites: {
        small: { top: 0, left: 70, width: 15, height: 15 },
        normal: { top: 0, left: 40, width: 25, height: 25 },
        big: { top: 0, left: 0, width: 35, height: 35 }
    }
};

// Палка ловилка
var PAD = {
    sizeWidth: 10,
    height: 29,
    maxSize: 20,
    minSize: 2,
    defaultSize: 10,
    moveDelta: 15,
    sprite: { width: 220, height: 29, top: 76, left: 0 }
};

// Бонусы
var BONUS = {
        speed: 4,
        size: 30,
        types: ['padIncrease', 'padDecrease', 'speedIncrease', 'speedDecrease', 'ballSmall', 'ballBig', 'ballReset', 'ballTriple'],
        sprites: {
            bonusCarcass: { width: 30, height: 30, top: 200, left: 0 },
            padIncrease: { width: 30, height: 30, top: 200, left: 30 },
            padDecrease: { width: 30, height: 30, top: 200, left: 60 },
            speedIncrease: { width: 30, height: 30, top: 200, left: 90 },
            speedDecrease: { width: 30, height: 30, top: 200, left: 120 },
            ballSmall: { width: 30, height: 30, top: 200, left: 150 },
            ballBig: { width: 30, height: 30, top: 200, left: 180 },
            ballReset: { width: 30, height: 30, top: 200, left: 210 },
            ballTriple: { width: 30, height: 30, top: 200, left: 240 }
        }
    }
    ;

// Кирпичи
var BRICK = {
    width: 50,
    height: 25,
    metalWallThickness: 7,
    lives: {
        0: 1,
        1: 2,
        2: 3,
        3: 1,
        4: 1
    },
    sprites: {
        bricks: {
            0: { width: 50, height: 25, top: 150, left: 0 },
            1: { width: 50, height: 25, top: 150, left: 50 },
            2: { width: 50, height: 25, top: 150, left: 100 },
            3: { width: 50, height: 25, top: 150, left: 150 },
            4: { width: 50, height: 25, top: 150, left: 200 }
        },
        broken: {
            0: { top: 175, width: 50, height: 25, left: 50 },
            1: { top: 175, width: 50, height: 25, left: 0 }
        },
        metalWalls: {
            0: { width: 50, height: 7, left: 0, top: 125 },
            1: { width: 7, height: 25, top: 125, left: 50 }
        }
    }
};

// Кнопки
var BUTTONS = {
    types: ['start', 'pause', 'save', 'load'],
    start: {
        left: 25,
        top: 10,
        height: 30,
        width: 100,
        label: 'Новая игра',
        sprite: { left: 0, top: 40, width: 100, height: 30 }
    },
    pause: {
        left: 25,
        top: 50,
        height: 30,
        width: 100,
        label: 'Пауза (P)',
        sprite: { left: 100, top: 40, width: 100, height: 30 }
    },
    save: {
        left: 25,
        top: 90,
        height: 30,
        width: 100,
        label: 'Сохранить',
        sprite: { left: 200, top: 40, width: 100, height: 30 }
    },
    load: {
        left: 25,
        top: 130,
        height: 30,
        width: 100,
        label: 'Загрузить',
        sprite: { left: 300, top: 40, width: 100, height: 30 }
    }
};
