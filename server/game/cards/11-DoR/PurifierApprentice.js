const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class PurifierApprentice extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Force opponent to lose 1 honor',
            when: { afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.player },
            gameAction: AbilityDsl.actions.loseHonor()
        });
    }
}

PurifierApprentice.id = 'purifier-apprentice';

module.exports = PurifierApprentice;
