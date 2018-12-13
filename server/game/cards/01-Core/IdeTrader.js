const DrawCard = require('../../drawcard.js');
const { TargetModes } = require('../../Constants');

class IdeTrader extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain a fate/card',
            when: {
                onMoveToConflict: (event, context) => context.source.isParticipating()
            },
            collectiveTrigger: true,
            limit: ability.limit.perConflict(1),
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Gain 1 fate': ability.actions.gainFate(),
                    'Draw 1 card': ability.actions.draw()
                }
            }
        });
    }
}

IdeTrader.id = 'ide-trader';

module.exports = IdeTrader;
