const DrawCard = require('../../drawcard.js');

class HidaTomonatsu extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Return a character to deck',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isDefending()
            },
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: 'character',
                gameAction: 'returnToDeck',
                cardCondition: card => card.isAttacking() && !card.isUnique()
            },
            message: '{0} sacrifices {1} to move {2} to the top of their owner\'s deck'
        });
    }
}

HidaTomonatsu.id = 'hida-tomonatsu';

module.exports = HidaTomonatsu;
