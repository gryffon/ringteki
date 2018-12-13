const ProvinceCard = require('../../provincecard.js');
const { CardTypes } = require('../../Constants');

class RagingBattleground extends ProvinceCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.reaction({
            title: 'Choose a character to discard',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => !card.isUnique() && card.getFate() < 1,
                gameAction: ability.actions.discardFromPlay()
            }
        });
    }
}

RagingBattleground.id = 'raging-battleground'; // This is a guess at what the id might be - please check it!!!

module.exports = RagingBattleground;
