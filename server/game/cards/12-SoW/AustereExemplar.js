const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl.js');

class AustereExemplar extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Take three actions',
            cost: AbilityDsl.costs.isAttacking(),
            condition: (context) => context.source.isParticipating(),
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
