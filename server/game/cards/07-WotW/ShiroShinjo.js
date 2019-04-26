const StrongholdCard = require('../../strongholdcard.js');
const { Locations } = require('../../Constants');

class ShiroShinjo extends StrongholdCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Collect additional fate',
            cost: ability.costs.bowSelf(),
            when: {
                onFateCollected: (event, context) => event.player === context.source.controller
            },
            gameAction: ability.actions.gainFate(context => ({ amount: context.player.getNumberOfOpponentsFaceupProvinces(province => province.location !== Locations.StrongholdProvince) }))
        });
    }
}

ShiroShinjo.id = 'shiro-shinjo';

module.exports = ShiroShinjo;
