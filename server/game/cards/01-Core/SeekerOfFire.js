const RoleCard = require('../../rolecard.js');
const { Elements } = require('../../Constants');

class SeekerOfFire extends RoleCard {
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
        return [Elements.Fire];
    }
}

SeekerOfFire.id = 'seeker-of-fire';

module.exports = SeekerOfFire;
