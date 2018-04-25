const DrawCard = require('../../drawcard.js');

class ImperialStorehouse extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Draw a card',
            cost: ability.costs.sacrificeSelf(),
            message: '{0} sacrifices {1} to draw a conflict card',
            handler: context => context.player.drawCardsToHand(1)
        });
    }
}

ImperialStorehouse.id = 'imperial-storehouse';

module.exports = ImperialStorehouse;
