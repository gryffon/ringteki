const DrawCard = require('../../drawcard.js');

class Ambush extends DrawCard {
    setupCardAbilities() {
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
                gameAction: 'putIntoConflict',
                cardCondition: card => (
                    card.isFaction('scorpion') && !card.facedown &&
                    ['hand', 'province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && 
                    card.controller === this.controller
                )
            }
        });
    }
}

Ambush.id = 'ambush';

module.exports = Ambush;
