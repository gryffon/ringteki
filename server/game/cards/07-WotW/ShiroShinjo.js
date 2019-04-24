const StrongholdCard = require('../../strongholdcard.js');

class ShiroShinjo extends StrongholdCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Collect additional fate',
            cost: ability.costs.bowSelf(),
            when: {
                onFateCollected: (event, context) => event.player === context.source.controller
            },
            gameAction: ability.actions.gainFate(context => ({ amount: context.player.getNumberOfOpponentsFaceupProvinces() })),
            effect: 'gain {1} fate',
            effectArgs: context => [context.player.getNumberOfOpponentsFaceupProvinces()]
        });
    }
}

ShiroShinjo.id = 'shiro-shinjo';

module.exports = ShiroShinjo;
