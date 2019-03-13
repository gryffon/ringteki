const DrawCard = require('../../drawcard.js');
const { Phases } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class RingOfBinding extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            condition: (context) => context.game.currentPhase === Phases.Fate && context.player.firstPlayer,
            effect: [
                AbilityDsl.effects.cardCannot('removeFate'),
                AbilityDsl.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}

RingOfBinding.id = 'ring-of-binding';

module.exports = RingOfBinding;
