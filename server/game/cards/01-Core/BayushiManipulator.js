const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BayushiManipulator extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Increase bid by 1',
            when: {
                onHonorDialsRevealed: () => true
            },
            effect: 'increase their bid by 1',
            gameAction: AbilityDsl.actions.modifyBid()
        });
    }
}

BayushiManipulator.id = 'bayushi-manipulator';

module.exports = BayushiManipulator;
