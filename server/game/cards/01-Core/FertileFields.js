const ProvinceCard = require('../../provincecard.js');

class FertileFields extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            // DrawAction here
            title: 'Draw a card',
            condition: context => this.game.currentConflict && this.game.currentConflict.conflictProvince === context.source,
            effect: 'draw a card',
            handler: context => context.player.drawCardsToHand(1)
        });
    }
}

FertileFields.id = 'fertile-fields';

module.exports = FertileFields;
