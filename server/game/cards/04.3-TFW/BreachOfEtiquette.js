const DrawCard = require('../../drawcard.js');
const { Players } = require('../../Constants');

class BreachOfEtiquette extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Force honor loss on players when their non-courtier characters use abilities',
            condition: () => this.game.isDuringConflict('political'),
            effect: 'force honor loss on players when their non-courtier characters use abilities during this conflict',
            gameAction: ability.actions.playerLastingEffect(context => ({
                targetController: Players.Any,
                effect: ability.effects.customDetachedPlayer({
                    apply: player => context.source.delayedEffect(ability => ({
                        target: player,
                        source: context.source,
                        context: context,
                        when: {
                            onCardAbilityTriggered: event =>
                                event.player === player && event.card.type === 'character' && !event.card.hasTrait('courtier')
                        },
                        gameAction: ability.actions.loseHonor(),
                        message: '{1} loses 1 honor due to {0}',
                        multipleTrigger: true
                    })),
                    unapply: (player, context, effect) => context.game.effectEngine.removeDelayedEffect(effect)
                })
            }))
        });
    }
}

BreachOfEtiquette.id = 'breach-of-etiquette';

module.exports = BreachOfEtiquette;
