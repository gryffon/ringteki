const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { TargetModes, Durations } = require('../../Constants');

class KujirasHireling extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: '+1/+1 or -1/-1',
            cost: AbilityDsl.costs.payFate(),
            anyPlayer: true,
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            target: {
                mode: TargetModes.Select,
                choices: {
                    '+1/+1': AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyBothSkills(1),
                        duration: Durations.UntilEndOfPhase
                    }),
                    '-1/-1': AbilityDsl.actions.cardLastingEffect({
                        effect: AbilityDsl.effects.modifyBothSkills(-1),
                        duration: Durations.UntilEndOfPhase
                    })
                }
            },
            effect: 'give {0} {1}',
            effectArgs: context => context.select.toLowerCase()
        });
    }
}

KujirasHireling.id = 'kujira-s-hireling';

module.exports = KujirasHireling;
