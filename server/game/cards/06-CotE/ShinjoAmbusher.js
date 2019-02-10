const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');

class ShinjoAmbusher extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Disable a province',
            when: {
                onCardPlayed: (event, context) => event.card === context.source && context.source.isParticipating()
            },
            gameAction: ability.actions.cardLastingEffect({
                target: card => card === this.game.currentConflict.conflictProvince,
                targetLocation: Locations.Provinces,
                targetController: Players.Opponent,
                effect: ability.effects.cardCannot('triggerAbilities')
            }),
            effect: 'prevent {0} from triggering its abilities this conflict'
        });
    }
}

ShinjoAmbusher.id = 'shinjo-ambusher';

module.exports = ShinjoAmbusher;
