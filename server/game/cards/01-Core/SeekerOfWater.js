const RoleCard = require('../../rolecard.js');
const { Elements } = require('../../Constants');

class SeekerOfWater extends RoleCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate',
            when: {
                onCardRevealed: (event, context) =>
                    event.card.controller === context.player && event.card.isProvince &&
                    event.card.getElement().some(element => context.source.hasTrait(element))
            },
            gameAction: ability.actions.gainFate()
        });
    }

    getElement() {
        return [Elements.Water];
    }
}

SeekerOfWater.id = 'seeker-of-water';

module.exports = SeekerOfWater;
