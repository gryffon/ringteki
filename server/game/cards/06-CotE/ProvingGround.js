const DrawCard = require('../../drawcard.js');

class ProvingGround extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Draw a card after winning a duel',
            when: {
                afterDuel: (event, context) => {
                    if(!event.winner) {
                        return false;
                    }
                    if(Array.isArray(event.winner)) {
                        return event.winner.some(card => card.controller === context.player);
                    }
                    return event.winner.controller === context.player;
                }
            },
            gameAction: ability.actions.draw(),
            limit: ability.limit.perRound(2)
        });
    }
}

ProvingGround.id = 'proving-ground';

module.exports = ProvingGround;
