const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class StayYourHand extends DrawCard {
    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel a duel',
            when: {
                onDuelInitiated: (event, context) =>
                    event.context.player === context.player.opponent &&
                    (_.some(event.context.targets, (card) => card.controller === context.player) ||
                    (event.context.targets.target && _.some(event.context.targets.target, (card) => card.controller === context.player)))
            },
            cannotBeMirrored: true,
            effect: 'cancel the duel originating from {1}',
            effectArgs: context => context.event.context.source,
            handler: context => context.cancel()
        });
    }
}

StayYourHand.id = 'stay-your-hand';

module.exports = StayYourHand;
