const DrawCard = require('../../drawcard.js');

class InsultToInjury extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Dishonor the loser of a duel',
            when: {
                afterDuel: (event, context) => {
                    if(!event.winner) {
                        return false;
                    }
                    if(Array.isArray(event.winner)) {
                        return event.winner.some(card => card.hasTrait('duelist') && card.controller === context.player);
                    }
                    return event.winner.hasTrait('duelist') && event.winner.controller === context.player;
                }
            },
            gameAction: ability.actions.dishonor(context => ({ target: context.event.loser }))
        });
    }
}

InsultToInjury.id = 'insult-to-injury';

module.exports = InsultToInjury;
