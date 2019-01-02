const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes } = require('../../Constants');

class JadeMasterpiece extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move a fate to an unclaimed ring',
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                mode: TargetModes.Ring,
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: ring => ring.isUnclaimed() && ring.fate > 0,
                gameAction: AbilityDsl.actions.selectRing(context => ({
                    activePromptTitle: 'Choose an unclaimed ring to move fate to',
                    ringCondition: ring => ring.isUnclaimed() && ring !== context.ring,
                    message: '{0} moves a fate from {1} to {2}',
                    messageArgs: ring => [context.player, context.ring, ring],
                    gameAction: AbilityDsl.actions.placeFateOnRing({ origin: context.ring })
                }))
            },
            effect: 'move 1 fate from {0} to an unclaimed ring'
        });
    }
}

JadeMasterpiece.id = 'jade-masterpiece';

module.exports = JadeMasterpiece;
