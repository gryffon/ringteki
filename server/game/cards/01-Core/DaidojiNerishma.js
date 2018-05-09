const DrawCard = require('../../drawcard.js');

class DaidojiNerishma extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Flip a card faceup',
            target: {
                cardCondition: (card, context) => card.isDynasty && card.facedown && card.controller === context.player &&
                                                  ['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location),
                gameAction: ability.actions.flipDynasty()
            }
        });
    }
}

DaidojiNerishma.id = 'daidoji-nerishma';

module.exports = DaidojiNerishma;
