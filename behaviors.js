CycleBehavior = function (interval, delay) {
    this.interval = interval || 0;  //  milliseconds
    this.delay = delay || 0;
    this.lastAdvance = 0;
};

CycleBehavior.prototype = {
    execute: function (sprite, time, fps) {
        if (this.lastAdvance === 0) {
            this.lastAdvance = time;
        }

        if (this.delay && sprite.artist.cellIndex === 0) {
            if (time - this.lastAdvance > this.delay) {
                sprite.artist.advance();
                this.lastAdvance = time;
            }
        }
        else if (time - this.lastAdvance > this.interval) {
            sprite.artist.advance();
            this.lastAdvance = time;
        }
    }
};

var moveBallBehavior = {

    processWallsCollisions:function(ball) {
        if (ball.isSideWallCollision()) {// Столкновение с боковыми стенками
            ball.invertXDirection();
            return true;
        } else if (ball.isTopWallCollision()) {// Столкновение с потолком
            ball.invertYDirection();
            return true;
        } else if (ball.isBotWallCollision()) {// Не поймали
            ball.invertYDirection();
            return true;
        }

        return false;
    },

    processPadCollision: function (ball) {
        //  Столкновение с pad
        if (ball.dy > 0 &&
            (ball.top + ball.height + ball.dy >= ar.pad.top) &&
            (ball.left + ball.width + ball.dx > ar.pad.left) &&
            (ball.left + ball.dx < ar.pad.left + ar.pad.width)
            ) {

            var padCenter = (ar.pad.left + (ar.pad.width / 2));
            var ballCenter = (ball.left + (ball.width / 2) + ball.dx);

            var deltaDistance = padCenter - ballCenter;
            var halfSumPadWidth = (ar.pad.width + ball.width) / 2;
            var koeff = deltaDistance / halfSumPadWidth;

            var ang = Math.PI / 2 * (koeff + 1);

            ball.setAng(ang)
            return true;
        }

        return false
    },

    processBricksCollisions: function (ball) {
        // Столкновение с кирпичами
        var ballData = ball.getData();
        var horizontalIntersect = [];
        var verticalIntersect = [];

        for (var i = 0; i < ar.bricks.length; i++) {
            var brick = ar.bricks[i];

            if (horizontalIntersect.length == 0) {
                var horizontalLine = ball.dy > 0 ? brick.getTopLine() : brick.getBotLine();
                var horIntersect = isBallHorizontalIntersected(ballData, horizontalLine);
                if (horIntersect) {
                    horizontalIntersect = horIntersect;
                }
            }

            if (verticalIntersect.length == 0) {
                var verticalLine = ball.dx > 0 ? brick.getLeftLine() : brick.getRightLine();
                var vertIntersect = isBallVerticalIntersected(ballData, verticalLine);
                if (vertIntersect) {
                    verticalIntersect = vertIntersect;
                }
            }

            if (horizontalIntersect.length || verticalIntersect.length) {
                brick.processTouch();
            }

            if (horizontalIntersect.length && verticalIntersect.length) {

                var kx = Math.abs(horizontalIntersect[0].x - verticalIntersect[0].x);
                var ky = Math.abs(horizontalIntersect[0].y - verticalIntersect[0].y);

                if (equalPresision(kx, ky)) {
                    ball.invertXDirection();
                    ball.invertYDirection();
                } else if (kx > ky) {
                    ball.invertYDirection();
                } else {
                    ball.invertXDirection();
                }

                return true;

            } else if (horizontalIntersect.length) {
                ball.invertYDirection();

                return true;
            } else if (verticalIntersect.length) {
                ball.invertXDirection();

                return true;
            }
        }

        return false;
    },

    processCollisions: function (ball) {
        if (this.processWallsCollisions(ball)) {
            return true;
        } else if (this.processPadCollision(ball)) {
            return true;
        } else if (this.processBricksCollisions(ball)) {
            return true;
        }

        return false;
    },

    execute: function (ball, time, fps) {
        this.processCollisions(ball);
        ball.move();

    }
};

var movePadBehavior = {

    execute: function (sprite, time, fps) {

        if (sprite.moveDevice == DEVICE_KEYBOARD) {

            if (sprite.moveOption == LEFT) {
                sprite.left = Math.max(sprite.left - PAD_MOVE_DELTA, 0);
            } else if (sprite.moveOption == RIGHT) {
                sprite.left = Math.min(sprite.left + PAD_MOVE_DELTA, ar.contextWidth - sprite.width);
            }

            sprite.moveDevice = false;
        } else if (sprite.moveDevice == DEVICE_MOUSE) {

            sprite.left = Math.max(sprite.moveOption - ar.contextXLeft - (sprite.width / 2), 0);
            sprite.left = Math.min(ar.contextWidth - sprite.width, sprite.left);

            sprite.moveDevice = false;
        }

    }
};

var bonusBehavior = {

    execute: function (bonus, time, fps) {
        // Бонус не пойман
        if (bonus.top > ar.contextHeight){
            ar.removeObject(bonus);
        }

        // Бонус пойман
        if (
            (bonus.top + bonus.height >= ar.contextHeight - PAD_HEIGHT) &&
                (bonus.left + bonus.width > ar.pad.left) &&
                (bonus.left < ar.pad.left + ar.pad.width)
            ) {

            this.applyEffect(bonus);
            ar.removeObject(bonus);
        }

        bonus.top += bonus.dy;
    },

    applyEffect: function (bonus) {
        switch (bonus.effect) {
            case BONUS_TYPE_PAD_INCREASE:
                ar.bonusIncreasePad();
                break;
            case BONUS_TYPE_PAD_DECREASE:
                ar.bonusDecreasePad();
                break;
            case BONUS_TYPE_SPEED_INCREASE:
                ar.bonusIncreaseSpeed()
                break;
            case BONUS_TYPE_SPEED_DECREASE:
                ar.bonusDecreaseSpeed();
                break;
            case BONUS_TYPE_TRIPLE_BALL:
                ar.bonusTripleBall();
                break;
        }
    }
};

