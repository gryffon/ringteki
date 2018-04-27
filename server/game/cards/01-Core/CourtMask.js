const DrawCard = require('../../drawcard.js');

class CourtMask extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Return court mask to hand',
            effect: 'return {1} to their hand, dishonoring {0}',
            effectItems: context => context.source,
            handler: context => this.game.applyGameAction(context, { returnToHand: context.source, dishonor: context.source.parent })
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

