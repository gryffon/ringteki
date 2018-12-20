const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes } = require('../../Constants');

class HidaAmoro extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            title: 'Sacrifice a character',
            when: {
                onConflictPass: () => true
            },
            limit: AbilityDsl.limit.perPhase(Infinity),
            effect: 'force {1} to sacrifice a character',
            effectArgs: context => context.event.conflict.attackingPlayer,
            gameAction: AbilityDsl.actions.selectCard(context => ({
                player: context.event.conflict.attackingPlayer,
                activePromptTitle: 'Choose a character to sacrifice',
                cardType: CardTypes.Character,
                cardCondition: card => card.controller === context.event.conflict.attackingPlayer,
                message: '{0} sacrifices {1} to {2}',
                messageArgs: card => [context.player.opponent, card, context.source],
                gameAction: AbilityDsl.actions.sacrifice()
            }))
        });
    }
}

HidaAmoro.id = 'hida-amoro';

module.exports = HidaAmoro;
