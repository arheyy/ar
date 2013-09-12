Ar.prototype.bonusIncreasePad = function () {
    this.pad.setSize(Math.min(this.pad.size + 1, PAD.maxSize));
};

Ar.prototype.bonusDecreasePad = function () {
    this.pad.setSize(Math.max(this.pad.size - 1, PAD.minSize));
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
        this.balls[i].setSize('small');
    }
};

Ar.prototype.bonusBigBall = function () {
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].setSize('big');
    }
};

Ar.prototype.bonusResetBall = function () {
    for (var i = 0; i < this.balls.length; i++) {
        this.balls[i].setSize('normal');
    }
};

