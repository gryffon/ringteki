const DrawCard = require('../../drawcard.js');

class Ambush extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put characters from you hand or provinces into play',
            condition: () => this.game.currentConflict,
            target: {
                mode: 'maxStat',
                activePromptTitle: 'Choose up to two characters',
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                numCards: 2,
                multiSelect: true,
                cardType: 'character',
                gameAction: ability.actions.putIntoConflict(),
                cardCondition: (card, context) => (
                    card.isFaction('scorpion') && card.controller === context.player &&
                    ['hand', 'province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(card.location)   
                )
            }
        });
    }
}

Ambush.id = 'ambush';

module.exports = Ambush;
