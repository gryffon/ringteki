const DrawCard = require('../../drawcard.js');
const { Durations } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class ShinjoYasamura extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Prevent a character from defending this phase',
            when: {
                onCovertResolved: (event, context) => event.card === context.source && event.context.target.covert
            },
            effect: 'prevent {1} from defending this phase',
            effectArgs: context => context.event.context.target,
            gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                target: context.event.context.target,
                duration: Durations.UntilEndOfPhase,
                effect: AbilityDsl.effects.cardCannot('declareAsDefender')
            }))
        });
    }
}

ShinjoYasamura.id = 'shinjo-yasamura';

module.exports = ShinjoYasamura;
