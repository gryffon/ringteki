const StrongholdCard = require('../../strongholdcard.js');

class ShiroShinjo extends StrongholdCard {
    setupCardAbilities(ability) {
        this.reaction(context => ({
            title: 'Collect additional fate',
            cost: ability.costs.bowSelf(),
            when: {
                onIncomeCollected: (event, context) => event.player === context.source.controller
            },
            gameAction: ability.actions.gainFate({ amount: context.player.getNumberOfOpponentsFaceupProvinces() }),
            effect: 'gain {1} fate',
            effectArgs: () => [context.player.getNumberOfOpponentsFaceupProvinces()]
        }));
    }
}

ShiroShinjo.id = 'shiro-shinjo';

module.exports = ShiroShinjo;
