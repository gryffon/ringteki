const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class MatsuSwiftspear extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player.opponent &&
                context.player.hand.size() < context.player.opponent.hand.size(),
            effect: AbilityDsl.effects.modifyMilitarySkill(2)
        });
    }
}

MatsuSwiftspear.id = 'matsu-swiftspear';

module.exports = MatsuSwiftspear;

