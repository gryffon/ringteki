const RoleCard = require('../../rolecard.js');

class SeekerOfEarth extends RoleCard {
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
}

SeekerOfEarth.id = 'seeker-of-earth';

module.exports = SeekerOfEarth;
