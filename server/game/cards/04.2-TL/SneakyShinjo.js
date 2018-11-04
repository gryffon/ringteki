const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class SneakyShinjo extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Play this character',
            location: Locations.Provinces,
            when: {
                onPassDuringDynasty: (event, context) => event.player === context.player
            },
            effect: 'play {0}',
            gameAction: ability.actions.playCard({ location: Locations.ProvinceOne })
        });
    }
}

SneakyShinjo.id = 'sneaky-shinjo';

module.exports = SneakyShinjo;
