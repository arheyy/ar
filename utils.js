Point = function (left, top) {
    return {left: left, top: top};
};

Rect = function (left, top, width, height) {
    return {left: left, top: top, width: width, height: height};
};

function c(obj) {
    if (typeof obj === 'object') {
        obj = $.extend({}, obj);
    }
    console.log(obj);
}
function rand(min, max) {
    if (!max) {
        max = min;
        min = 0;
    }

    return Math.random() * (max - min) + min;
}

function randInt(min, max) {
    if (!max) {
        max = min;
        min = 0;
    }

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function equalPresision(a, b) {
    return (a - b) < 0.01
}

function isBallHorizontalIntersected(ball, line) {
    var x1 = line.x1 - ball.x;
    var x2 = line.x2 - ball.x;
    var r = ball.r;

    var y = line.y2 - ball.y;


    if (Math.abs(y) > r) {
        return [];
    }


    if (y == r && x1 <= 0 && x2 >= 0) {
        return [
            {
                x: ball.x,
                y: line.y1
            }
        ];
    }

    var x3 = Math.sqrt(Math.pow(r, 2) - Math.pow(y, 2));
    var x4 = -x3;

    var res = [];

    if (x3 > x1 && x3 < x2) {
        res.push({
            x: x3 + ball.x,
            y: line.y1
        });
    }

    if (x4 > x1 && x4 < x2) {
        res.push({
            x: x4 + ball.x,
            y: line.y1
        });
    }

    return res;
}


function isBallVerticalIntersected(ball, line) {

    var y1 = line.y1 - ball.y;
    var y2 = line.y2 - ball.y;
    var r = ball.r;

    var x = line.x2 - ball.x;

    if (Math.abs(x) > r) {
        return [];
    }


    if (x == r && y1 <= 0 && y2 >= 0) {
        return [
            {
                x: line.x1,
                y: ball.y
            }
        ];
    }

    var y3 = Math.sqrt(Math.pow(r, 2) - Math.pow(x, 2));
    var y4 = -y3;

    var res = [];

    if (y3 > y1 && y3 < y2) {
        res.push({
            x: line.x1,
            y: y3 + ball.y
        });
    }

    if (y4 > y1 && y4 < y2) {
        res.push({
            x: line.x1,
            y: y4 + ball.y
        });
    }

    return res;
}

function pointInObject(point, object) {
    if (object.left < point.left
        && object.left + object.width > point.left
        && object.top < point.top
        && object.top + object.height > point.top
        ) {
        return true;
    }

    return false;
}