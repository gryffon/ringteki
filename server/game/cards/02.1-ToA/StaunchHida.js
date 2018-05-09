const DrawCard = require('../../drawcard.js');

class StaunchHida extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Resolve the ring effect',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isDefending()
            },
            gameAction: ability.action.resolveRing()
        });
    }
}

StaunchHida.id = 'staunch-hida';

module.exports = StaunchHida;
