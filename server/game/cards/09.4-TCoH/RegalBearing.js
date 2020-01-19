const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class RegalBearing extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Lower bid and draw bid difference as cards',
            max: AbilityDsl.limit.perConflict(1),
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

        // Players honor bid will be one but this is calculated before dials are changed.
        return Math.abs(1 - context.player.opponent.showBid);
    }
}

RegalBearing.id = 'regal-bearing';

module.exports = RegalBearing;

