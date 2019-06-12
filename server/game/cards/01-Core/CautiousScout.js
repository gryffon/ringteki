const DrawCard = require('../../drawcard.js');
const { Locations, Players } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class CautiousScout extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            match: card => card === this.game.currentConflict.conflictProvince,
            targetLocation: Locations.Provinces,
            targetController: Players.Opponent,
            condition: context => context.source.isAttacking() && this.game.currentConflict.getNumberOfParticipantsFor('attacker') === 1,
            effect: AbilityDsl.effects.blank()
        });
    }
}

CautiousScout.id = 'cautious-scout';

module.exports = CautiousScout;
