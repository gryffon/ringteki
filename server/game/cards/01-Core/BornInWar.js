const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BornInWar extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.modifyMilitarySkill((card, context) => _.size(_.filter(context.game.rings, ring => ring.isUnclaimed())))
        });
    }

    canAttach(card, context) {
        if(card.hasTrait('cavalry')) {
            return super.canAttach(card, context);
        }
        return false;
    }
}

BornInWar.id = 'born-in-war';

module.exports = BornInWar;
