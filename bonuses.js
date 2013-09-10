Ar.prototype.bonusIncreasePad = function () {
    this.pad.setSize(Math.min(this.pad.size + 2, PAD_MAX_SIZE));
};

Ar.prototype.bonusDecreasePad = function () {
    this.pad.setSize(Math.max(this.pad.size - 2, PAD_MIN_SIZE));
};

Ar.prototype.bonusIncreaseSpeed = function () {
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].incSpeed();
    }
};

Ar.prototype.bonusDecreaseSpeed = function () {
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].decSpeed();
    }
};

Ar.prototype.bonusTripleBall = function () {
    var len = this.balls.length;
    var ball;
    for (var i = 0; i < len; i++) {
        ball = this.balls[i];

        var newBall = this.createBallObject(ball);
        var newBallAng = 120 * Math.PI / 180 + ball.ang;
        newBall.setAng(newBallAng);

        var anotherBall = this.createBallObject(ball);
        var anotherBallAng = 240 * Math.PI / 180 + ball.ang;
        anotherBall.setAng(anotherBallAng);

    }
    this.bonusIncreaseSpeed();
};

Ar.prototype.bonusSmallBall = function () {
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].setSize(BALL_SMALL_SIZE);
    }
};

Ar.prototype.bonusBigBall = function () {
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].setSize(BALL_BIG_SIZE);
    }
};

Ar.prototype.bonusResetBall = function () {
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].setSize(BALL_NORMAL_SIZE);
    }
};

