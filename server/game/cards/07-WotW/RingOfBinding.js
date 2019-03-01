const DrawCard = require('../../drawcard.js');
const { Phases } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class RingOfBinding extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: (context) => context.game.currentPhase === Phases.Fate && context.game.getPlayersInFirstPlayerOrder()[1] === context.player,
            effect: [
                AbilityDsl.effects.cardCannot('removeFate'),
                AbilityDsl.effects.cardCannot('discardFromPlay')
            ]
        });
    }
}

RingOfBinding.id = 'ring-of-binding';

module.exports = RingOfBinding;
