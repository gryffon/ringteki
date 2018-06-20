const DrawCard = require('../../drawcard.js');

class TheMirrorsGaze extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Mirror an opponent\'s event',
            when: {
                onAbilityResolved: (event, context) => event.card.type === 'event' && !event.context.ability.cannotBeMirrored &&
                                                       event.context.player === context.player.opponent &&
                                                       !context.player.isAbilityAtMax(event.context.ability.maxIdentifier)
            },
            gameAction: ability.actions.resolveAbility(context => ({
                target: context.event.card,
                ability: context.event.context.ability
            }))
        });
    }
}

TheMirrorsGaze.id = 'the-mirror-s-gaze';

module.exports = TheMirrorsGaze;
