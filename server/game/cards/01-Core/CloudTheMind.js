const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class CloudTheMind extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.blank()
        });
    }

    canPlay(context) {
        if(!context.player.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context);
    }
}

CloudTheMind.id = 'cloud-the-mind';

module.exports = CloudTheMind;


