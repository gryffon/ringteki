const RoleCard = require('../../rolecard.js');

class SeekerOfWater extends RoleCard {
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
        return ['water'];
    }
}

SeekerOfWater.id = 'seeker-of-water';

module.exports = SeekerOfWater;
