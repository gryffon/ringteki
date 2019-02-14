const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class VoiceOfHonor extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: (event, context) => event.card.type === CardTypes.Event && context.player.opponent &&
                                                            context.player.getNumberOfCardsInPlay(card => card.isHonored) >
                                                            context.player.opponent.getNumberOfCardsInPlay(card => card.isHonored)
            },
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}

VoiceOfHonor.id = 'voice-of-honor';

module.exports = VoiceOfHonor;

