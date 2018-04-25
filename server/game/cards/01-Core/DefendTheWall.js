const ProvinceCard = require('../../provincecard.js');

class DefendTheWall extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve the ring effect',
            when: {
                afterConflict: (event, context) => event.conflict.conflictProvince === context.source && 
                                                   event.conflict.winner === context.player
            },
            message: '{0} uses {1} to resolve the ring effect',
            handler: context => context.event.conflict.resolveRing(context.player)
        });
    }
}

DefendTheWall.id = 'defend-the-wall';

module.exports = DefendTheWall;
