const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BornInWar extends DrawCard {
    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'cavalry'
        });

        this.whileAttached({
            effect: AbilityDsl.effects.attachmentMilitarySkillModifier((card, context) => _.size(_.filter(context.game.rings, ring => ring.isUnclaimed())))
        });
    }
}

BornInWar.id = 'born-in-war';

module.exports = BornInWar;
