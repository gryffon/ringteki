const ProvinceCard = require('../../provincecard.js');

class DefendTheWall extends ProvinceCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Resolve the ring effect',
            when: {
                afterConflict: (event, context) => event.conflict.conflictProvince === context.source && 
                                                   event.conflict.winner === context.player
            },
            effect: 'resolve the ring effect',
            handler: context => context.event.conflict.resolveRing(context.player)
        });
    }
}

DefendTheWall.id = 'defend-the-wall';

module.exports = DefendTheWall;
