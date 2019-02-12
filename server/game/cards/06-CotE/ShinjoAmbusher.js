const DrawCard = require('../../drawcard.js');
const { Locations } = require('../../Constants');

class ShinjoAmbusher extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Disable a province',
            when: {
                onCardPlayed: (event, context) => event.card === context.source && context.source.isParticipating()
            },
            effect: 'prevent {1} from triggering its abilities this conflict',
            effectArgs: context => context.game.currentConflict.conflictProvince,
            gameAction: ability.actions.cardLastingEffect(() => ({
                target: this.game.currentConflict.conflictProvince,
                targetLocation: Locations.Provinces,
                effect: ability.effects.cardCannot('triggerAbilities')
            }))
        });
    }
}

ShinjoAmbusher.id = 'shinjo-ambusher';

module.exports = ShinjoAmbusher;
