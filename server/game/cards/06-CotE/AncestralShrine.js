const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class AncestralShrine extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return rings to gain honor',
            cost: AbilityDsl.costs.returnRings(),
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                amount: context.costs.returnRing ? context.costs.returnRing.length : 1
            }))
        });
    }
}

AncestralShrine.id = 'ancestral-shrine';

module.exports = AncestralShrine;
