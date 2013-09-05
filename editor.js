var CONTROL_PANEL_HEIGHT = 100;

var PREVIEW_TOP = 20;
var PREVIEW_LEFT = 720;
var PREVIEW_WIDTH = 80;
var PREVIEW_HEIGHT = 60;

var BRICK_TOP_OFFSET = 10;
var BRICK_LEFT_OFFSET = 10;
var BRICK_BETWEEN_DISTANCE = 10;

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
        for (i = 0; i < BRICK_COLORS.length; i++) {
            for (var j = 0; j < 3; j++) {
                this.controls.push(new Brick({
                    left : i * (BRICK_WIDTH + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
                    top  : BRICK_TOP_OFFSET + j * (BRICK_HEIGHT + BRICK_TOP_OFFSET),
                    lives: j + 1,
                    color: BRICK_COLORS[i]
                }));
            }
        }

        this.controls.push(new Brick({
            left      : (BRICK_COLORS.length) * (BRICK_WIDTH + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
            top       : BRICK_TOP_OFFSET,
            color     : null,
            stoneWalls: ['top']
        }));

        this.controls.push(new Brick({
            left      : (BRICK_COLORS.length + 1) * (BRICK_WIDTH + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
            top       : BRICK_TOP_OFFSET,
            color     : null,
            stoneWalls: ['bot']
        }));

        this.controls.push(new Brick({
            left      : (BRICK_COLORS.length + 2) * (BRICK_WIDTH + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
            top       : BRICK_TOP_OFFSET,
            color     : null,
            stoneWalls: ['left']
        }));

        this.controls.push(new Brick({
            left      : (BRICK_COLORS.length + 3) * (BRICK_WIDTH + BRICK_BETWEEN_DISTANCE) + BRICK_LEFT_OFFSET,
            top       : BRICK_TOP_OFFSET,
            color     : null,
            stoneWalls: ['right']
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

                if (control.stoneWalls.length > 0) {
                    var wallBorder = {
                        left  : control.left - 3,
                        top   : control.top - 3,
                        width : control.width + 6,
                        height: control.height + 6
                    };

                    var wall = control.stoneWalls[0];
                    var wallIndex = this.previewBrick.stoneWalls.indexOf(wall);
                    if (wallIndex == -1) {
                        this.wallBorders.push(wallBorder);
                        this.previewBrick.stoneWalls.push(wall);
                    } else {
                        this.wallBorders.splice(this.wallBorders.indexOf(wallBorder), 1);
                        this.previewBrick.stoneWalls.splice(wallIndex, 1);
                    }
                }

                return;
            }
        }
    },

    processGridClick: function (point) {
        if (this.previewBrick.color) {
            var top = point.top - (point.top - CONTROL_PANEL_HEIGHT) % BRICK_HEIGHT;
            var left = point.left - point.left % BRICK_WIDTH;

            var brick = new Brick({
                left      : left,
                top       : top,
                color     : this.previewBrick.color,
                lives     : this.previewBrick.lives,
                stoneWalls: this.previewBrick.stoneWalls.slice(0)
            });

            this.bricks.push(brick);
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
                stoneWalls: brick.stoneWalls
            });
        }

        return JSON.stringify(res);
    }
}
;

// Запуск
var editor;

$(function () {

    editor = new Editor('scene');
    editor.start();
});

$(window).on('click', function (event) {
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
            editor.processGridClick(new Point(mLeft, mTop));
        }
    }
});