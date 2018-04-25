const DrawCard = require('../../drawcard.js');

class DaidojiNerishma extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Flip a card faceup',
            target: {
                cardCondition: (card, context) => card.isDynasty && card.facedown && card.controller === context.player &&
                                                  ['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location)
            },
            message: '{0} uses {1} to flip {2} faceup',
            handler: context => context.target.facedown = false
        });
    }
}

DaidojiNerishma.id = 'daidoji-nerishma';

module.exports = DaidojiNerishma;
