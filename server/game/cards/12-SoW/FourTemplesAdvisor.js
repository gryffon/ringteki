const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class FourTemplesAdvisor extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Draw a card',
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            when: {
                onMoveFate: (event, context) => event.origin && event.origin.type === 'ring' && event.recipient && event.recipient === context.player
            },
            gameAction: AbilityDsl.actions.draw(),
            effect: 'draw a card'
        });
    }
}

FourTemplesAdvisor.id = 'four-temples-advisor';

module.exports = FourTemplesAdvisor;
