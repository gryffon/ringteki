const DrawCard = require('../../drawcard.js');

class KarmicTwist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move fate from a non-unique character',
            target: {
                activePromptTitle: 'Choose a donor character',
                cardType: 'character',
                gameAction: ability.actions.removeFate(),
                cardCondition: (card, context) => !card.isUnique() && card.controller.cardsInPlay.any(c => (
                    !c.isUnique() && c.fate === 0 && c.allowGameAction('placeFate', context)
                ))
            },
            effect: 'move fate from {0} to another non-unique character',
            handler: context => this.game.promptForSelect(context.player, {
                activePromptTitle: 'Choose a recipient character',
                cardType: 'character',
                context: context,
                cardCondition: card => 
                    !card.isUnique() && 
                    card.getFate() === 0 && 
                    card.controller === context.target.controller && 
                    card.allowGameAction('placeFate', context),
                onSelect: (player, card) => {
                    this.game.addMessage('{0} moves {1} fate from {2} to {3}', player, context.target.fate, context.target, card);
                    ability.actions.removeFate(context.target.fate, card).resolve(context.target, context);
                    return true;
                }
            })
        });
    }
}

KarmicTwist.id = 'karmic-twist';

module.exports = KarmicTwist;
