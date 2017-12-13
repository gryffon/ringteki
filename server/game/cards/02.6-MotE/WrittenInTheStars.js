const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class WrittenInTheStars extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Place or take fate from rings',
            condition: () => true,
            target: {
                player: 'self',
                mode: 'select',
                choices: {
                    'Place one fate on each unclaimed ring with no fate': context => _.any(this.game.rings, ring => {
                        return !ring.claimed && ring.getFate() === 0;
                    }),
                    'Remove one fate from each unclaimed ring': context => _.any(this.game.rings, ring => {
                        return !ring.claimed && ring.getFate() > 0;
                    })
                }
            },
            handler: context => {
                if(context.select === 'Place one fate on each unclaimed ring with no fate') {
                    _.each(this.game.rings, ring => {
                        if(!ring.claimed && ring.getFate() === 0) {
                            this.game.addMessage('{0} adds a fate to the {1} ring', this.controller, ring.getElement());
                            ring.modifyFate(1);
                        }
                    });
                } else {
                    _.each(this.game.rings, ring => {
                        if(!ring.claimed && ring.getFate() > 0) {
                            this.game.addMessage('{0} removes a fate from the {1} ring', this.controller, ring.getElement());
                            ring.modifyFate(-1);
                        }
                    });
                }
            }
        });
    }
}

WrittenInTheStars.id = 'written-in-the-stars';

module.exports = WrittenInTheStars;
