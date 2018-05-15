const DrawCard = require('../../drawcard.js');

class Ambush extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put characters from you hand or provinces into play',
            target: {
                activePromptTitle: 'Choose up to two characters',
                numCards: 2,
                mode: 'maxStat',
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                cardType: 'character',
                cardCondition: (card, context) => (
                    card.isFaction('scorpion') && card.controller === context.player &&
                    ['hand', 'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(card.location)   
                ),
                gameAction: ability.actions.putIntoConflict()
            }
        });
    }
}

Ambush.id = 'ambush';

module.exports = Ambush;
