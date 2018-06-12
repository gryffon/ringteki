const DrawCard = require('../../drawcard.js');

class BayushiManipulator extends DrawCard {
    setupCardAbilities() {
        // TODO modifyBid action
        this.reaction({
            title: 'Increase bid by 1',
            when: {
                onHonorDialsRevealed: () => true
            },
            effect: 'increase their bid by 1',
            handler: context => context.player.honorBid++
        });
    }
}

BayushiManipulator.id = 'bayushi-manipulator';

module.exports = BayushiManipulator;
