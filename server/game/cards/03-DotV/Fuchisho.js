const DrawCard = require('../../drawcard.js');

class Fushicho extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            title: 'Resurrect a character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: 'character',
                gameAction: ability.actions.putIntoPlay(1), 
                cardCondition: (card, context) => card.location === 'dynasty discard pile' &&
                                                  card.controller === context.player && card.isFaction('phoenix')
            }
        });
    }
}

Fushicho.id = 'fushicho';

module.exports = Fushicho;
