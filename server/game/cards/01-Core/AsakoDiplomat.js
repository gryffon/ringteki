const DrawCard = require('../../drawcard.js');

class AsakoDiplomat extends DrawCard {
    setupCardAbilities() {
        // TODO: add a dedicated game action here?
        this.reaction({
            title: 'Honor or dishonor a character',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player &&
                                                   context.source.isParticipating()
            },
            target: {
                activePromptTitle: 'Choose a character to honor or dishonor',
                cardType: 'character',
                cardCondition: (card, context) => card.location === 'play area' && (card.allowGameAction('dishonor', context) || card.allowGameAction('honor', context))
            },
            handler: context => {
                if(!context.target.allowGameAction('dishonor', context)) {
                    this.game.addMessage('{0} uses {1} to honor {2}', context.player, context.source, context.target);
                    this.game.applyGameAction(context, { honor: context.target });
                } else if(!context.target.allowGameAction('honor', context)) {
                    this.game.addMessage('{0} uses {1} to dishonor {2}', context.player, context.source, context.target);
                    this.game.applyGameAction(context, { dishonor: context.target });
                } else {
                    let choices = [];
                    choices.push('Honor ' + context.target.name);
                    choices.push('Dishonor ' + context.target.name);
                    this.game.promptWithHandlerMenu(context.player, {                     
                        source: context.source,
                        choices: choices,
                        handlers: [
                            () => {
                                this.game.addMessage('{0} uses {1} to honor {2}', context.player, context.source, context.target);
                                this.game.applyGameAction(context, { honor: context.target });
                            },
                            () => {
                                this.game.addMessage('{0} uses {1} to dishonor {2}', context.player, context.source, context.target);
                                this.game.applyGameAction(context, { dishonor: context.target });
                            }
                        ]
                    });
                }
            }
        });
    }
}

AsakoDiplomat.id = 'asako-diplomat';

module.exports = AsakoDiplomat;
