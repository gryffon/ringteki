const DrawCard = require('../../drawcard.js');

class Breakthrough extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Declare a new conflict',
            when: {
                onConflictFinished: (event, context) => {
                    return (event.conflict.conflictProvince &&
                            event.conflict.conflictProvince.isBroken && 
                            event.conflict.winner === context.player &&
                            context.player.conflicts.conflictOpportunities > 0);
                }
            },
            effect: 'move straight to their next conflict!',
            handler: context => context.event.conflict.winnerGoesStraightToNextConflict = true
        });
    }
}

Breakthrough.id = 'breakthrough';

module.exports = Breakthrough;
