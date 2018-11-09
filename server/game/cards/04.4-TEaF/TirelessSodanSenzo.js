const DrawCard = require('../../drawcard.js');

class TirelessSodanSenzo extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => context.source.isParticipating() && this.game.currentConflict.loser === context.player,
            effect: ability.effects.doesNotBow()
        });
    }
}

TirelessSodanSenzo.id = 'tireless-sodan-senzo';

module.exports = TirelessSodanSenzo;
