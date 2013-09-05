var Sprite = function (owner) {
//    if (!owner.artist) {
//        console.log('No artist');
//    }

    return this;
};

Sprite.prototype = {
    draw: function (context) {

        if (!this.visible || !this.artist) {
            return;
        }

        context.save();

        this.artist.draw(this, context);

        context.restore();
    },

    update: function (time, fps) {

        if (!this.visible) {
            return;
        }

        for (var i = 0; i < this.behaviors.length; ++i) {

            if (this.behaviors[i] === undefined) {
                return;
            }

            this.behaviors[i].execute(this, time, fps);
        }
    }
};