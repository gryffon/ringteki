const DrawCard = require('../../drawcard.js');
const { Players, CardTypes } = require('../../Constants');

class CallowDelegate extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.interrupt({
            title: 'Honor a character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: ability.actions.honor()
            }
        });
    }
}

CallowDelegate.id = 'callow-delegate';

module.exports = CallowDelegate;
