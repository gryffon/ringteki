const DrawCard = require('../../drawcard.js');

class KakitaAsami extends DrawCard {
    setupCardAbilities() {
        this.action ({
            title: 'Take one honor from your opponent',
            condition: context => {
                if(!context.source.isParticipating() || this.game.currentConflict.conflictType !== 'political' || !context.player.opponent) {
                    return false;
                }

                let diff = this.game.currentConflict.attackerSkill - this.game.currentConflict.defenderSkill;
                return context.player.isAttackingPlayer() ? diff > 0 : diff < 0;
            },
            message: '{0} uses {1} to take 1 honor from {2}',
            messageItems: context => [context.player.opponent],
            handler: context => this.game.transferHonor(context.player.opponent, context.player, 1)
        });
    }
}

KakitaAsami.id = 'kakita-asami';

module.exports = KakitaAsami;
