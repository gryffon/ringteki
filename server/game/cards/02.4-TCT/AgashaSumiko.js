const DrawCard = require('../../drawcard.js');

class AgashaSumiko extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => (
                context.player.imperialFavor !== '' &&
                context.source.isAttacking()
            ),
            effect: ability.effects.doesNotBow()
        });
    }
}

AgashaSumiko.id = 'agasha-sumiko';

module.exports = AgashaSumiko;
