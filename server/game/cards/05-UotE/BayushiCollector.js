const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class BayushiCollector extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard an attachment and a status token',
            target: {
                cardType: CardTypes.Attachment,
                cardCondition: card => card.parent && card.parent.isDishonored,
                gameAction: [ability.actions.discardFromPlay(),
                    ability.actions.discardStatusToken(context => ({
                        target: context.target.parent.personalHonor}))
                ]
            }
        });
    }
}

BayushiCollector.id = 'bayushi-collector';

module.exports = BayushiCollector;
