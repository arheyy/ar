var DynamicSprite = function (object, cells, interval, delay) {
    this.object = object;
    this.cells = cells;
    this.interval = interval;
    this.delay = delay;
    this.cellIndex = 0;
    this.lastAdvance = 0;

    return this;
};

DynamicSprite.prototype = {
    advance: function () {
        if (this.cellIndex == this.cells.length - 1) {
            this.cellIndex = 0;
        } else {
            this.cellIndex++;
        }
    },

    update: function (time) {
        if (this.lastAdvance === 0) {
            this.lastAdvance = time;
        }

        if (this.delay && this.cellIndex === 0) {
            if (time - this.lastAdvance > this.delay) {
                this.advance();
                this.lastAdvance = time;
            }
        }
        else if (time - this.lastAdvance > this.interval) {
            this.advance();
            this.lastAdvance = time;
        }
    },

    draw: function (context) {
        var cell = this.cells[this.cellIndex];
        context.drawImage(SPRITESHEET, cell.left, cell.top,
            cell.width, cell.height,
            this.object.left, this.object.top,
            cell.width, cell.height);
    }
};

var StaticSprite = function (object, cell) {
    this.object = object;
    this.cell = cell;

    return this;
};

StaticSprite.prototype = {
    draw: function (context) {
        context.drawImage(SPRITESHEET, this.cell.left, this.cell.top,
            this.cell.width, this.cell.height,
            this.object.left, this.object.top,
            this.cell.width, this.cell.height);
    },

    update: function (time) {
    }
};

var BrickSprite = function (object, cells) {
    this.object = object;
    this.cells = cells;

    return this;
};

BrickSprite.prototype = {
    draw: function (context) {
        var cell = this.cells[this.object.brickType];
        context.drawImage(SPRITESHEET, cell.left, cell.top,
            cell.width, cell.height,
            this.object.left, this.object.top,
            cell.width, cell.height);
    },

    update: function (time) {
    }
};

var BrokenSprite = function (object, cells) {
    this.object = object;
    this.cells = cells;

    return this;
};

BrokenSprite.prototype = {
    draw: function (context) {

        if (this.object.lives == 1) {
            return;
        }

        if (this.object.lives == this.object.health) {
            return;
        }

        var cell;

        if (this.object.lives == 2) {
            cell = this.cells[1];
        }

        if (this.object.lives === 3) {
            if (this.object.health == 2) {
                cell = this.cells[0];
            } else {
                cell = this.cells[1];
            }
        }

        context.drawImage(SPRITESHEET, cell.left, cell.top,
            cell.width, cell.height,
            this.object.left, this.object.top,
            cell.width, cell.height);
    },

    update: function (time) {
    }
};

var MetalWallSprite = function (object, cells) {
    this.object = object;
    this.cells = cells;

    return this;
};

MetalWallSprite.prototype = {
    draw: function (context) {
        var cell;
        if (this.object.hasMetalWall(LEFT)) {
            cell = this.cells[1];
            context.drawImage(SPRITESHEET, cell.left, cell.top,
                cell.width, cell.height,
                this.object.left, this.object.top,
                cell.width, cell.height);
        }
        if (this.object.hasMetalWall(RIGHT)) {
            cell = this.cells[1];
            context.drawImage(SPRITESHEET, cell.left, cell.top,
                cell.width, cell.height,
                this.object.left + this.object.width - cell.width, this.object.top,
                cell.width, cell.height);
        }
        if (this.object.hasMetalWall(TOP)) {
            cell = this.cells[0];
            context.drawImage(SPRITESHEET, cell.left, cell.top,
                cell.width, cell.height,
                this.object.left, this.object.top,
                cell.width, cell.height);
        }

        if (this.object.hasMetalWall(BOT)) {
            cell = this.cells[0];
            context.drawImage(SPRITESHEET, cell.left, cell.top,
                cell.width, cell.height,
                this.object.left, this.object.top + this.object.height - cell.height,
                cell.width, cell.height);
        }
    },

    update: function (time) {
    }
};

var BallSprite = function (object, cells) {
    this.object = object;
    this.cells = cells;

    return this;
};

BallSprite.prototype = {
    draw: function (context) {
        var cell = this.cells[this.object.size];
        context.drawImage(SPRITESHEET, cell.left, cell.top,
            cell.width, cell.height,
            this.object.left, this.object.top,
            cell.width, cell.height);
    },

    update: function (time) {
    }
};

var ButtonSprite = function (object, cell) {
    this.object = object;
    this.cell = cell;

    return this;
};

ButtonSprite.prototype = {
    draw: function (context) {
        var cell = this.cell;
        context.drawImage(SPRITESHEET, cell.left, cell.top,
            cell.width, cell.height,
            this.object.left, this.object.top,
            cell.width, cell.height);

        context.font = "italic 10pt Arial";
        context.textBaseline = "middle";
        context.textAlign = "center";
        context.fillStyle = 'black';
        context.fillText(this.object.label, this.object.left + this.object.width / 2, this.object.top + this.object.height / 2);
    },

    update: function (time) {
    }
};

var BonusSprite = function (object, cells) {
    this.object = object;
    this.cells = cells;

    return this;
};

BonusSprite.prototype = {
    draw: function (context) {
        var carcass = BONUS.sprites['bonusCarcass']
        var cell = BONUS.sprites[this.object.type];

        context.drawImage(SPRITESHEET, carcass.left, carcass.top,
            carcass.width, carcass.height,
            this.object.left, this.object.top,
            carcass.width, carcass.height);

        context.drawImage(SPRITESHEET, cell.left, cell.top,
            cell.width, cell.height,
            this.object.left, this.object.top,
            cell.width, cell.height);
    },

    update: function (time) {
    }
};

var PadSprite = function (object, cell) {
    this.object = object;
    this.cell = cell;

    return this;
};

PadSprite.prototype = {
    draw: function (context) {
        var cell = this.cell;

        context.drawImage(SPRITESHEET, cell.left, cell.top,
            cell.width, cell.height,
            this.object.left, this.object.top,
            this.object.width, this.object.height);
    },

    update: function (time) {
    }
};