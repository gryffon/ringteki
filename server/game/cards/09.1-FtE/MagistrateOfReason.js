const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');
const { CardTypes, Players } = require('../../Constants');

class MagistrateOfReason extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            targetController: Players.Opponent,
            effect: AbilityDsl.effects.additionalTriggerCost(context =>
                context.source.type === CardTypes.Character ? [AbilityDsl.costs.payFateToRing(1)] : []
            )
        });
    }
}

MagistrateOfReason.id = 'magistrate-of-reason';

module.exports = MagistrateOfReason;
