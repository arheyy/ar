var Ar = function (contId) {
    var bgCanvas = $('<canvas/>')
            .attr('width', PG_WIDTH)
            .attr('height', CONTEXT_HEIGHT)
            .css({position: 'absolute'})
        ;

    $(contId).append(bgCanvas);

    this.bgContext = bgCanvas[0].getContext('2d');

    var bricksCanvas = $('<canvas/>')
            .attr('width', PG_WIDTH)
            .attr('height', CONTEXT_HEIGHT)
            .css({position: 'absolute'})
        ;

    $(contId).append(bricksCanvas);

    this.bricksContext = bricksCanvas[0].getContext('2d');

    var mainCanvas = $('<canvas/>')
            .attr('width', CONTEXT_WIDTH)
            .attr('height', CONTEXT_HEIGHT)
            .css({position: 'absolute'})
        ;

    $(contId).append(mainCanvas);


    this.mainContext = mainCanvas[0].getContext('2d');

    this.mainCanvasLeft = mainCanvas.offset().left;
    this.mainCanvasTop = mainCanvas.offset().top;

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

    this.level = 1;
    this.levelData = null;

    this.lives = DEFAULT_LIVES_AMOUNT;
};

Ar.prototype = {

    startScreen: function () {
        this.screenMessage = MESSAGE_GREETING;
        this.hintMessage = MESSAGE_PRESS_START;
        this.resetObjects();

        this.background.src = SPRITE_BACKGROUND_1;
        var self = this;
        SPRITESHEET.src = SPRITESHEET_SRC;
        SPRITESHEET.onload = function () {
            self.drawBackground();
            self.createButtons();
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
        this.bgContext.drawImage(this.background, 0, 0, 800, 600, 0, 0, 800, 600);

        if (this.screenMessage) {
            this.bgContext.font = "italic 50pt Arial";
            this.bgContext.textBaseline = "middle";
            this.bgContext.textAlign = "center";
            this.bgContext.fillStyle = '#00FF66';
            this.bgContext.fillText(this.screenMessage, PG_WIDTH / 2, CONTEXT_HEIGHT / 2);
        }

        if (this.hintMessage) {
            this.bgContext.font = "italic 20pt Arial";
            this.bgContext.textBaseline = "middle";
            this.bgContext.textAlign = "center";
            this.bgContext.fillStyle = '#00FF66';
            this.bgContext.fillText(this.hintMessage, PG_WIDTH / 2, CONTEXT_HEIGHT / 2 + 150);
        }
    },

    createButtons: function () {
        var obj;
        obj = new Button(BUTTON_TYPE_START);
        this.buttons.push(obj);

        obj = new Button(BUTTON_TYPE_PAUSE);
        this.buttons.push(obj);

        obj = new Button(BUTTON_TYPE_SAVE);
        this.buttons.push(obj);

        obj = new Button(BUTTON_TYPE_LOAD);
        this.buttons.push(obj);

        this.drawButtons();
    },

    drawButtons: function () {
        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].draw(this.mainContext);
        }
    },

    startNewGame: function () {
        this.gameStarted = true;
        this.screenMessage = null;
        this.hintMessage = null;

        this.drawBackground();
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

    updateBricks: function (now) {
        var brick;
        for (var i = 0; i < this.bricks.length; i++) {
            brick = this.bricks[i];
            brick.update(now);
            if (!brick.alive) {
                this.generateBonus(brick);
                this.bricks.splice(i, 1);
            }
        }
    },

    drawBricks: function () {
        for (var i = 0; i < this.bricks.length; i++) {
            this.bricks[i].draw(this.bricksContext);
        }

        this.bricksUpdated = false;
    },

    // Brick
    createBrickObject: function (options) {
        var obj = new Brick(options);
        this.bricks.push(obj);

        return obj;
    },

    createBonusObject: function (options) {
        var obj = new Bonus(options);
        this.bonuses.push(obj);

        return obj;
    },

    animate: function (now) {
        ar.fps = ar.calculateFps(now);
        ar.draw(now);
        requestAnimationFrame(ar.animate);
    },

    draw: function (now) {
        if (ar.gamePaused) {
            return;
        }

        if (this.bricksUpdated) {
            this.bricksContext.clearRect(0, 0, PG_WIDTH, CONTEXT_HEIGHT);
            this.updateBricks(now);
            this.drawBricks();
        }

        this.mainContext.clearRect(0, 0, PG_WIDTH, CONTEXT_HEIGHT);

        this.updateBalls();
        this.drawBalls();

        this.pad.update(now);
        this.pad.draw(this.mainContext);

        if (this.bonuses.length) {
            this.updateBonuses();
            this.drawBonuses();
        }
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

///////////////////////////////////////////////////////////////////////

    processControlPanelClick: function (point) {
        for (var i = 0; i < this.buttons.length; i++) {
            var button = this.buttons[i];

            if (pointInObject(point, button)) {
                switch (button.buttonType) {
                    case BUTTON_TYPE_START:
                        this.startNewGame();
                        break;
                    case BUTTON_TYPE_PAUSE:
                        this.gamePaused = !this.gamePaused;
                        break;
                    case BUTTON_TYPE_SAVE:
                        break;
                    case BUTTON_TYPE_LOAD:
                        break;
                }

                return;
            }
        }
    },


///////////////////////////////////////////////////////////////////////
//
//    removeTypedObject: function (arr, obj) {
//        for (var i = 0; i < arr.length; i++) {
//
//            if (arr[i] === obj) {
//                arr.splice(i, 1);
//            }
//        }
//    },

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
        if (!ar.gameStarted || ar.gamePaused) {
            return;
        }
        if (event.pageX > ar.mainCanvasLeft && event.pageX < ar.mainCanvasLeft + PG_WIDTH) {
            ar.movePad(DEVICE_MOUSE, event.pageX);
        }
    };

    window.onclick = function (event) {
        var point = new Point(event.pageX, event.pageY);
        var pgRect = new Rect(ar.mainCanvasLeft, ar.mainCanvasTop, PG_WIDTH, CONTEXT_HEIGHT);
        var ctrlRect = new Rect(ar.mainCanvasLeft + PG_WIDTH, ar.mainCanvasTop, CTRL_WIDTH, CONTEXT_HEIGHT);

        if (pointInObject(point, pgRect)) {
        } else if (pointInObject(point, ctrlRect)) {
            ar.processControlPanelClick(new Point(event.pageX - ar.mainCanvasLeft, event.pageY - ar.mainCanvasTop));
        }
    };

//    $('#buttons').css({
//        top : $(ar.canvas).offset().top + 'px',
//        left: ar.mainCanvasLeft + PG_WIDTH + CTRL_WIDTH + 'px'
//    })

});
