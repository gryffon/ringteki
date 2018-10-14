const DrawCard = require('../../drawcard.js');

class BayushiCollector extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard an attachment and a status token',
            target: {
                cardType: 'attachment',
                cardCondition: card => card.parent && card.parent.isDishonored,
                gameAction: [ability.actions.discardFromPlay(),
                    ability.actions.discardStatusToken(context => ({
                        target: context.target.parent}))
                ]
            }
        });
    }
}

BayushiCollector.id = 'bayushi-collector';

module.exports = BayushiCollector;
