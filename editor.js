var CONTROL_PANEL_HEIGHT = 100;

var PREVIEW_TOP = 20;
var PREVIEW_LEFT = 720;
var PREVIEW_WIDTH = 80;
var PREVIEW_HEIGHT = 60;

var BRICK_TOP_OFFSET = 5;
var BRICK_LEFT_OFFSET = 10;
var BRICK_BETWEEN_DISTANCE = 5;

var Editor = function (canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');

    this.contextWidth = this.context.canvas.width;
    this.contextHeight = this.context.canvas.height;

    this.contextXLeft = $(this.canvas).offset().left;
    this.contextXRight = this.contextXLeft + this.contextWidth;
    this.contextYTop = $(this.canvas).offset().top;
    this.contextYBot = this.contextYTop + this.contextHeight;

    this.controls = [];

    this.bricks = [];
    this.previewBrick = null;

    this.selectedColor = null;
    this.selectedLives = null;

    this.colorBorder = null;
    this.wallBorders = [];

};

Editor.prototype = {

    createControls: function () {
        var i;
        for (i = 0; i < SPRITE_BRICKS.length; i++) {
            this.controls.push(new Brick({
                left : i * (BRICK_WIDTH + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
                top  : BRICK_TOP_OFFSET + j * (BRICK_HEIGHT + BRICK_TOP_OFFSET),
                lives: j + 1,
                color: BRICK_COLORS[i]
            }));
        }

        this.controls.push(new Brick({
            left      : (BRICK_COLORS.length) * (BRICK_WIDTH + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
            top       : BRICK_TOP_OFFSET,
            color     : null,
            metalWalls: [TOP]
        }));

        this.controls.push(new Brick({
            left      : (BRICK_COLORS.length + 1) * (BRICK_WIDTH + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
            top       : BRICK_TOP_OFFSET,
            color     : null,
            metalWalls: [BOT]
        }));

        this.controls.push(new Brick({
            left      : (BRICK_COLORS.length + 2) * (BRICK_WIDTH + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
            top       : BRICK_TOP_OFFSET,
            color     : null,
            metalWalls: [LEFT]
        }));

        this.controls.push(new Brick({
            left      : (BRICK_COLORS.length + 3) * (BRICK_WIDTH + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
            top       : BRICK_TOP_OFFSET,
            color     : null,
            metalWalls: [RIGHT]
        }));

        this.previewBrick = new Brick({
            left : PREVIEW_LEFT + (PREVIEW_WIDTH - BRICK_WIDTH) / 2,
            top  : PREVIEW_TOP + (PREVIEW_HEIGHT - BRICK_HEIGHT) / 2,
            color: this.selectedColor,
            lives: this.selectedLives
        });

    },

    drawScene: function () {

        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, this.contextWidth, this.contextHeight);

        this.context.beginPath();
        this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.context.lineWidth = 1;

        var xCnt = this.contextWidth / BRICK_WIDTH;
        for (var i = 0; i <= xCnt; i++) {
            this.context.moveTo(i * BRICK_WIDTH, CONTROL_PANEL_HEIGHT);
            this.context.lineTo(i * BRICK_WIDTH, this.contextHeight);
        }

        var yCnt = this.contextHeight / BRICK_HEIGHT;
        for (var j = 0; j <= yCnt; j++) {
            this.context.moveTo(0, CONTROL_PANEL_HEIGHT + j * BRICK_HEIGHT);
            this.context.lineTo(this.contextWidth, CONTROL_PANEL_HEIGHT + j * BRICK_HEIGHT);
        }

        this.context.stroke();
    },

    drawControls: function () {
        for (var i = 0; i < this.controls.length; i++) {
            this.controls[i].draw(this.context);
        }
    },

    drawBrickPreview: function () {
        this.context.beginPath();
        this.context.strokeStyle = 'grey';
        this.context.lineWidth = 1;
        this.context.rect(PREVIEW_LEFT, PREVIEW_TOP, PREVIEW_WIDTH, PREVIEW_HEIGHT);
        this.context.stroke();

        this.previewBrick.draw(this.context);

    },

    processControlsClick: function (point) {
        for (var i = 0; i < this.controls.length; i++) {
            var control = this.controls[i];

            if (pointInObject(point, control)) {
                if (!this.previewBrick.color && !control.color) {
                    this.selectedColor = control.color;
                }

                if (control.color) {
                    this.previewBrick.color = control.color;
                    this.previewBrick.lives = control.lives;
                    this.colorBorder = {
                        left  : control.left - 3,
                        top   : control.top - 3,
                        width : control.width + 6,
                        height: control.height + 6
                    };
                }

                if (control.metalWalls.length > 0) {

                    var wallBorder = {
                        left  : control.left - 3,
                        top   : control.top - 3,
                        width : control.width + 6,
                        height: control.height + 6
                    };

                    var side = control.metalWalls[0];
                    if (this.previewBrick.hasMetalWall(side)) {
                        this.previewBrick.metalWalls.splice(this.previewBrick.metalWalls.indexOf(side), 1);

                        for (var j = 0; j < this.wallBorders.length; j++) {
                            if (this.wallBorders[j].left == wallBorder.left && this.wallBorders[j].top == wallBorder.top) {
                                this.wallBorders.splice(j, 1);
                                break;
                            }
                        }

                    } else {
                        this.previewBrick.metalWalls.push(side);
                        this.wallBorders.push(wallBorder);

                    }

//
//                    var wall = control.metalWalls[0];
//                    var wallIndex = this.previewBrick.metalWalls.indexOf(wall);
//                    if (!this.previewBrick.hasMetalWall(wall)) {
//                        this.wallBorders.push(wallBorder);
//                        this.previewBrick.metalWalls.push(wall);
//                    } else {
//                        this.wallBorders.splice(this.wallBorders.indexOf(wallBorder), 1);
//                        this.previewBrick.metalWalls.splice(wallIndex, 1);
//                    }
                }

                return;
            }
        }
    },

    processGridClick: function (point, button, ctrl) {

        var top = point.top - (point.top - CONTROL_PANEL_HEIGHT) % BRICK_HEIGHT;
        var left = point.left - point.left % BRICK_WIDTH;

        var brick;
        for (var i = 0; i < this.bricks.length; i++) {
            brick = this.bricks[i];
            if (brick.top == top && brick.left == left) {

                if (ctrl) {
                    this.previewBrick.color = brick.color;
                    this.previewBrick.lives = brick.lives;
                    this.previewBrick.metalWalls = brick.metalWalls.slice(0);

                    this.wallBorders = [];

                    for (var j = 0; j < this.controls.length; j++) {
                        var control = this.controls[j];

                        if (control.color == this.previewBrick.color && control.lives == this.previewBrick.lives) {
                            this.colorBorder = {
                                left  : control.left - 3,
                                top   : control.top - 3,
                                width : control.width + 6,
                                height: control.height + 6
                            };
                        }

                        if (control.metalWalls.length > 0) {
                            if (this.previewBrick.hasMetalWall(control.metalWalls[0])) {
                                var wallBorder = {
                                    left  : control.left - 3,
                                    top   : control.top - 3,
                                    width : control.width + 6,
                                    height: control.height + 6
                                };

                                this.wallBorders.push(wallBorder);
                            }
                        }
                    }
                } else {
                    this.bricks.splice(i, 1);
                }

            }
        }

        if (button == 0) {
            if (this.previewBrick.color) {

                brick = new Brick({
                    left      : left,
                    top       : top,
                    color     : this.previewBrick.color,
                    lives     : this.previewBrick.lives,
                    metalWalls: this.previewBrick.metalWalls.slice(0)
                });

                this.bricks.push(brick);
            }
        }
    },

    drawColorBorder: function () {
        if (this.colorBorder) {
            this.context.beginPath();
            this.context.strokeStyle = 'red';
            this.context.lineWidth = 2;
            this.context.rect(this.colorBorder.left, this.colorBorder.top, this.colorBorder.width, this.colorBorder.height);
            this.context.stroke();
        }
    },

    drawWallBorder: function () {
        if (this.wallBorders.length) {
            for (var i = 0; i < this.wallBorders.length; i++) {
                var border = this.wallBorders[i];
                this.context.beginPath();
                this.context.strokeStyle = 'red';
                this.context.lineWidth = 2;
                this.context.rect(border.left, border.top, border.width, border.height);
                this.context.stroke();
            }
        }
    },

    drawBricks: function () {
        for (var i = 0; i < this.bricks.length; i++) {
            this.bricks[i].draw(this.context);
        }

    },

    draw: function () {
        this.drawScene();
        this.drawControls();
        this.drawColorBorder();
        this.drawWallBorder();
        this.drawBrickPreview();
        this.drawBricks();
    },

    start: function () {
        SPRITESHEET.src = SPRITESHEET_SRC;
        SPRITESHEET.onload = function () {
            editor.startEditor();
        };
    },

    startEditor: function () {
        this.createControls();
        requestAnimationFrame(this.animate);
    },

    animate: function () {
        editor.draw();
        requestAnimationFrame(editor.animate);
    },

    getLevelCode: function () {
        var res = [];
        for (var i = 0; i < this.bricks.length; i++) {
            var brick = this.bricks[i];
            res.push({
                left      : brick.left,
                top       : brick.top - CONTROL_PANEL_HEIGHT,
                color     : brick.color,
                lives     : brick.lives,
                metalWalls: brick.metalWalls
            });
        }

        return 'LEVELS.push(' + JSON.stringify(res) + ');';
    },

    loadLevelCode: function (code) {
        var LEVELS = [];
        eval(code);

        for (var i = 0; i < LEVELS[0].length; i++) {
            var brick = LEVELS[0][i];
            this.bricks.push(new Brick({
                left      : brick.left,
                top       : brick.top + CONTROL_PANEL_HEIGHT,
                color     : brick.color,
                lives     : brick.lives,
                metalWalls: brick.metalWalls
            }));
        }
    }
}
;

// Запуск
var editor;

$(function () {

    editor = new Editor('scene');
    editor.start();
});

var mousePressed = false;

$(window).on('mousedown', function (event) {
    mousePressed = event.button;

    if (event.pageX > editor.contextXLeft
        && event.pageX < editor.contextXRight
        && event.pageY > editor.contextYTop
        && event.pageY < editor.contextYBot
        ) {

        var mLeft = event.pageX - editor.contextXLeft;
        var mTop = event.pageY;

        if (mTop < CONTROL_PANEL_HEIGHT) {
            editor.processControlsClick(new Point(mLeft, mTop));
        } else {
            editor.processGridClick(new Point(mLeft, mTop), event.button, event.ctrlKey);
        }
    }
});

$(window).on('mouseup', function (event) {
    mousePressed = false;
});

$(window).on('mousemove', function (event) {
    if (mousePressed !== false) {
        if (event.pageX > editor.contextXLeft
            && event.pageX < editor.contextXRight
            && event.pageY > editor.contextYTop + CONTROL_PANEL_HEIGHT
            && event.pageY < editor.contextYBot
            ) {

            var mLeft = event.pageX - editor.contextXLeft;
            var mTop = event.pageY;
            editor.processGridClick(new Point(mLeft, mTop), mousePressed, false);
        }
    }

});


//for (var i = 0; i < editor.bricks.length; i++) {
//    for (var j = i + 1; j < editor.bricks.length; j++) {
//        if ((editor.bricks[i].left == editor.bricks[j].left) && (editor.bricks[i].top == editor.bricks[j].top)) {
//            console.log('error')
//        }
//    }
//}