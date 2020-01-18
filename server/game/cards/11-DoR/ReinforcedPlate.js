const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class ReinforcedPlate extends DrawCard {
    setupCardAbilities() {
        this.whileAttached({
            condition: context => context.source.parent.isParticipating() && this.game.isDuringConflict('military'),
            effect: AbilityDsl.effects.immunity({
                restricts: 'opponentsEvents'
            })
        });
    }
}

ReinforcedPlate.id = 'reinforced-plate';

module.exports = ReinforcedPlate;
