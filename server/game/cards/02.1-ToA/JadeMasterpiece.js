const DrawCard = require('../../drawcard.js');

class JadeMasterpiece extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move a fate to an unclaimed ring',
            cost: ability.costs.bowSelf(),
            target: {
                mode: 'ring',
                activePromptTitle: 'Choose an unclaimed ring to move fate from',
                ringCondition: ring => ring.isUnclaimed() && ring.fate > 0
            },
            effect: 'move 1 fate from {0} to an unclaimed ring',
            handler: context => this.game.promptForRingSelect(context.player, {
                activePromptTitle: 'Choose an unclaimed ring to move fate to',
                context: context,
                ringCondition: ring => ring.isUnclaimed() && ring !== context.ring,
                onSelect: (player, ring) => {
                    this.game.addMessage('{0} moves 1 fate from {2} to {3}', player, context.ring, ring);
                    this.game.openEventWindow(ability.actions.placeFateOnRing({ origin: context.target }).getEvent(ring, context));
                    return true;
                }
            })
        });
    }
}

JadeMasterpiece.id = 'jade-masterpiece';

module.exports = JadeMasterpiece;
