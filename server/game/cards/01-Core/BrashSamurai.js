const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class BrashSamurai extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Honor this character',
            condition: context =>
                context.source.isParticipating() &&
                this.game.currentConflict.getNumberOfParticipantsFor(context.source.controller) === 1,
            gameAction: AbilityDsl.actions.honor()
        });
    }
}

BrashSamurai.id = 'brash-samurai';

module.exports = BrashSamurai;
