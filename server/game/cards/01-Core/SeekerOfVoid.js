const RoleCard = require('../../rolecard.js');
const { Elements } = require('../../Constants');

class SeekerOfVoid extends RoleCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onCardRevealed: (event, context) =>
                    event.card.controller === context.player && event.card.isProvince &&
                    context.source.hasTrait(event.card.getElement())
            },
            gameAction: ability.actions.gainFate()
        });
    }

    getElement() {
        return [Elements.Void];
    }
}

SeekerOfVoid.id = 'seeker-of-void';

module.exports = SeekerOfVoid;
