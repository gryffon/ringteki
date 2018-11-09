const DrawCard = require('../../drawcard.js');
const { TargetModes, Phases } = require('../../Constants');

class MeddlingMediator extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Take 1 fate or 1 honor',
            phase: Phases.Conflict,
            condition: context => this.game.getConflicts(context.player.opponent).filter(conflict => !conflict.passed).length > 1,
            target: {
                mode: TargetModes.Select,
                choices: {
                    'Take 1 fate': ability.actions.takeFate(),
                    'Take 1 honor': ability.actions.takeHonor()
                }
            }
        });
    }
}

MeddlingMediator.id = 'meddling-mediator';

module.exports = MeddlingMediator;
