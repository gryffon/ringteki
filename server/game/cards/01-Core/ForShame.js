const DrawCard = require('../../drawcard.js');

class ForShame extends DrawCard {
    setupCardAbilities() {
        // TODO: rewrite this to use sequential targeting
        this.action({
            title: 'Dishonor or bow a character',
            condition: context => context.player.anyCardsInPlay(card => card.isParticipating() && card.hasTrait('courtier')),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.controller !== context.player && card.isParticipating() && 
                                                  (card.allowGameAction('bow', context) || card.allowGameAction('dishonor', context))
            },
            handler: context => {
                if(!context.target.allowGameAction('bow', context)) {
                    this.game.addMessage('{0} uses {1} to dishonor {2}', context.player, context.source, context.target);
                    this.game.applyGameAction(context, { dishonor: context.target });
                } else if(!context.target.allowGameAction('dishonor', context)) {
                    this.game.addMessage('{0} uses {1} to bow {2}', context.player, context.source, context.target);
                    this.game.applyGameAction(context, { bow: context.target });
                } else {
                    this.game.promptWithHandlerMenu(context.target.controller, {
                        source: context.source,
                        choices: ['Dishonor this character', 'Bow this character'],
                        controls: { type: 'targeting', targets: [context.target] },
                        handlers: [
                            () => {
                                this.game.addMessage('{0} uses {1} to dishonor {2}', context.player, context.source, context.target);
                                this.game.applyGameAction(context, { dishonor: context.target });
                            },
                            () => {
                                this.game.addMessage('{0} uses {1} to bow {2}', context.player, context.source, context.target);
                                this.game.applyGameAction(context, { bow: context.target });
                            }
                        ]
                    });
                }
            }
        });
    }
}

ForShame.id = 'for-shame';

module.exports = ForShame;
