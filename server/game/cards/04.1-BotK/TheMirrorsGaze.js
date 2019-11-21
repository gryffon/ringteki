const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class TheMirrorsGaze extends DrawCard {
    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true,
            trait: 'shugenja'
        });

        this.reaction({
            title: 'Mirror an opponent\'s event',
            when: {
                onCardAbilityTriggered: (event, context) => event.card.type === CardTypes.Event && !event.context.ability.cannotBeMirrored &&
                    event.context.player === context.player.opponent && !event.cancelled
            },
            gameAction: ability.actions.resolveAbility(context => ({
                target: context.event.card,
                ability: context.event.context.ability,
                ignoredRequirements: ['cost', 'condition', 'limit'],
                event: context.event.context.event
            }))
        });
    }
}

TheMirrorsGaze.id = 'the-mirror-s-gaze';

module.exports = TheMirrorsGaze;
