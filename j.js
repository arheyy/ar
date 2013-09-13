var Ar = function (contId) {
    this.bgCanvas = $('<canvas/>')
        .attr('width', BG_WIDTH)
        .attr('height', BG_HEIGHT)
        .css({position: 'absolute'});
    $(contId).append(this.bgCanvas);
    this.bgContext = this.bgCanvas[0].getContext('2d');
    this.bgCanvasLeft = this.bgCanvas.offset().left;
    this.bgCanvasTop = this.bgCanvas.offset().top;

    this.bricksCanvas = $('<canvas/>')
        .attr('width', PG_WIDTH)
        .attr('height', PG_HEIGHT)
        .css({position: 'absolute', left: BORDER.size + 'px', top: BORDER.size + 'px'});
    $(contId).append(this.bricksCanvas);
    this.bricksContext = this.bricksCanvas[0].getContext('2d');

    this.mainCanvas = $('<canvas/>')
        .attr('width', PG_WIDTH)
        .attr('height', PG_HEIGHT)
        .css({position: 'absolute', left: BORDER.size + 'px', top: BORDER.size + 'px'});
    $(contId).append(this.mainCanvas);
    this.mainContext = this.mainCanvas[0].getContext('2d');

    this.mainCanvasLeft = this.mainCanvas.offset().left;
    this.mainCanvasTop = this.mainCanvas.offset().top;

    this.sidebarCanvas = $('<canvas/>')
        .attr('width', SIDEBAR_WIDTH)
        .attr('height', BG_HEIGHT)
        .css({position: 'absolute', left: BG_WIDTH - SIDEBAR_WIDTH + 'px'});
    $(contId).append(this.sidebarCanvas);
    this.sidebarContext = this.sidebarCanvas[0].getContext('2d');

    this.fpsElement = document.getElementById('fps');

    this.lastAnimationFrameTime = 0;
    this.lastFpsUpdateTime = 0;
    this.fps = 60;
    this.frameCounter = 0;

    this.screenMessage = null;
    this.hintMessage = null;
    this.gameStarted = false;
    this.gamePaused = false;

    // Спрайты
    this.buttons = [];
    this.pad = null;
    this.balls = [];
    this.bonuses = [];
    this.bricks = [];

    this.bricksUpdated = true;

    this.background = new Image();
    this.backImage = new Image();

    this.level = 1;
    this.levelData = null;

    this.score = 0;

    this.lives = DEFAULT_LIVES_AMOUNT;
};

Ar.prototype = {

    startScreen: function () {
        this.screenMessage = MESSAGES['greeting'];
        this.hintMessage = MESSAGES['pressStart'];
        this.resetObjects();

        var self = this;

        this.background.src = IMAGE_BACKGROUND;
        this.background.onload = function () {
            this.loaded = true;
        };

        this.backImage.src = IMAGE_BACK;
        this.backImage.onload = function () {
            this.loaded = true;
            self.createButtons();
        };

        SPRITESHEET.src = SPRITESHEET_SRC;
        SPRITESHEET.onload = function () {
            requestAnimationFrame(self.animate);
            self.startNewGame();
        }
    },

    resetObjects: function () {
        this.pad = null;
        this.balls = [];
        this.bonuses = [];
        this.bricks = [];
    },

    drawBackground: function () {
        if (this.background.loaded && !this.background.actual) {

            this.bgContext.drawImage(this.background, 0, 0, 800, 600, BORDER.size, BORDER.size, 800, 600);
            this.drawBorder();

            if (this.screenMessage) {
                this.bgContext.font = "italic 50pt Arial";
                this.bgContext.textBaseline = "middle";
                this.bgContext.textAlign = "center";
                this.bgContext.fillStyle = '#00FF66';
                this.bgContext.fillText(this.screenMessage, PG_WIDTH / 2, PG_HEIGHT / 2);
            }

            if (this.hintMessage) {
                this.bgContext.font = "italic 20pt Arial";
                this.bgContext.textBaseline = "middle";
                this.bgContext.textAlign = "center";
                this.bgContext.fillStyle = '#00FF66';
                this.bgContext.fillText(this.hintMessage, PG_WIDTH / 2, PG_HEIGHT / 2 + 150);
            }

            this.background.actual = true;
        }

        if (this.backImage.loaded && !this.backImage.actual) {
            this.bgContext.drawImage(this.backImage,
                SIDEBAR.sprite.left,
                SIDEBAR.sprite.top,
                SIDEBAR.sprite.width,
                SIDEBAR.sprite.height,
                SIDEBAR.left,
                SIDEBAR.top,
                SIDEBAR.width,
                SIDEBAR.height);

            this.bgContext.drawImage(this.backImage,
                FRAME.sprite.left,
                FRAME.sprite.top,
                FRAME.sprite.width,
                FRAME.sprite.height,
                FRAME.left,
                FRAME.top,
                FRAME.width,
                FRAME.height);

            this.drawButtons();

            this.backImage.actual = true;
        }
    },

    drawBorder: function () {
        this.bgContext.drawImage(this.backImage,
            BORDER.sprites.LEFT.left,
            BORDER.sprites.LEFT.top,
            BORDER.sprites.LEFT.width,
            BORDER.sprites.LEFT.height,
            0,
            BORDER.size,
            BORDER.sprites.LEFT.width,
            BORDER.sprites.LEFT.height
        );
        this.bgContext.drawImage(this.backImage,
            BORDER.sprites.RIGHT.left,
            BORDER.sprites.RIGHT.top,
            BORDER.sprites.RIGHT.width,
            BORDER.sprites.RIGHT.height,
            BORDER.size + PG_WIDTH,
            BORDER.size,
            BORDER.sprites.RIGHT.width,
            BORDER.sprites.RIGHT.height
        );

        this.bgContext.save();
        this.bgContext.translate(0, BORDER.size);
        this.bgContext.rotate(-Math.PI / 2);

        this.bgContext.drawImage(this.backImage,
            BORDER.sprites.TOP.left,
            BORDER.sprites.TOP.top,
            BORDER.sprites.TOP.width,
            BORDER.sprites.TOP.height,
            0,
            0,
            BORDER.sprites.TOP.width,
            BORDER.sprites.TOP.height
        );

        this.bgContext.restore();

        this.bgContext.save();
        this.bgContext.translate(0, PG_HEIGHT + BORDER.size * 2);
        this.bgContext.rotate(-Math.PI / 2);

        this.bgContext.drawImage(this.backImage,
            BORDER.sprites.BOT.left,
            BORDER.sprites.BOT.top,
            BORDER.sprites.BOT.width,
            BORDER.sprites.BOT.height,
            0,
            0,
            BORDER.sprites.BOT.width,
            BORDER.sprites.BOT.height
        );

        this.bgContext.restore();
    },

    drawScore: function () {
        this.sidebarContext.clearRect(SCORE.clearRect.left, SCORE.clearRect.top, SCORE.clearRect.width, SCORE.clearRect.height);
        this.sidebarContext.font = SCORE.font;
        this.sidebarContext.textBaseline = "middle";
        this.sidebarContext.textAlign = "center";
        this.sidebarContext.fillStyle = SCORE.fillStyle;
        this.sidebarContext.fillText('' + this.score, SCORE.left, SCORE.top);
    },

    createButtons: function () {
        var obj;
        obj = new Button('start');
        this.buttons.push(obj);

        obj = new Button('pause');
        this.buttons.push(obj);

        obj = new Button('save');
        this.buttons.push(obj);

        obj = new Button('load');
        this.buttons.push(obj);
    },

    drawButtons: function () {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw(this.bgContext);
        }
    },

    startNewGame: function () {
        this.gameStarted = true;
        this.screenMessage = null;
        this.hintMessage = null;

        this.score = 0;
        this.resetObjects();
        this.loadLevel();
        this.createPadObject();
        this.createBallObject();

        for (var i = 0; i < this.levelData.length; i++) {
            this.createBrickObject(this.levelData[i]);
        }

        this.bricksUpdated = true;
    },

    loadLevel: function () {
        this.levelData = LEVELS[this.level - 1];
    },

    createPadObject: function (options) {
        this.pad = new Pad(options);

        return this.pad
    },

    // Ball

    createBallObject: function (options) {
        options = options || {};
        var obj = new Ball(options);
        this.balls.push(obj);

        return obj;
    },

    updateBalls: function (now) {
        var ball;
        for (var i = 0; i < this.balls.length; i++) {
            ball = this.balls[i];
            ball.update(now);
            if (!ball.alive) {
                this.balls.splice(i, 1);
            }
        }
    },

    drawBalls: function () {
        for (var i = 0; i < this.balls.length; i++) {
            this.balls[i].draw(this.mainContext);
        }
    },

    // Brick

    createBrickObject: function (options) {
        var obj = new Brick(options);
        this.bricks.push(obj);

        return obj;
    },

    updateBricks: function (now) {
        var brick;
        var res = false;
        for (var i = 0; i < this.bricks.length; i++) {
            brick = this.bricks[i];
            brick.update(now);
            if (!brick.alive) {
                this.updateScore();
                this.generateBonus(brick);
                this.bricks.splice(i, 1);
                res = true;
            }
        }

        return res;
    },

    drawBricks: function () {
        for (var i = 0; i < this.bricks.length; i++) {
            this.bricks[i].draw(this.bricksContext);
        }

        this.bricksUpdated = false;
    },

    // Bonus

    createBonusObject: function (options) {
        var obj = new Bonus(options);
        this.bonuses.push(obj);

        return obj;
    },

    updateBonuses: function (now) {
        var bonus;
        for (var i = 0; i < this.bonuses.length; i++) {
            bonus = this.bonuses[i];
            bonus.update(now);
            if (!bonus.alive) {
                this.bonuses.splice(i, 1);
            }
        }
    },

    drawBonuses: function () {
        for (var i = 0; i < this.bonuses.length; i++) {
            this.bonuses[i].draw(this.mainContext);
        }
    },

    removeBonus: function (obj) {
        for (var i = 0; i < this.bonuses.length; i++) {
            if (this.bonuses[i] === obj) {
                this.bonuses.splice(i, 1);
            }
        }
    },

    generateBonus: function (brick) {
        if (randInt(5) != 0) {
            return;
        }

        var index = randInt(BONUS.types.length);

        this.createBonusObject({
            type: BONUS.types[index],
            left: brick.left + (brick.width - BONUS.size) / 2,
            top : brick.top + (brick.height - BONUS.size) / 2
        });
    },

    animate: function (now) {
        ar.fps = ar.calculateFps(now);
        ar.draw(now);
        requestAnimationFrame(ar.animate);
    },

    draw: function (now) {
        this.drawBackground();
        this.drawScore();

        if (ar.gamePaused) {
            return;
        }

        this.mainContext.clearRect(0, 0, PG_WIDTH, PG_HEIGHT);

        this.updateBalls();
        this.drawBalls();

        this.pad.update(now);
        this.pad.draw(this.mainContext);

        if (this.bonuses.length) {
            this.updateBonuses();
            this.drawBonuses();
        }

        if (this.updateBricks(now) || this.bricksUpdated) {
            this.bricksContext.clearRect(0, 0, PG_WIDTH, PG_HEIGHT);
            this.drawBricks();
        }
    },

    updateScore: function () {
        var ballScore = this.balls[0].speed - BALL.defaultSpeed;
        var padScore = PAD.defaultSize - this.pad.size;
        this.score += SCORE.base + ballScore + padScore;
    },

///////////////////////////////////////////////////////////////////////

    processSidebarMouseMove: function (point) {
        var touch = false;
        var hasActiveButton = false;
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];

            hasActiveButton = hasActiveButton || button.active;

            if (pointInObject(point, button)) {
                this.bgCanvas.addClass('activeButton');
                button.active = true;
                touch = true;
            } else {
                button.active = false;
            }
        }

        if (touch) {
            this.bgCanvas.addClass('activeButton');
            this.drawButtons();
        } else if (hasActiveButton) {
            this.bgCanvas.removeClass('activeButton');
            this.drawButtons();
        }
    },

    processSidebarClick: function (point) {
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];

            if (pointInObject(point, button)) {
                switch (button.type) {
                    case 'start':
                        this.startNewGame();
                        break;
                    case 'pause':
                        this.gamePaused = !this.gamePaused;
                        break;
                    case 'save':
                        break;
                    case 'load':
                        break;
                }

                return;
            }
        }
    },


///////////////////////////////////////////////////////////////////////

    calculateFps: function (now) {
        var fps = 1000 / (now - this.lastAnimationFrameTime);
        this.lastAnimationFrameTime = now;

        if (now - this.lastFpsUpdateTime > 1000) {
            this.lastFpsUpdateTime = now;
            this.fpsElement.innerHTML = this.fps.toFixed(0) + ' fps';
        }

        this.frameCounter++;
        $('#frame-counter').html(this.frameCounter);

        return fps;
    },


    saveGame: function () {
        var data = {
            balls  : this.balls,
            pad    : this.pad,
            bonuses: this.bonuses,
            bricks : this.bricks
        };

        localStorage.setItem(SAVE_DATA_KEY, JSON.stringify(data));
    },

    loadGame: function () {
        var data = localStorage.getItem(SAVE_DATA_KEY);
        if (!data) {
            return;
        }

        data = JSON.parse(data);

        this.pad = null;
        this.bonuses = [];
        this.balls = [];
        this.bricks = [];

        this.createPadObject(data.pad);

        var i;
        for (i = 0; i < data.balls.length; i++) {
            this.createBallObject(data.balls[i]);
        }

        for (i = 0; i < data.bonuses.length; i++) {
            this.createBonusObject(data.bonuses[i]);
        }


        for (i = 0; i < data.bricks.length; i++) {
            this.createBrickObject(data.bricks[i]);
        }

        this.gamePaused = true;
    },

///////////////////////////////////////////

    movePad: function (device, option) {
        this.pad.moveDevice = device;
        this.pad.moveOption = option;
    }

}
;
// Запуск
var ar;

$(function () {
    ar = new Ar('#game-cont');
    ar.startScreen();


// Обработчики собыйтий
    window.onkeydown = function (event) {
        var key = event.keyCode;

        switch (key) {
            case 37: // left arrow
                ar.movePad(DEVICE_KEYBOARD, LEFT);
                break;
            case 39: // right arrow
                ar.movePad(DEVICE_KEYBOARD, RIGHT);
                break;
            case 80: // P
                ar.gamePaused = !ar.gamePaused;
                break;
        }
    };

    window.onmousemove = function (event) {
        if (event.pageX > ar.bgCanvasLeft + BG_WIDTH - SIDEBAR_WIDTH
            && event.pageX < ar.bgCanvasLeft + BG_WIDTH
            && event.pageY > ar.bgCanvasTop
            && event.pageY < ar.bgCanvasTop + BG_HEIGHT
            ) {

            ar.processSidebarMouseMove(new Point(event.pageX - ar.bgCanvasLeft, event.pageY - ar.bgCanvasTop));

        }

        if (!ar.gameStarted || ar.gamePaused) {
            return;
        }
        if (event.pageX > ar.mainCanvasLeft && event.pageX < ar.mainCanvasLeft + PG_WIDTH) {
            ar.movePad(DEVICE_MOUSE, event.pageX);
        }
    };

    window.onclick = function (event) {
        var point = new Point(event.pageX, event.pageY);
        var pgRect = new Rect(ar.mainCanvasLeft, ar.mainCanvasTop, PG_WIDTH, PG_HEIGHT);
        var sidebarRect = new Rect(ar.bgCanvasLeft + BG_WIDTH - SIDEBAR_WIDTH, ar.bgCanvasTop, SIDEBAR_WIDTH, BG_HEIGHT);

        if (pointInObject(point, pgRect)) {

        } else if (pointInObject(point, sidebarRect)) {
            ar.processSidebarClick(new Point(event.pageX - ar.bgCanvasLeft, event.pageY - ar.bgCanvasTop));
        }
    };

//    $('#buttons').css({
//        top : $(ar.canvas).offset().top + 'px',
//        left: ar.mainCanvasLeft + PG_WIDTH + SIDEBAR_WIDTH + 'px'
//    })

});
