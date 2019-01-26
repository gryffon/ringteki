const RoleCard = require('../../rolecard.js');

class SeekerOfAir extends RoleCard {
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
        return ['air'];
    }
}

SeekerOfAir.id = 'seeker-of-air';

module.exports = SeekerOfAir;
