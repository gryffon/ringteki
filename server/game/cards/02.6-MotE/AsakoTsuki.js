const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class AsakoTsuki extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Honor a scholar character',
            when: {
                onClaimRing: event => event.conflict && event.conflict.hasElement('water')
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.hasTrait('scholar'),
                gameAction: ability.actions.honor()
            }
        });
    }
}

AsakoTsuki.id = 'asako-tsuki';

module.exports = AsakoTsuki;
