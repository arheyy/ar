var Ball = function (options) {
    this.size = options.size || BALL.defaultSize;
    this.width = BALL.size[this.size];
    this.height = BALL.size[this.size];

    this.speed = options.speed || BALL.defaultSpeed;
    this.left = options.left || (PG_WIDTH - BALL.size.normal) / 2;
    this.top = options.top || PG_HEIGHT - PAD.height - BALL.size.normal;
    this.setAng(options.ang || rand(BALL.minStartAngel, BALL.maxStartAngel));
    this.alive = true;

//    this.speed = 0.2;
//    this.left = 400;
//    this.top = 510;
//    this.setAng(Math.PI * 270 / 180);


    this.behaviors = [moveBallBehavior];

    this.sprites = [new BallSprite(this, BALL.sprites)];
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
        return this.top + this.dy + this.height > PG_HEIGHT && this.dy > 0;
    },

    move: function () {
        this.left += this.dx;
        this.top += this.dy;
    },

    incSpeed: function () {
        this.setSpeed(this.speed + BALL.deltaSpeed);
    },

    decSpeed: function () {
        this.setSpeed(this.speed - BALL.deltaSpeed);
    },

    setSpeed: function (speed) {
        speed = Math.min(speed, BALL.maxSpeed);
        speed = Math.max(speed, BALL.minSpeed);
        this.speed = speed;
        this.calcDxDy();
    },

    setSize: function (size) {
        this.size = size;
        this.width = BALL.size[this.size];
        this.height = BALL.size[this.size];
    },

    correctAng: function (ang) {

        if (ang < BALL.minHorizontalAngelDelta) {
            return BALL.minHorizontalAngelDelta;
        }

        if ((ang < Math.PI) && (Math.PI - ang) < BALL.minHorizontalAngelDelta) {
            return Math.PI - BALL.minHorizontalAngelDelta;
        }

        if ((ang > Math.PI) && (ang - Math.PI) < BALL.minHorizontalAngelDelta) {
            return Math.PI + BALL.minHorizontalAngelDelta;
        }

        if (2 * Math.PI - ang < BALL.minHorizontalAngelDelta) {
            return 2 * Math.PI - BALL.minHorizontalAngelDelta;
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
    this.setSize(options.size || PAD.defaultSize);
    this.left = options.left || (PG_WIDTH - this.width) / 2;
    this.height = PAD.height;
    this.top = options.top || (PG_HEIGHT - PAD.height);
    this.move = options.move || false;
    this.alive = true;

    this.behaviors = [
        movePadBehavior
    ];

    this.sprites = [ new PadSprite(this, PAD.sprite) ];
};

Pad.prototype = {

    setSize: function (size) {
        this.size = size;
        this.width = PAD.sizeWidth * this.size;

        if (this.left + this.width > PG_WIDTH) {
            this.left = PG_WIDTH - this.width;
        }
    },

    draw: function (context) {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].draw(context);
        }
    },

    update: function (time) {
        for (var i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].execute(this, time);
        }
    }
};

var Bonus = function (options) {
    this.type = options.type;
    this.width = BONUS.size;
    this.height = BONUS.size;
    this.left = options.left;
    this.top = options.top;
    this.dy = BONUS.speed;
    this.alive = true;

    this.behaviors = [
        bonusBehavior
    ];

    this.sprites = [ new BonusSprite(this, BONUS.sprites) ];

};

Bonus.prototype = {

    draw: function (context) {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].draw(context);
        }
    },

    update: function (time) {
        for (var i = 0; i < this.sprites.length; i++) {
            this.sprites[i].update(time);
        }

        for (i = 0; i < this.behaviors.length; i++) {
            this.behaviors[i].execute(this, time);
        }
    }
};

var Brick = function (options) {
    this.brickType = options.brickType;
    this.lives = BRICK.lives[this.brickType];
    this.health = this.lives;
    this.width = BRICK.width;
    this.height = BRICK.height;
    this.left = options.left;
    this.top = options.top;
    this.lines = {
        TOP  : { x1: this.left, y1: this.top, x2: this.left + this.width, y2: this.top },
        BOT  : { x1: this.left, y1: this.top + this.height, x2: this.left + this.width, y2: this.top + this.height },
        LEFT : { x1: this.left, y1: this.top, x2: this.left, y2: this.top + this.height },
        RIGHT: { x1: this.left + this.width, y1: this.top, x2: this.left + this.width, y2: this.top + this.height }
    };

    this.metalWalls = options.metalWalls || [];
    this.alive = true;

    this.behaviors = [];

    this.sprites = [
        new BrickSprite(this, BRICK.sprites.bricks),
        new BrokenSprite(this, BRICK.sprites.broken),
        new MetalWallSprite(this, BRICK.sprites.metalWalls)
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
                return this.lines['TOP'];
            case BOT:
                return this.lines['BOT'];
            case LEFT:
                return this.lines['LEFT'];
            case RIGHT:
                return this.lines['RIGHT'];
        }

        return {};
    }
};

var Button = function (type) {
    this.type = type;
    this.width = BUTTONS[this.type].width;
    this.height = BUTTONS[this.type].height;
    this.left = BUTTONS[this.type].left;
    this.top = BUTTONS[this.type].top;
    this.label = BUTTONS[this.type].label;
    this.active = false;

    this.sprites = [
        new ButtonSprite(this, BUTTONS[this.type].sprite)
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