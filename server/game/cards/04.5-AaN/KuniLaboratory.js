const DrawCard = require('../../drawcard.js');

class KuniLaboratory extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: card => card.getType() === 'character' && card.location === 'play area',
            targetController: 'self',
            effect: ability.effects.modifyBothSkills(1)
        });

        this.forcedReaction({
            title: 'After the conflict phase begins lose 1 honor',
            when: {
                onPhaseStarted: event => event.phase === 'conflict'
            },
            gameAction: ability.actions.loseHonor()
        });
    }
}

KuniLaboratory.id = 'kuni-laboratory';

module.exports = KuniLaboratory;
