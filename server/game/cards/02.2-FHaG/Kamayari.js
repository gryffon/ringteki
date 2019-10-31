const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class Kamayari extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            trait: 'bushi'
        });

        this.reaction({
            title: 'Bow character who triggered ability',
            when: {
                onCardAbilityInitiated: (event, context) => event.card.type === CardTypes.Character && context.source.parent.isParticipating()
            },
            gameAction: ability.actions.bow(context => ({ target: context.event.card }))
        });
    }
}

Kamayari.id = 'kamayari';

module.exports = Kamayari;
