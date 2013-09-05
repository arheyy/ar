var Ar = function (canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.contextWidth = this.context.canvas.width;
    this.contextHeight = this.context.canvas.height;

    this.contextXLeft = $(this.canvas).offset().left;
    this.contextXRight = this.contextXLeft + this.contextWidth;

    this.fpsElement = document.getElementById('fps');

    this.lastAnimationFrameTime = 0;
    this.lastFpsUpdateTime = 0;
    this.fps = 60;
    this.frameCounter = 0;
    ;

    this.paused = false;

    // Спрайты
    this.objects = [];
    this.pad = null;
    this.balls = [];
    this.bonuses = [];
    this.bricks = [];

    // Images
    this.background = new Image();
    this.spritesheet = new Image();

    // Meta
    this.ballData = {
        left: (this.contextWidth - BALL_NORMAL_SIZE) / 2,
        top : this.contextHeight - BALL_TOP
    };

    this.padData = {
        size: PAD_DEFAULT_SIZE
    };

    this.level = 1;
    this.levelData = null;

    // Debug
    this.processOneFrame = false;

};

Ar.prototype = {

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

    loadLevel: function () {
        this.levelData = LEVELS[this.level];
    },

    start: function () {
        this.loadLevel();
        this.createObjects();
        this.initializeImages();
    },

///////////////////////////////////////////

    createObjects: function () {
        this.createBallObject();
        this.createPadObject();

        for (var i = 0; i < this.levelData.length; i++) {
            this.createBrickObject(this.levelData[i]);
        }

        this.createBonusObject({
            effect: BONUS_TYPE_PAD_INCREASE,
            left  : 400,
            top   : 100
        });
    },

    createBallObject: function (options) {
        options = options || this.ballData;
        var obj = new Ball(options);
        this.balls.push(obj);
        this.objects.push(obj);

        return obj;
    },

    createPadObject: function (options) {
        options = options || this.padData;
        this.pad = new Pad(options);
        this.objects.push(this.pad);

        return this.pad
    },

    createBonusObject: function (options) {
        var obj = new Bonus(options);
        this.bonuses.push(obj);
        this.objects.push(obj);

        return obj;
    },

    createBrickObject: function (options) {
        var obj = new Brick(options);
        this.bricks.push(obj);
        this.objects.push(obj);

        return obj;
    },

    drawObjects: function () {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].draw(this.context);
        }
    },

    updateObjects: function (now) {
        for (var i = 0; i < this.objects.length; i++) {
            this.objects[i].update(now, this.fps);
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

///////////////////////////////////////////

    initializeImages: function () {
        var self = this;
        this.background.src = SPRITE_BACKGROUND_1;
        this.spritesheet.src = SPRITE_SHEET_SRC;
        this.spritesheet.onload = function () {
            self.startGame();
        };
    },

    startGame: function () {
        requestAnimationFrame(this.animate);
    },

    pause: function () {
        this.paused = true;
    },

    togglePause: function () {
        this.paused = !this.paused;
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

        this.paused = true;
    },

///////////////////////////////////////////

    movePad: function (device, option) {
        this.pad.moveDevice = device;
        this.pad.moveOption = option;
    },

///////////////////////////////////////////

    drawBackground: function () {
//        this.context.globalAlpha = 0.01;
        this.context.drawImage(this.background, 0, 0,
            800, 600,
            0, 0,
            800, 600);
        this.context.globalAlpha = 1;
    },

    draw: function (now) {
        this.drawBackground();
        this.updateObjects(now);
        this.drawObjects();
    },

    animate: function (now) {
        if (window.DEBUG_STOP_ON_FRAME != undefined && DEBUG_STOP_ON_FRAME !== false) {
            if (DEBUG_STOP_ON_FRAME-- == 0) {
                ar.pause();
            }
        }


        if (!ar.paused) {
            ar.fps = ar.calculateFps(now);
        }

        if (!ar.paused) {
            ar.draw(now);
        } else if (ar.processOneFrame) {
            ar.draw(now);
            ar.processOneFrame = false;
        }

        requestAnimationFrame(ar.animate);
    }
}
;
// Запуск
var ar;

$(function () {
    ar = new Ar('scene');
    ar.start();



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
            case 107: // numpad +
                break;
        }
    };

    window.onmousemove = function (event) {
        if (event.pageX > ar.contextXLeft && event.pageX < ar.contextXRight) {
            ar.movePad(DEVICE_MOUSE, event.pageX);
        }
    };

    $(window).on('click', function (event) {
        if (event.pageX > ar.contextXLeft && event.pageX < ar.contextXRight) {

            if (!ar.paused) {
                ar.paused = true;
                return;
            }

            var mLeft = event.pageX - ar.contextXLeft;
            var mTop = event.pageY;

            var unpause = true;
            for (var i = 0; i < ar.objects.length; i++) {
                var obj = ar.objects[i];

                if (mLeft > obj.left && mLeft < obj.left + obj.width && mTop > obj.top && mTop < obj.top + obj.height) {
                    if (event.ctrlKey) {
                        ar.removeObject(obj)
                    } else {
                        c(obj);
                    }

                    unpause = false;
                }
            }

            if (ar.paused && unpause) {
                ar.paused = false;
            }

        }
    });

    $('#buttons').css({
        top : $(ar.canvas).offset().top + 'px',
        left: ar.contextXRight + 'px'
    })

});


//24.27688735
//0.02073
//0.50326 BTC
//0.0486 LTC