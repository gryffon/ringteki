const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class CloudTheMind extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.blank()
        });
    }

    canPlay(context, playType) {
        if(!context.player.cardsInPlay.any(card => card.getType() === CardTypes.Character && card.hasTrait('shugenja'))) {
            return false;
        }

        return super.canPlay(context, playType);
    }
}

CloudTheMind.id = 'cloud-the-mind';

module.exports = CloudTheMind;


