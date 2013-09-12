var moveBallBehavior = {

    processWallsCollisions: function (ball) {
        if (ball.isSideWallCollision()) {// Столкновение с боковыми стенками
            ball.invertXDirection();
            return true;
        } else if (ball.isTopWallCollision()) {// Столкновение с потолком
            ball.invertYDirection();
            return true;
        } else if (ball.isBotWallCollision()) {// Не поймали
//            ball.alive = false;
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

            var ballCenter = (ball.left + (ball.width / 2) + ball.dx);
            var padCenter = (ar.pad.left + (ar.pad.width / 2));
            var deltaDistance = padCenter - ballCenter;

            var deltaDistanceAbs = Math.abs(deltaDistance)
            var kSize = ar.pad.size / PAD.maxSize;

            if (deltaDistanceAbs > 55 * kSize) {

                var ballBot = ball.top + ball.height + ball.dy;
                var padTop = ar.pad.top;

                if (deltaDistanceAbs < 70 * kSize) {
                    padTop += 6;
                } else if (deltaDistanceAbs < 80 * kSize) {
                    padTop += 8;
                } else if (deltaDistanceAbs < 90 * kSize) {
                    padTop += 10;
                } else if (deltaDistanceAbs < 100 * kSize) {
                    padTop += 12;
                } else {
                    padTop += 14;
                }

                if (ballBot < padTop) {
                    return;
                }
            }

            var halfSumPadWidth = (ar.pad.width + ball.width) / 2;
            var koeff = deltaDistance / halfSumPadWidth;

            var ang = Math.PI / 2 * (koeff + 1);

            ball.setAng(ang);
            return true;
        }

        return false
    },

    processBricksCollisions: function (ball) {
        // Столкновение с кирпичами
        var ballData = ball.getData();
        var horizontalIntersect;
        var verticalIntersect;
        var touchSide = false;

        for (var i = 0; i < ar.bricks.length; i++) {
            var brick = ar.bricks[i];

            if (brick.health <= 0) {
                continue;
            }

            var horizontalSide = ball.dy > 0 ? TOP : BOT;
            var verticalSide = ball.dx > 0 ? LEFT : RIGHT;

            var horizontalLine = brick.getSideLine(horizontalSide);
            var verticalLine = brick.getSideLine(verticalSide);

            horizontalIntersect = isBallHorizontalIntersected(ballData, horizontalLine);
            verticalIntersect = isBallVerticalIntersected(ballData, verticalLine);

            if (horizontalIntersect.length && verticalIntersect.length) {

                var kx = horizontalIntersect[0].x - verticalIntersect[0].x;
                var ky = horizontalIntersect[0].y - verticalIntersect[0].y;

                if (Math.abs(Math.abs(kx) - Math.abs(ky)) < 0.3) {
                    ball.top += ky;
                    ball.left -= kx;
                    ball.invertYDirection();
                    ball.invertXDirection();
                    touchSide = [horizontalSide, verticalSide];
                } else if (Math.abs(kx) >= Math.abs(ky)) {
                    ball.top += ky;
                    ball.invertYDirection();
                    touchSide = horizontalSide;
                } else {
                    ball.left -= kx;
                    ball.invertXDirection();
                    touchSide = verticalSide;
                }

            } else if (horizontalIntersect.length) {
                ball.invertYDirection();
                touchSide = horizontalSide;
            } else if (verticalIntersect.length) {
                ball.invertXDirection();
                touchSide = verticalSide;
            }

            if (touchSide !== false) {
                brick.processTouch(touchSide);
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
            ar.bricksUpdated = true;
            return true;
        }

        return false;
    },

    execute: function (ball) {
        this.processCollisions(ball);
        ball.move();

    }
};

var movePadBehavior = {

    execute: function (pad) {

        if (pad.moveDevice == DEVICE_KEYBOARD) {

            if (pad.moveOption == LEFT) {
                pad.left = Math.max(pad.left - PAD.moveDelta, 0);
            } else if (pad.moveOption == RIGHT) {
                pad.left = Math.min(pad.left + PAD.moveDelta, PG_WIDTH - pad.width);
            }

            pad.moveDevice = false;
        } else if (pad.moveDevice == DEVICE_MOUSE) {

            pad.left = Math.max(pad.moveOption - ar.mainCanvasLeft - (pad.width / 2), 0);
            pad.left = Math.min(PG_WIDTH - pad.width, pad.left);

            pad.moveDevice = false;
        }

    }
};

var bonusBehavior = {

    execute: function (bonus) {
        // Бонус не пойман
        if (bonus.top > PG_HEIGHT) {
            ar.removeBonus(bonus);

            return;
        }

        // Бонус пойман
        if (
            (bonus.top + bonus.height >= PG_HEIGHT - PAD.height) &&
                (bonus.left + bonus.width > ar.pad.left) &&
                (bonus.left < ar.pad.left + ar.pad.width)
            ) {

            this.applyEffect(bonus);
            ar.removeBonus(bonus);

            return;
        }

        bonus.top += bonus.dy;
    },

    applyEffect: function (bonus) {
        switch (bonus.type) {
            case 'padIncrease':
                ar.bonusIncreasePad();
                break;
            case 'padDecrease':
                ar.bonusDecreasePad();
                break;
            case 'speedIncrease':
                ar.bonusIncreaseSpeed();
                break;
            case 'speedDecrease':
                ar.bonusDecreaseSpeed();
                break;
            case 'ballTriple':
                ar.bonusTripleBall();
                break;
            case 'ballSmall':
                ar.bonusSmallBall();
                break;
            case 'ballBig':
                ar.bonusBigBall();
                break;
            case 'ballReset':
                ar.bonusResetBall();
                break;
        }
    }
};

