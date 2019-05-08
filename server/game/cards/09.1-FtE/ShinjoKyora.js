const DrawCard = require('../../drawcard.js');
const { TargetModes } = require('../../Constants');


class ShinjoKyora extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Switch the contested ring',
            condition: context => context.source.isParticipating(),
            target: {
                ringCondition: ring => ring.isUnclaimed(),
                mode: TargetModes.Ring
            },
            effect: 'change the conflict ring to {0}',
            handler: context => this.game.currentConflict.switchElement(context.ring.element)
        });
    }
}

ShinjoKyora.id = 'shinjo-kyora';

module.exports = ShinjoKyora;
