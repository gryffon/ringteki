const DrawCard = require('../../drawcard.js');

class WayOfTheCrane extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor a character',
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isFaction('crane') && card.controller === context.player,
                gameAction: ability.actions.honor()
            }
        });
    }
}

WayOfTheCrane.id = 'way-of-the-crane';

module.exports = WayOfTheCrane;
