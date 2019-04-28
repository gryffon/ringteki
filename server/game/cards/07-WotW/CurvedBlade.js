const DrawCard = require('../../drawcard.js');

class CurvedBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            condition: context => context.source.parent.isAttacking(),
            effect: ability.effects.modifyMilitarySkill(2)
        });
    }

    canAttach(card, context) {
        return card.isFaction('unicorn') && super.canAttach(card, context);
    }
}

CurvedBlade.id = 'curved-blade';

module.exports = CurvedBlade;
