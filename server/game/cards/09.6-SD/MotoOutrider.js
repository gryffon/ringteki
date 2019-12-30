const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class MotoOutrider extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Ready this character',
            condition: context => context.source.isParticipating() && this.game.isDuringConflict('military'),
            gameAction: AbilityDsl.actions.ready()
        });
    }
}

MotoOutrider.id = 'moto-outrider';

module.exports = MotoOutrider;


