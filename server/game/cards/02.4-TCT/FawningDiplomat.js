const AbilityDsl = require('../../abilitydsl.js');
const DrawCard = require('../../drawcard.js');

class FawningDiplomat extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Claim Imperial favor',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source
            },
            effect: 'claim the Emperor\'s favor as she leaves play',
            gameAction: AbilityDsl.actions.claimImperialFavor(context => ({
                target: context.player
            }))
        });
    }
}

FawningDiplomat.id = 'fawning-diplomat';

module.exports = FawningDiplomat;
