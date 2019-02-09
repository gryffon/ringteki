const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class AncestralShrine extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return rings to gain honor',
            cost: AbilityDsl.costs.returnRings(),
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                target: context.player,
                amount: context.costs.returnRing
            }))
        });
    }
}

AncestralShrine.id = 'ancestral-shrine';

module.exports = AncestralShrine;
