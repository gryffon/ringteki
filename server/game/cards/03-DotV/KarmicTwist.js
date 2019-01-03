const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class KarmicTwist extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Move fate from a non-unique character',
            target: {
                activePromptTitle: 'Choose a donor character',
                cardType: CardTypes.Character,
                cardCondition: card => !card.isUnique(),
                gameAction: AbilityDsl.actions.selectCard(context => ({
                    cardType: CardTypes.Character,
                    activePromptTitle: 'Choose a recipient character',
                    cardCondition: (card, context) => !card.isUnique() && card.fate === 0 && card.controller === context.target.controller,
                    message: '{0} moves {1} fate from {2} to {3}',
                    messageArgs: card => [context.player, context.target.fate, context.target, card],
                    gameAction: AbilityDsl.actions.placeFate({
                        origin: context.target,
                        amount: context.target.fate
                    })
                }))
            },
            effect: 'move fate from {0} to another non-unique character'
        });
    }
}

KarmicTwist.id = 'karmic-twist';

module.exports = KarmicTwist;
