const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, Durations } = require('../../Constants');

class MomentOfPerfectBeauty extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'One more action and then end the conflict',
            condition: context => this.game.isDuringConflict() &&
                    this.game.currentConflict.getNumberOfParticipantsFor(context.player, card => card.isHonored) >
                    this.game.currentConflict.getNumberOfParticipantsFor(context.player.opponent, card => card.isHonored),
            gameAction: AbilityDsl.actions.playerLastingEffect({
                duration: Durations.UntilEndOfConflict,
                targetController: Players.Opponent,
                effect: AbilityDsl.effects.resolveConflictEarly()
            }),
            effect: 'resolve the conflict after {1]\'s next action',
            effectArgs: context => [context.player.opponent]
        });
    }
}

MomentOfPerfectBeauty.id = 'moment-of-perfect-beauty';

module.exports = MomentOfPerfectBeauty;
