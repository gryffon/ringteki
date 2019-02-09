const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class OutskirtsSentry extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor a participating character',
            when: {
                onMoveToConflict: (event, context) => context.source.isParticipating()
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isParticipating(),
                gameAction: ability.actions.honor()
            }
        });
    }
}

OutskirtsSentry.id = 'outskirts-sentry';

module.exports = OutskirtsSentry;
