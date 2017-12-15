const ProvinceCard = require('../../provincecard.js');

class MeditationsOnTheTao extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove a fate from a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince === this,
            target: {
                cardType: 'character',
                gameAction: 'removeFate',
                cardCondition: card => card.isAttacking() && card.fate > 0
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to remove a fate from {2}', this.controller, this, context.target);
                this.game.raiseEvent('onCardRemoveFate', {
                    card: context.target,
                    fate: 1
                });
            }
        });
    }
}

MeditationsOnTheTao.id = 'meditations-on-the-tao';

module.exports = MeditationsOnTheTao;
