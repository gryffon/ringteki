const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class VengefulOathkeeper extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put this into play',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player &&
                                                   event.conflict.conflictType === 'military'
            },
            location: Locations.Hand,
            gameAction: ability.actions.putIntoPlay()
        });
    }
}

VengefulOathkeeper.id = 'vengeful-oathkeeper';

module.exports = VengefulOathkeeper;

