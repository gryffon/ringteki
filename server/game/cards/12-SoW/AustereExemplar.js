const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AustereExemplar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take three actions',
            cost: AbilityDsl.costs.payFateToRing(),
            condition: (context) => context.source.isAttacking(),
            effect: 'take three actions',
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Durations.UntilPassPriority,
                effect: AbilityDsl.effects.additionalAction(3)
            })
        });
    }
}

AustereExemplar.id = 'austere-exemplar';

module.exports = AustereExemplar;
