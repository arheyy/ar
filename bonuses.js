Ar.prototype.bonusIncreasePad = function () {
    this.pad.setSize(Math.min(this.pad.size + 2, PAD_MAX_SIZE));
};

Ar.prototype.bonusDecreasePad = function () {
    this.pad.setSize(Math.max(this.pad.size - 2, PAD_MIN_SIZE));
};

Ar.prototype.bonusIncreaseSpeed = function () {
    var ball;
    for (var i = 0; i < this.balls.length; i++) {
        ball = this.balls[i];
        var speed = Math.min(ball.speed + BALL_SPEED_DELTA, BALL_MAX_SPEED);
        ball.setSpeed(speed);
    }
};

Ar.prototype.bonusDecreaseSpeed = function () {
    var ball;
    for (var i = 0; i < this.balls.length; i++) {
        ball = this.balls[i];
        var speed = Math.max(ball.speed - BALL_SPEED_DELTA, BALL_MIN_SPEED);
        ball.setSpeed(speed);
    }
};

Ar.prototype.bonusTripleBall = function () {
    var len = this.balls.length;
    var ball;
    for (var i = 0; i < len; i++) {
        ball = this.balls[i];

        var newBall = this.createBallObject(ball);
        var newBallAng = rand(2 * Math.PI);
        newBall.setAng(newBallAng);

        var anotherBall = this.createBallObject(ball);
        var anotherBallAng = rand(2 * Math.PI);
        anotherBall.setAng(anotherBallAng);

    }
};