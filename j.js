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

    //////////////////


    /////////////////


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
    this.objects = [];
    this.pad = null;
    this.balls = [];
    this.bonuses = [];
    this.bricks = [];

    this.bricksUpdated = true;

//    this.leftBrick = null;
//    this.rightBrick = null;
//    this.topBrick = null;
//    this.botBrick = null;

    // Images
    this.background = new Image();

    this.level = 1;
    this.levelData = null;

};

Ar.prototype = {

    startScreen: function () {
        this.screenMessage = MESSAGE_GREETING;
        this.hintMessage = MESSAGE_PRESS_START;
        this.resetObjects();

        this.background.src = SPRITE_BACKGROUND_1;
        var self = this;
        SPRITESHEET.src = SPRITESHEET_SRC;
        SPRITESHEET.onload = function() {
            self.drawBackground();
            self.createButtons();
            requestAnimationFrame(self.animate);
            self.startNewGame();
        }
    },

    resetObjects: function () {
        this.objects = [];
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
        this.gamePaused = true;
    },

    loadLevel: function () {
        this.levelData = LEVELS[this.level - 1];
    },

    createPadObject: function (options) {
        this.pad = new Pad(options);
        this.objects.push(this.pad);

        return this.pad
    },

    createBallObject: function (options) {
        options = options || {};
        var obj = new Ball(options);
        this.balls.push(obj);
        this.objects.push(obj);

        return obj;
    },

    createBrickObject: function (options) {
        var obj = new Brick(options);
        this.bricks.push(obj);

        return obj;
    },

    animate: function (now) {
        ar.fps = ar.calculateFps(now);
        ar.draw(now);
        requestAnimationFrame(ar.animate);
    },

    draw: function (now) {
        if (!ar.gamePaused) {
            this.updateObjects(now);
        }

        if (this.bricksUpdated) {
            this.updateBricks(now);
        }

        this.drawBricks();
        this.drawObjects();
    },

    drawBricks: function () {
        if (this.bricksUpdated) {
            this.bricksContext.clearRect(0, 0, PG_WIDTH, CONTEXT_HEIGHT);
            for (var i = 0; i < this.bricks.length; i++) {
                this.bricks[i].draw(this.bricksContext);
            }
        }

        this.bricksUpdated = false;
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

    createBonusObject: function (options) {
        var obj = new Bonus(options);
        this.bonuses.push(obj);
        this.objects.push(obj);

        return obj;
    },

    drawObjects: function () {
        this.mainContext.clearRect(0, 0, PG_WIDTH, CONTEXT_HEIGHT);
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw(this.mainContext);
        }
    },

    updateBricks: function (now) {
        var brick;
        for (var i = 0; i < this.bricks.length; i++) {
            brick = this.bricks[i];
            brick.update(now);
            if (!brick.alive) {
                this.bricks.splice(i, 1);
            }
        }
    },

    updateObjects: function (now) {
        var object;
        for (var i = 0; i < this.objects.length; i++) {
            object = this.objects[i];
            object.update(now);
            if (!object.alive) {
                this.removeObject(object);
            }
        }
    },

    removeObject: function (obj) {
        for (var i = 0; i < this.objects.length; i++) {

            if (this.objects[i] === obj) {

                this.objects.splice(i, 1);

                switch (obj.type) {
                    case OBJECT_TYPE_BALL:
                        this.removeTypedObject(this.balls, obj);
                        break;
                    case OBJECT_TYPE_BONUS:
                        this.removeTypedObject(this.bonuses, obj);
                        break;
                    case OBJECT_TYPE_BRICK:
                        this.removeTypedObject(this.bricks, obj);
                        break;
                }
            }
        }
    },

    removeTypedObject: function (arr, obj) {
        for (var i = 0; i < arr.length; i++) {

            if (arr[i] === obj) {
                arr.splice(i, 1);
            }
        }
    },

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

        this.objects = [];
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
