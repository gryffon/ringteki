const DrawCard = require('../../drawcard.js');

class CavalryReserves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Cavalry into play from your discard',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'military',
            target: {
                mode: 'maxStat',
                activePromptTitle: 'Choose characters',
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                numCards: 0,
                cardType: 'character',
                cardCondition: (card, context) => card.hasTrait('cavalry') && card.location === 'dynasty discard pile' && card.controller === context.player,
                gameAction: ability.actions.putIntoConflict()
            }
        });
    }
}

CavalryReserves.id = 'cavalry-reserves';

module.exports = CavalryReserves;
