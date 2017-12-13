const DrawCard = require('../../drawcard.js');

class KuniRitsuko extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Remove a fate',
            when: {
                afterConflict: event => event.conflict.winner === this.controller && event.conflict.isDefending(this)
            },
            target: {
                cardType: 'character',
                cardCondition: card => card.isAttacking() && card.fate > 0
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to remove a fate from {2}', this.controller, this, context.target);
                context.target.modifyFate(-1);
            }
        });
    }
}

MiyaSatoshi.id = 'kuni-ritsuko';

module.exports = KuniRitsuko;
