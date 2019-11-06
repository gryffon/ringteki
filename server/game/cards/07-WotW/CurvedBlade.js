const DrawCard = require('../../drawcard.js');

class CurvedBlade extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            faction: 'unicorn'
        });

        this.whileAttached({
            condition: context => context.source.parent.isAttacking(),
            effect: ability.effects.modifyMilitarySkill(2)
        });
    }
}

CurvedBlade.id = 'curved-blade';

module.exports = CurvedBlade;
