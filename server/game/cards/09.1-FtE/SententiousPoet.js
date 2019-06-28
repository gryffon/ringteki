const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class SententiousPoet extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onCardPlayed: (event, context) =>
                    event.player === context.player.opponent &&
                    context.source.isParticipating() &&
                    (event.context.costs.fate > 0 || event.context.costs.targetDependentFate > 0)
            },
            gameAction: AbilityDsl.actions.gainFate()
        });
    }
}

SententiousPoet.id = 'sententious-poet';

module.exports = SententiousPoet;

