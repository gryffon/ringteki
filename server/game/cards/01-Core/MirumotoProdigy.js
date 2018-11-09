const DrawCard = require('../../drawcard.js');

class MirumotoProdigy extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context =>
                context.source.isAttacking() &&
                this.game.currentConflict.getNumberOfParticipantsFor('attacker') === 1,
            effect: ability.effects.restrictNumberOfDefenders(1)
        });
    }
}

MirumotoProdigy.id = 'mirumoto-prodigy';

module.exports = MirumotoProdigy;
