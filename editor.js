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

    this.contextHeight = this.context.canvas.height;

    this.contextXLeft = $(this.canvas).offset().left;
    this.contextXRight = this.contextXLeft + PG_WIDTH;
    this.mainCanvasTop = $(this.canvas).offset().top;
    this.contextYBot = this.mainCanvasTop + this.contextHeight;

    this.controls = [];

    this.bricks = [];
    this.previewBrick = null;
};

Editor.prototype = {

    createControls: function () {
        var i;
        for (i = 0; i < Object.keys(BRICK.sprites.bricks).length; i++) {
            this.controls.push(new Brick({
                left: i * (BRICK.width + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
                top: BRICK_TOP_OFFSET,
                brickType: i
            }));
        }

        this.controls.push(new Brick({
            left: BRICK_LEFT_OFFSET,
            top: 2 * (BRICK_TOP_OFFSET + BRICK.height),
            brickType: 0,
            metalWalls: [TOP]
        }));

        this.controls.push(new Brick({
            left: (BRICK.width + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
            top: 2 * (BRICK_TOP_OFFSET + BRICK.height),
            brickType: 0,
            metalWalls: [BOT]
        }));

        this.controls.push(new Brick({
            left: 2 * (BRICK.width + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
            top: 2 * (BRICK_TOP_OFFSET + BRICK.height),
            brickType: 0,
            metalWalls: [LEFT]
        }));

        this.controls.push(new Brick({
            left: 3 * (BRICK.width + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
            top: 2 * (BRICK_TOP_OFFSET + BRICK.height),
            brickType: 0,
            metalWalls: [RIGHT]
        }));

        this.previewBrick = new Brick({
            left: PREVIEW_LEFT + (PREVIEW_WIDTH - BRICK.width) / 2,
            top: PREVIEW_TOP + (PREVIEW_HEIGHT - BRICK.height) / 2,
            brickType: 0
        });

    },

    drawScene: function () {

        this.context.beginPath();
        this.context.lineWidth = 1;
        this.context.fillStyle = 'white';
        this.context.fillRect(0, 0, PG_WIDTH, this.contextHeight);

        this.context.beginPath();
        this.context.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        this.context.lineWidth = 1;

        var xCnt = PG_WIDTH / BRICK.width;
        for (var i = 0; i <= xCnt; i++) {
            this.context.moveTo(i * BRICK.width, CONTROL_PANEL_HEIGHT);
            this.context.lineTo(i * BRICK.width, this.contextHeight);
        }

        var yCnt = this.contextHeight / BRICK.height;
        for (var j = 0; j <= yCnt; j++) {
            this.context.moveTo(0, CONTROL_PANEL_HEIGHT + j * BRICK.height);
            this.context.lineTo(PG_WIDTH, CONTROL_PANEL_HEIGHT + j * BRICK.height);
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

            if (control.metalWalls.length > 0) {
                control.brickType = this.previewBrick.brickType;

                if (pointInObject(point, control)) {
                    var side = control.metalWalls[0];
                    if (this.previewBrick.hasMetalWall(side)) {
                        this.previewBrick.metalWalls.splice(this.previewBrick.metalWalls.indexOf(side), 1);
                    } else {
                        this.previewBrick.metalWalls.push(side);
                    }
                }
            } else {
                if (pointInObject(point, control)) {
                    this.previewBrick.brickType = control.brickType;
                }
            }
        }
    },

    processGridClick: function (point, button, ctrl) {

        var top = point.top - (point.top - CONTROL_PANEL_HEIGHT) % BRICK.height;
        var left = point.left - point.left % BRICK.width;

        var brick;
        for (var i = 0; i < this.bricks.length; i++) {
            brick = this.bricks[i];
            if (brick.top == top && brick.left == left) {

                if (ctrl) {
                    this.previewBrick.brickType = brick.brickType;
                    this.previewBrick.metalWalls = brick.metalWalls.slice(0);

                    return;
                } else {
                    this.bricks.splice(i, 1);
                }

            }
        }

        if (button == 0) {

            brick = new Brick({
                left: left,
                top: top,
                brickType: this.previewBrick.brickType,
                metalWalls: this.previewBrick.metalWalls.slice(0)
            });

            this.bricks.push(brick);
        }
    },

    drawBrickTypeBorder: function () {
        for (var i = 0; i < this.controls.length; i++) {
            var control = this.controls[i];
            if (control.brickType == this.previewBrick.brickType && control.metalWalls.length == 0) {
                this.context.beginPath();
                this.context.strokeStyle = 'red';
                this.context.lineWidth = 2;
                this.context.rect(control.left - 3, control.top - 3, control.width + 6, control.height + 6);
                this.context.stroke();
            }
        }
    },

    drawWallBorder: function () {
        for (var i = 0; i < this.controls.length; i++) {
            var control = this.controls[i];
            if (control.metalWalls.length >= 0 && this.previewBrick.hasMetalWall(control.metalWalls[0])) {
                this.context.beginPath();
                this.context.strokeStyle = 'red';
                this.context.lineWidth = 2;
                this.context.rect(control.left - 3, control.top - 3, control.width + 6, control.height + 6);
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
        this.drawBrickTypeBorder();
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
                left: brick.left,
                top: brick.top - CONTROL_PANEL_HEIGHT,
                brickType: brick.brickType,
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
                left: brick.left,
                top: brick.top + CONTROL_PANEL_HEIGHT,
                brickType: brick.brickType,
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
        && event.pageY > editor.mainCanvasTop
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

$(window).on('mouseup', function () {
    mousePressed = false;
});

$(window).on('mousemove', function (event) {
    if (mousePressed !== false) {
        if (event.pageX > editor.contextXLeft
            && event.pageX < editor.contextXRight
            && event.pageY > editor.mainCanvasTop + CONTROL_PANEL_HEIGHT
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