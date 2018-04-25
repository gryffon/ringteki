const DrawCard = require('../../drawcard.js');

class BrashSamurai extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Honor this character',
            gameAction: ability.actions.honor(),
            condition: context => context.source.isAttacking() && this.game.currentConflict.attackers.length === 1 ||
                                  context.source.isDefending() && this.game.currentConflict.defenders.length === 1
        });
    }
}

BrashSamurai.id = 'brash-samurai';

module.exports = BrashSamurai;
