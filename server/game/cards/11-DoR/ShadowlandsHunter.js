const DrawCard = require('../../drawcard.js');

class ShadowlandsHunter extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isAttacking() && this.game.currentConflict.winner === context.player,
            effect: ability.effects.forceConflictUnopposed()
        });
    }
}

ShadowlandsHunter.id = 'shadowlands-hunter';

module.exports = ShadowlandsHunter;


