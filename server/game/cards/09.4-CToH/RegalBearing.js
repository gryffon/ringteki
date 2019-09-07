const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class RegalBearing extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Drop your bid to 1 and then draw cards equal to the difference between honor dials',
            condition: context => context.game.currentConflict.conflictType === 'political' &&
                context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')),
            effect: 'set their bid dial to 1 and draw {1} cards.',
            effectArgs: context => this.getHonorDialDifference(context),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.setHonorDial({
                    value: 1
                }),
                AbilityDsl.actions.draw(context => ({
                    target: context.player,
                    amount: this.getHonorDialDifference(context)
                }))
            ])
        });
    }

    getHonorDialDifference(context) {
        return Math.abs(context.player.showBid - context.player.opponent.showBid);
    }
}

RegalBearing.id = 'regal-bearing';

module.exports = RegalBearing;

