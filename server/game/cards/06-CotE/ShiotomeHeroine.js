const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class ShiotomeHeroine extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Ready this character',
            when: {
                onModifyHonor: (event, context) => event.amount > 0 && context.player.opponent && event.player === context.player.opponent
            },
            gameAction: AbilityDsl.actions.ready()
        });
    }
}

ShiotomeHeroine.id = 'shiotome-heroine';

module.exports = ShiotomeHeroine;
