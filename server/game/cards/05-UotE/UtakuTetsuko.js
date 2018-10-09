const DrawCard = require('../../drawcard.js');

class UtakuTetsuko extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.isAttacking(),
            targetType: 'player',
            targetController: 'opponent',
            effect: ability.effects.increaseCost({
                amount: 1,
                match: card => ['event', 'character', 'attachment'].includes(card.type)
            })
        });
    }
}

UtakuTetsuko.id = 'utaku-tetsuko';

module.exports = UtakuTetsuko;
