var Ball = function (options) {
    this.type = OBJECT_TYPE_BALL;
    this.speed = options.speed || BALL_DEFAULT_SPEED;
    this.size = options.size || BALL_NORMAL_SIZE;
    this.width = this.size;
    this.height = this.size;
//    options.ang = Math.PI * 90 / 180;

    this.left = options.left || (PG_WIDTH - BALL_NORMAL_SIZE) / 2;
    this.top = options.top || CONTEXT_HEIGHT - PAD_HEIGHT - BALL_NORMAL_SIZE;
    this.setAng(options.ang || rand(BALL_START_ANGEL_MIN, BALL_START_ANGEL_MAX));
    this.alive = true;
//
//    this.speed = 2;
//    this.left = 330;
//    this.top = 251;
//    this.setAng(135 * Math.PI / 180);
//    this.ang = 135 * Math.PI / 180;
//    this.dx = -10;
//    this.dy = -10;


    this.behaviors = [moveBallBehavior];

    this.sprites = [new BallSprite(this, SPRITE_BALL)];
};

Ball.prototype = {

    calcDxDy: function () {
        this.dx = this.speed * Math.cos(this.ang);
        this.dy = -this.speed * Math.sin(this.ang);
    },

    draw: function (context) {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].draw(context);
        }
    },

    update: function (time) {
        var i;
        for (i = 0; i < this.sprites.length; i++) {
            this.sprites[i].update(time);
        }

        for (i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].execute(this, time);
        }
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
        return (this.left + this.dx < 0 && this.dx < 0) || (this.left + this.dx + this.width > PG_WIDTH && this.dx > 0);
    },

    isTopWallCollision: function () {
        return this.top + this.dy < 0 && this.dy < 0;
    },

    isBotWallCollision: function () {
        return this.top + this.dy + this.height > CONTEXT_HEIGHT && this.dy > 0;
    },

    move: function () {
        this.left += this.dx;
        this.top += this.dy;
    },

    incSpeed: function() {
        this.setSpeed(this.speed + BALL_SPEED_DELTA);
    },

    decSpeed: function() {
        this.setSpeed(this.speed - BALL_SPEED_DELTA);
    },

    setSpeed: function (speed) {
        speed = Math.min(speed, BALL_MAX_SPEED);
        speed = Math.max(speed, BALL_MIN_SPEED);
        this.speed = speed;
        this.calcDxDy();
    },

    setSize: function (size) {
        this.size = size;
        this.width = this.size;
        this.height = this.size;
    },

    correctAng: function (ang) {

        if (ang < BALL_MIN_HORIZONTAL_ANGEL_DELTA) {
            return BALL_MIN_HORIZONTAL_ANGEL_DELTA;
        }

        if ((ang < Math.PI) && (Math.PI - ang) < BALL_MIN_HORIZONTAL_ANGEL_DELTA) {
            return Math.PI - BALL_MIN_HORIZONTAL_ANGEL_DELTA;
        }

        if ((ang > Math.PI) && (ang - Math.PI) < BALL_MIN_HORIZONTAL_ANGEL_DELTA) {
            return Math.PI + BALL_MIN_HORIZONTAL_ANGEL_DELTA;
        }

        if (2 * Math.PI - ang < BALL_MIN_HORIZONTAL_ANGEL_DELTA) {
            return 2 * Math.PI - BALL_MIN_HORIZONTAL_ANGEL_DELTA;
        }

        return ang;
    },

    simplify: function (ang) {
        if (ang > 2 * Math.PI) {
            ang = ang - 2 * Math.PI;
        }
        return ang;

    },

    setAng: function (ang) {
        ang = this.simplify(ang);
        this.ang = this.correctAng(ang);
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
    options = options || {};
    this.type = OBJECT_TYPE_PAD;
    this.setSize(options.size || PAD_DEFAULT_SIZE);
    this.left = options.left || (PG_WIDTH - this.width) / 2;
    this.height = PAD_HEIGHT;
    this.top = options.top || (CONTEXT_HEIGHT - PAD_HEIGHT);
    this.move = options.move || false;
    this.alive = true;

    this.artist = new SpritePadArtist(SPRITE_ARRAY_PAD);
    this.behaviors = [
        movePadBehavior
    ];

    this.sprite = new Sprite(this);
};

Pad.prototype = {

    setSize: function (size) {
        this.size = size;
        this.width = PAD_CORNER_WIDTH * 2 + PAD_MIDDLE_WIDTH * this.size;

        if (this.left + this.width > PG_WIDTH) {
            this.left = PG_WIDTH - this.width;
        }
    },

    draw: function (context) {
        this.sprite.draw.call(this, context);
    },

    update: function (time, fps) {
        this.sprite.update.call(this, time, fps);
    }
};

//var Bonus = function (options) {
//    this.type = OBJECT_TYPE_BONUS;
//    this.effect = options.effect;
//    this.width = BONUS_SIZE;
//    this.height = BONUS_SIZE;
//    this.left = options.left;
//    this.top = options.top;
//    this.dy = BONUS_SPEED;
//    this.alive = true;
//
//    this.artist = new SpriteSheetArtist(SPRITE_ARRAY_BONUS_TYPE_PAD_INCREASE);
//    this.behaviors = [
//        bonusBehavior,
//    ];
//
//    this.sprite = new Sprite(this);
//
//};
//
//Bonus.prototype = {
//
//    draw: function (context) {
//        this.sprite.draw.call(this, context);
//    },
//
//    update: function (time, fps) {
//        this.sprite.update.call(this, time, fps);
//    },
//
//    move: function () {
//        this.top += this.dy;
//    }
//};

var Brick = function (options) {
    this.type = OBJECT_TYPE_BRICK;
    this.brickType = options.brickType;
    this.lives = BRICK_LIVES[this.brickType];
    this.health = this.lives;
    this.width = BRICK_WIDTH;
    this.height = BRICK_HEIGHT;
    this.left = options.left;
    this.top = options.top;
    this.metalWalls = options.metalWalls || [];
    this.alive = true;

    this.behaviors = [];

    this.sprites = [
        new BrickSprite(this, SPRITE_BRICKS),
        new BrokenSprite(this, SPRITE_BROKEN),
        new MetalWallSprite(this, SPRITE_METAL_WALL)
    ];
};

Brick.prototype = {

    draw: function (context) {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].draw(context);
        }
    },

    processTouch: function (touchSide) {
        if ((touchSide.length == 2) && (this.hasMetalWall(touchSide[0]) || this.hasMetalWall(touchSide[1]))) {
            return false;
        } else if (this.hasMetalWall(touchSide)) {
            return false;
        }

        this.health--;

        return true;
    },

    update: function (time) {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].update(time);
        }

        if (this.health <= 0) {
            this.alive = false;
        }
    },

    hasMetalWall: function (side) {
        return this.metalWalls.indexOf(side) != -1;
    },

    getSideLine: function (side) {
        switch (side) {
            case TOP:
                return {
                    x1: this.left,
                    y1: this.top,
                    x2: this.left + this.width,
                    y2: this.top
                };
            case BOT:
                return {
                    x1: this.left,
                    y1: this.top + this.height,
                    x2: this.left + this.width,
                    y2: this.top + this.height
                };
            case LEFT:
                return {
                    x1: this.left,
                    y1: this.top,
                    x2: this.left,
                    y2: this.top + this.height
                };
            case RIGHT:
                return {
                    x1: this.left + this.width,
                    y1: this.top,
                    x2: this.left + this.width,
                    y2: this.top + this.height
                };
        }
    }

};

var Button = function (buttonType) {
    this.type = OBJECT_TYPE_BUTTON;
    this.buttonType = buttonType;
    this.width = BUTTON_WIDTH;
    this.height = BUTTON_HEIGHT;
    this.left = BUTTONS_LEFT;
    this.top = BUTTONS_TOP[this.buttonType];
    this.label = BUTTONS_LABEL[this.buttonType];
    this.state = false;

    this.sprites = [
        new ButtonSprite(this, SPRITE_BUTTONS),
    ];
};

Button.prototype = {

    draw: function (context) {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].draw(context);
        }
    },

    update: function (time) {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].update(time);
        }
    }
};