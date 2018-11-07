const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class WayOfTheCrane extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor a character',
            target: {
                cardType: 'character',
                controller: Players.Self,
                cardCondition: card => card.isFaction('crane'),
                gameAction: ability.actions.honor()
            }
        });
    }
}

WayOfTheCrane.id = 'way-of-the-crane';

module.exports = WayOfTheCrane;
