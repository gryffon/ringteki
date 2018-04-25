const DrawCard = require('../../drawcard.js');

class FavorableGround extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Use Favorable Ground',
            condition: () => this.game.currentConflict,
            cost: ability.costs.sacrificeSelf(),
            target: {
                activePromptTitle: 'Choose a character',
                cardType: 'character',
                cardCondition: (card, context) => card.controller === context.player && 
                                                  (card.allowGameAction('sendHome', context) || card.allowGameAction('moveToConflict', context))
            },
            handler: context => {
                if(context.target.allowGameAction('sendHome', context)) {
                    this.game.applyGameAction(context, { sendHome: context.target });
                    this.game.addMessage('{0} sacrifices {1} to send {2} home', context.player, context.source, context.target);
                } else if(context.target.allowGameAction('moveToConflict', context)) {
                    this.game.applyGameAction(context, { moveToConflict: context.target });
                    this.game.addMessage('{0} sacrifices {1} to move {2} into the conflict', context.player, context.source, context.target);
                }
            }
        });
    }
}

FavorableGround.id = 'favorable-ground';

module.exports = FavorableGround;
