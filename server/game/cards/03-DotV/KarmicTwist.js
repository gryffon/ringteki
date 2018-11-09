const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class KarmicTwist extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move fate from a non-unique character',
            target: {
                activePromptTitle: 'Choose a donor character',
                cardType: CardTypes.Character,
                cardCondition: card => !card.isUnique(),
                gameAction: ability.actions.removeFate(context => ({
                    amount: context.target.fate,
                    promptForSelect: {
                        activePromptTitle: 'Choose a recipient character',
                        cardType: CardTypes.Character,
                        cardCondition: (card, context) => !card.isUnique() && card.fate === 0 && card.controller === context.target.controller,
                        customHandler: (card, action) => {
                            action.recipient = card;
                            this.game.addMessage('{0} moves {1} fate from {2} to {3}', context.player, context.target.fate, context.target, card);
                            return true;
                        }
                    }
                }))
            },
            effect: 'move fate from {0} to another non-unique character'
        });
    }
}

KarmicTwist.id = 'karmic-twist';

module.exports = KarmicTwist;
