const DrawCard = require('../../drawcard.js');

class HeightOfFashion extends DrawCard {
    canPlay(context, playType) {
        if(this.game.currentConflict) {
            return false;
        }
        return super.canPlay(context, playType);
    }
}

HeightOfFashion.id = 'height-of-fashion';

module.exports = HeightOfFashion;
