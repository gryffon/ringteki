const DrawCard = require('../../drawcard.js');

class HawkTattoo extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Move attached character to the conflict',
            when: {
                onCardPlayed: (event, context) => event.card === context.source && context.source.parent
            },
            gameAction: [
                ability.actions.moveToConflict(context => ({ target: context.source.parent })),
                ability.actions.playerLastingEffect(context => ({
                    effect: context.source.parent.hasTrait('monk') ? ability.effects.gainActionPhasePriority() : []
                }))
            ]
        });
    }
}

HawkTattoo.id = 'hawk-tattoo';

module.exports = HawkTattoo;
