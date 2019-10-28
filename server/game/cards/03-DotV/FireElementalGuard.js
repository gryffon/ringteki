const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class FireElementalGuard extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard an attachment',
            condition: context =>
                this.game.isDuringConflict() &&
                this.game.currentConflict.getNumberOfCardsPlayed(context.player, card => card.hasTrait('spell')) > 2,
            target: {
                cardType: CardTypes.Attachment,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

FireElementalGuard.id = 'fire-elemental-guard'; // This is a guess at what the id might be - please check it!!!

module.exports = FireElementalGuard;
