const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class Kamayari extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow character who triggered ability',
            when: {
                onCardAbilityInitiated: (event, context) => event.card.type === CardTypes.Character && context.source.parent.isParticipating()
            },
            gameAction: ability.actions.bow(context => ({ target: context.event.card }))
        });
    }

    canAttach(card, context) {
        if(card.hasTrait('bushi')) {
            return super.canAttach(card, context);
        }
        return false;
    }
}

Kamayari.id = 'kamayari';

module.exports = Kamayari;
