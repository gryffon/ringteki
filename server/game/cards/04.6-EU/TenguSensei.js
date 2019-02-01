const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');

class TenguSensei extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Prevent a character from attacking this phase',
            when: {
                onCovertResolved: (event, context) => event.card === context.source
            },
            effect: 'prevent {1} from attacking this phase',
            effectArgs: context => context.event.context.target,
            gameAction: ability.actions.cardLastingEffect(context => ({
                target: context.event.context.target,
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.cardCannot('declareAsAttacker')
            }))
        });
    }
}

TenguSensei.id = 'tengu-sensei';

module.exports = TenguSensei;
