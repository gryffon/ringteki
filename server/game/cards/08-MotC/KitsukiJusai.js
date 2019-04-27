const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class KitsukiJusai extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Put a fate from your opponent pool on an unclaimed ring',
            when: {
                onHonorDialsRevealed: (event, context) =>
                    context.player.opponent &&
                    context.player.honorBid === context.player.opponent.honorBid &&
                    context.player.opponent.fate > 0
            },
            gameAction: AbilityDsl.actions.selectRing(context => ({
                activePromptTitle: 'Choose an unclaimed ring to move fate to',
                ringCondition: ring => ring.isUnclaimed(),
                message: '{0} moves a fate from {1}\'s fate pool to the {2}',
                messageArgs: ring => [context.player, context.player.opponent, ring],
                gameAction: AbilityDsl.actions.placeFateOnRing({ origin: context.player.opponent })
            })),
            effect: 'move 1 fate from {1}\'s fate pool to an unclaimed ring',
            effectArgs: context => [context.player.opponent]
        });
    }
}

KitsukiJusai.id = 'kitsuki-jusai';

module.exports = KitsukiJusai;
