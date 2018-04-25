const DrawCard = require('../../drawcard.js');

class CourtMask extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Return court mask to hand',
            message: '{0} returns {1} to their hand, dishonoring {2}',
            messageItems: context => [context.source.parent],
            handler: context => this.game.openEventWindow([
                GameActions.eventTo.returnToHand(context.source, context),
                GameActions.eventTo.dishonor(context.source.parent, context)
            ])
        });
    }
    
    canAttach(card) {
        if(card.controller !== this.controller) {
            return false;
        }
        return super.canAttach(card);
    }
}

CourtMask.id = 'court-mask';

module.exports = CourtMask;

