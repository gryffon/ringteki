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
            ]),
            effect: 'make {1} discard 1 card{2}',
            effectArgs: context => [context.player.opponent, context.source.isHonored ? ' at random' : '']
        });
    }
}

ParagonOfGrace.id = 'paragon-of-grace';

module.exports = ParagonOfGrace;
