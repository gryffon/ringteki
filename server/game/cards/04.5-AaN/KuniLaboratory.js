const DrawCard = require('../../drawcard.js');
const { Phases, CardTypes } = require('../../Constants');

class KuniLaboratory extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === CardTypes.Character,
            effect: ability.effects.modifyBothSkills(1)
        });

        this.forcedReaction({
            title: 'After the conflict phase begins',
            when: {
                onPhaseStarted: event => event.phase === Phases.Conflict
            },
            effect: 'lose an honor',
            gameAction: ability.actions.loseHonor(context => ({ target: context.player }))
        });
    }
}

KuniLaboratory.id = 'kuni-laboratory';

module.exports = KuniLaboratory;
