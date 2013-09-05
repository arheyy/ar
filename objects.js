var Ball = function (options) {
    this.type = OBJECT_TYPE_BALL;
    this.width = BALL_NORMAL_SIZE;
    this.height = BALL_NORMAL_SIZE;
    this.speed = options.speed || BALL_DEFAULT_SPEED;

//    options.ang = Math.PI * 145 / 180;

    this.left = options.left;
    this.top = options.top;
    this.setAng(options.ang || rand(BALL_START_ANGEL_MIN, BALL_START_ANGEL_MAX));

//    this.speed = 2;
//    this.left = 330;
//    this.top = 251;
//    this.setAng(135 * Math.PI / 180);
//    this.ang = 135 * Math.PI / 180;
//    this.dx = -10;
//    this.dy = -10;


    this.visible = true;

    this.artist = new SpriteSheetArtist(SPRITE_SHEET, SPRITE_ARRAY_BALL_NORMAL);
    this.behaviors = [
        moveBallBehavior,
        new CycleBehavior(100, 0)
    ];

    this.sprite = new Sprite(this);
};

Ball.prototype = {

    calcDxDy: function () {
        this.dx = this.speed * Math.cos(this.ang);
        this.dy = -this.speed * Math.sin(this.ang);
    },

    draw: function (context) {
        this.sprite.draw.call(this, context);
//        var data = this.getData();
//        context.beginPath();
//        context.strokeStyle = '#ff0000';
//        context.moveTo(data.x, data.y);
//        context.lineTo(data.x + 100 * this.dx, data.y + 100 * this.dy);
//        context.stroke();
    },

    update: function (time, fps) {
        this.sprite.update.call(this, time, fps);
    },

    invertYDirection: function () {
        this.setAng(2 * Math.PI - this.ang);
    },

    invertXDirection: function () {
        if (this.dy > 0) {
            this.setAng(3 * Math.PI - this.ang);
        } else {
            this.setAng(Math.PI - this.ang);
        }
    },

    isSideWallCollision: function () {
        return (this.left + this.dx < 0 && this.dx < 0) || (this.left + this.dx + this.width > ar.contextWidth && this.dx > 0);
    },

    isTopWallCollision: function () {
        return this.top + this.dy < 0 && this.dy < 0;
    },

    isBotWallCollision: function () {
        return this.top + this.dy + this.height > ar.contextHeight && this.dy > 0;
    },

    move: function () {
        this.left += this.dx;
        this.top += this.dy;
    },

    setSpeed: function (speed) {
        this.speed = speed;
        this.calcDxDy();
    },

    correctAng: function (ang) {

//        if (ang < BALL_MIN_HORIZONTAL_ANGEL_DELTA) {
//            ang = BALL_MIN_HORIZONTAL_ANGEL_DELTA;
//        }
//
//        if (Math.PI - ang < BALL_MIN_HORIZONTAL_ANGEL_DELTA) {
//            ang = Math.PI - BALL_MIN_HORIZONTAL_ANGEL_DELTA;
//        }
//
//
//        if (ang - Math.PI < BALL_MIN_HORIZONTAL_ANGEL_DELTA) {
//            ang = Math.PI + BALL_MIN_HORIZONTAL_ANGEL_DELTA;
//        }
//
//        if (2 * Math.PI - ang < BALL_MIN_HORIZONTAL_ANGEL_DELTA) {
//            ang = 2 * Math.PI - BALL_MIN_HORIZONTAL_ANGEL_DELTA;
//        }

    },

    simplify: function (ang) {
        if (ang > 2 * Math.PI) {
            ang = ang - 2 * Math.PI;
        }
        return ang;

    },

    setAng: function (ang) {
        this.ang = this.simplify(ang);
        this.calcDxDy();
    },

    getData: function () {
        return {
            x: this.left + this.width / 2,
            y: this.top + this.height / 2,
            r: this.width / 2
        }
    }
};

var Pad = function (options) {
    this.type = OBJECT_TYPE_PAD;
    this.setSize(options.size);
    this.left = options.left || (ar.contextWidth - this.width) / 2;
    this.height = PAD_HEIGHT;
    this.top = options.top || (ar.contextHeight - PAD_HEIGHT);

    this.visible = true;
    this.move = options.move || false;

    this.artist = new SpritePadArtist(SPRITE_SHEET, SPRITE_ARRAY_PAD);
    this.behaviors = [
        movePadBehavior
    ];

    this.sprite = new Sprite(this);
};

Pad.prototype = {

    setSize: function (size) {
        this.size = size;
        this.width = PAD_CORNER_WIDTH * 2 + PAD_MIDDLE_WIDTH * this.size;

        if (this.left + this.width > ar.contextWidth) {
            this.left = ar.contextWidth - this.width;
        }
    },

    draw: function (context) {
        this.sprite.draw.call(this, context);
    },

    update: function (time, fps) {
        this.sprite.update.call(this, time, fps);
    }
};

var Bonus = function (options) {
    this.type = OBJECT_TYPE_BONUS;
    this.effect = options.effect;
    this.width = BONUS_SIZE;
    this.height = BONUS_SIZE;

    this.left = options.left;
    this.top = options.top;
    this.dy = BONUS_SPEED;
    this.visible = true;

    this.artist = new SpriteSheetArtist(SPRITE_SHEET, SPRITE_ARRAY_BONUS_TYPE_PAD_INCREASE);
    this.behaviors = [
        bonusBehavior,
        new CycleBehavior(100, 0)
    ];

    this.sprite = new Sprite(this);

};

Bonus.prototype = {

    draw: function (context) {
        this.sprite.draw.call(this, context);
    },

    update: function (time, fps) {
        this.sprite.update.call(this, time, fps);
    },

    move: function () {
        this.top += this.dy;
    }
};

var Brick = function (options) {
    this.type = OBJECT_TYPE_BRICK;
    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;

    this.left = options.left;
    this.top = options.top;

    ///// Not implemented
    this.color = options.color;
    this.lives = options.lives || BRICK_DEFAULT_LIVES;
    this.stoneWalls = options.stoneWalls || [];

    this.visible = true;

//    this.artist = new SpriteSheetArtist(SPRITE_SHEET, SPRITE_ARRAY_BRICK_1);
    this.behaviors = [

    ];

    this.sprite = new Sprite(this);

};

Brick.prototype = {

    draw: function (context) {
        var style;
        switch (this.color) {
            case 'green':
                switch (this.lives) {
                    case 1:
                        style = '#00FF66';
                        break;
                    case 2:
                        style = '#339933';
                        break;
                    default:
                        style = '#006600';
                        break;
                }
                break;
            case 'blue':
                switch (this.lives) {
                    case 1:
                        style = '#6699FF';
                        break;
                    case 2:
                        style = '#0033FF';
                        break;
                    default:
                        style = '#003399';
                        break;
                }
                break;
            case 'yellow':
                switch (this.lives) {
                    case 1:
                        style = '#FFCC33';
                        break;
                    case 2:
                        style = '#CCCC00';
                        break;
                    default:
                        style = '#CC9900';
                        break;
                }
                break;
            case 'purple':
                switch (this.lives) {
                    case 1:
                        style = '#FF33FF';
                        break;
                    case 2:
                        style = '#996699';
                        break;
                    default:
                        style = '#660066';
                        break;
                }
                break;
            case null:
                style = '#DDDDDD';
                break;
        }

        context.beginPath();
        context.fillStyle = style;
        context.fillRect(this.left, this.top, this.width, this.height);
        context.lineWidth = 2;
        context.strokeStyle = '#3399CC';
        context.rect(this.left, this.top, this.width, this.height);
        context.stroke();

        if (this.stoneWalls.indexOf('top') != -1) {
            context.beginPath();
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.moveTo(this.left, this.top);
            context.lineTo(this.left + this.width, this.top);
            context.stroke();
        }

        if (this.stoneWalls.indexOf('bot') != -1) {
            context.beginPath();
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.moveTo(this.left, this.top + this.height);
            context.lineTo(this.left + this.width, this.top + this.height);
            context.stroke();
        }

        if (this.stoneWalls.indexOf('left') != -1) {
            context.beginPath();
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.moveTo(this.left, this.top);
            context.lineTo(this.left, this.top + this.height);
            context.stroke();
        }

        if (this.stoneWalls.indexOf('right') != -1) {
            context.beginPath();
            context.strokeStyle = 'black';
            context.lineWidth = 2;
            context.moveTo(this.left + this.width, this.top);
            context.lineTo(this.left + this.width, this.top + this.height);
            context.stroke();
        }
//        this.sprite.draw.call(this, context);
    },

    update: function (time, fps) {
        this.sprite.update.call(this, time, fps);
    },

    getBotLine  : function () {
        return {
            x1: this.left,
            y1: this.top + this.height,
            x2: this.left + this.width,
            y2: this.top + this.height
        };
    },
    getTopLine  : function () {
        return {
            x1: this.left,
            y1: this.top,
            x2: this.left + this.width,
            y2: this.top
        };
    },
    getLeftLine : function () {
        return {
            x1: this.left,
            y1: this.top,
            x2: this.left,
            y2: this.top + this.height
        };
    },
    getRightLine: function () {
        return {
            x1: this.left + this.width,
            y1: this.top,
            x2: this.left + this.width,
            y2: this.top + this.height
        };
    }


};