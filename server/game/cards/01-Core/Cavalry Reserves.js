const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class CavalryReserves extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put Cavalry into play from your discard',
            condition: () => this.game.isDuringConflict('military'),
            target: {
                mode: 'maxStat',
                activePromptTitle: 'Choose characters',
                cardStat: card => card.getCost(),
                maxStat: () => 6,
                numCards: 0,
                cardType: 'character',
                location: Locations.DynastyDiscardPile,
                controller: 'self',
                cardCondition: card => card.hasTrait('cavalry'),
                gameAction: ability.actions.putIntoConflict()
            }
        });
    }
}

CavalryReserves.id = 'cavalry-reserves';

module.exports = CavalryReserves;
