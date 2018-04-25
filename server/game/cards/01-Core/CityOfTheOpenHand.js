const StrongholdCard = require('../../strongholdcard.js');

class CityOfTheOpenHand extends StrongholdCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Steal an honor',
            cost: ability.costs.bowSelf(),
            condition: context => context.player.opponent && context.player.honor < context.player.opponent.honor,
            message: 'steal an honor from {0}',
            messageItems: context => context.player.opponent,
            handler: context => this.game.transferHonor(context.player.opponent, context.player, 1)
        });
    }
}

CityOfTheOpenHand.id = 'city-of-the-open-hand';

module.exports = CityOfTheOpenHand;
