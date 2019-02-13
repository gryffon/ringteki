const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class ParagonOfGrace extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard opponent\'s card',
            condition: context =>
                context.source.isParticipating() &&
                this.game.currentConflict.getNumberOfParticipantsFor(context.source.controller) === 1,
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.discardAtRandom(context => ({ target: context.source.isHonored ? context.player.opponent : [] })),
                AbilityDsl.actions.chosenDiscard(context => ({ target: context.source.isHonored ? [] : context.player.opponent }))
            ])
        });
    }
}

ParagonOfGrace.id = 'paragon-of-grace';

module.exports = ParagonOfGrace;
