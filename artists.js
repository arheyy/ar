SpriteSheetArtist = function (cells) {
    this.cells = cells;
    this.cellIndex = 0;

};

SpriteSheetArtist.prototype = {
    advance: function () {
        if (this.cellIndex == this.cells.length - 1) {
            this.cellIndex = 0;
        } else {
            this.cellIndex++;
        }
    },

    draw: function (object, context) {
        var cell = this.cells[this.cellIndex];
        context.drawImage(SPRITESHEET, cell.left, cell.top,
            cell.width, cell.height,
            object.left, object.top,
            cell.width, cell.height);
    }
};

SpritePadArtist = function (cells) {
    this.cells = cells;

};

SpritePadArtist.prototype = {
    draw: function (object, context) {

        // Левый угол
        context.drawImage(SPRITESHEET, this.cells.leftCorner.left, this.cells.leftCorner.top,
            this.cells.leftCorner.width, this.cells.leftCorner.height,
            object.left, object.top,
            this.cells.leftCorner.width, this.cells.leftCorner.height);

        // Середина
        // рисуем на 1 px больше влево и вправо, иначе видны белые полосы, наверное причина в округлении
        context.drawImage(SPRITESHEET, this.cells.middle.left, this.cells.middle.top,
            this.cells.middle.width, this.cells.middle.height,
            object.left + this.cells.leftCorner.width - 1, object.top,
            this.cells.middle.width * object.size + 2, this.cells.middle.height);


        // Правый угол
        context.drawImage(SPRITESHEET, this.cells.rightCorner.left, this.cells.rightCorner.top,
            this.cells.rightCorner.width, this.cells.rightCorner.height,
            object.left + this.cells.leftCorner.width + object.size * this.cells.middle.width, object.top,
            this.cells.rightCorner.width, this.cells.rightCorner.height);
    }
};
