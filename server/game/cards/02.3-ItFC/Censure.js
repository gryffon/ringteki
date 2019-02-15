const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class Censure extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: event => event.card.type === CardTypes.Event
            },
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.cancel()
        });
    }

    canPlay(context, playType) {
        if(context.player.imperialFavor !== '') {
            return super.canPlay(context, playType);
        }
        return false;
    }
}

Censure.id = 'censure';

module.exports = Censure;
