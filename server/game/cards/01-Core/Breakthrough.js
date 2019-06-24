const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class Breakthrough extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Declare a new conflict',
            when: {
                onConflictFinished: (event, context) =>
                    event.conflict.attackingPlayer === context.player && event.conflict.winner === context.player &&
                    this.game.getConflicts(context.player).filter(conflict => !conflict.passed).length === 1 &&
                    event.conflict.conflictProvince.isBroken
            },
            gameAction: AbilityDsl.actions.initiateConflict({ canPass: false })
        });
    }
}

Breakthrough.id = 'breakthrough';

module.exports = Breakthrough;
