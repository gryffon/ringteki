const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class KuniRitsuko extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Remove a fate',
            when: {
                afterConflict: (event, context) => event.conflict.winner === context.player && context.source.isDefending()
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: ability.actions.removeFate()
            }
        });
    }
}

KuniRitsuko.id = 'kuni-ritsuko';

module.exports = KuniRitsuko;
