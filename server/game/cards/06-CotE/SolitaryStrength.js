const DrawCard = require('../../drawcard.js');

class SolitaryStrength extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context =>
                context.source.isAttacking() &&
                this.game.currentConflict.getNumberOfParticipantsFor('attacker') === 1,
            effect: ability.effects.restrictNumberOfDefenders(1)
        });
    }
}

SolitaryStrength.id = 'solitary-strength';

module.exports = SolitaryStrength;
