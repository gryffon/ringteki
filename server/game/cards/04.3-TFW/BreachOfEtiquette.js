const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { Players, CardTypes } = require('../../Constants');

class BreachOfEtiquette extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Force honor loss on players when their non-courtier characters use abilities',
            condition: () => this.game.isDuringConflict('political'),
            effect: 'force honor loss on players when their non-courtier characters use abilities during this conflict',
            gameAction: AbilityDsl.actions.multiple([
                AbilityDsl.actions.playerLastingEffect(context => ({
                    effect: AbilityDsl.effects.playerDelayedEffect({
                        when: {
                            onCardAbilityTriggered: event =>
                                event.player === context.player && event.card.type === CardTypes.Character && !event.card.hasTrait('courtier')
                        },
                        message: '{1} loses 1 honor due to {0}',
                        messageArgs: effectContext => [context.player, effectContext.source],
                        multipleTrigger: true,
                        gameAction: AbilityDsl.actions.loseHonor()
                    })
                })),
                AbilityDsl.actions.playerLastingEffect(context => ({
                    targetController: Players.Opponent,
                    effect: AbilityDsl.effects.playerDelayedEffect({
                        when: {
                            onCardAbilityTriggered: event =>
                                event.player === context.player.opponent && event.card.type === CardTypes.Character && !event.card.hasTrait('courtier')
                        },
                        message: '{1} loses 1 honor due to {0}',
                        messageArgs: effectContext => [context.player.opponent, effectContext.source],
                        multipleTrigger: true,
                        gameAction: AbilityDsl.actions.loseHonor()
                    })
                }))
            ])
        });
    }
}

BreachOfEtiquette.id = 'breach-of-etiquette';

module.exports = BreachOfEtiquette;
