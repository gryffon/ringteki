const DrawCard = require('../../drawcard.js');

class HonoredBlade extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Gain 1 honor',
            when: {
                afterConflict: (event, context) => context.source.parent.isParticipating() && event.conflict.winner === context.player
            },
            message: '{0} uses {1} to gain 1 honor',
            handler: context => this.game.addHonor(context.player, 1)
        });
    }
}

HonoredBlade.id = 'honored-blade';

module.exports = HonoredBlade;
