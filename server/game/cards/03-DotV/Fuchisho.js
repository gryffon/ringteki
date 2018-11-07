const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');

class Fushicho extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Resurrect a character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: 'character',
                location: Locations.DynastyDiscardPile,
                controller: Players.Self,
                cardCondition: card => card.isFaction('phoenix'),
                gameAction: ability.actions.putIntoPlay({ fate: 1 })
            }
        });
    }
}

Fushicho.id = 'fushicho';

module.exports = Fushicho;
