const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class RegalBearing extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Lower bid and draw bid difference as cards',
            limit: AbilityDsl.limit.perConflict(1),
            condition: context => context.game.isDuringConflict('political') &&
                context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')),
            effect: 'set their bid dial to 1 and draw {1} cards.',
            effectArgs: context => this.getHonorDialDifference(context),
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.setHonorDial(context => ({
                    target: context.player,
                    value: 1
                })),
                AbilityDsl.actions.draw(context => ({
                    target: context.player,
                    amount: this.getHonorDialDifference(context)
                }))
            ])
        });
    }

    getHonorDialDifference(context) {
        if(!context.player.opponent) {
            return 0;
        }

        return Math.abs(context.player.showBid - context.player.opponent.showBid);
    }
}

RegalBearing.id = 'regal-bearing';

module.exports = RegalBearing;

