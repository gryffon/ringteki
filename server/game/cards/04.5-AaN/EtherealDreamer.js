const DrawCard = require('../../drawcard.js');

class EtherealDreamer extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain +2/+2 while contesting the target ring',
            when: {
                onPhaseStarted: event => event.phase === 'conflict'
            },
            target: {
                mode: 'ring',
                ringCondition: () => true
            },
            effect: 'Gain +2{1}/+2{2} while {0} is contested',
            effectArgs: ['military', 'political'],
            gameAction: ability.actions.cardLastingEffect(context => ({
                duration: 'untilEndOfPhase',
                condition: () => this.game.currentConflict && this.game.currentConflict.ring === context.ring,
                effect: ability.effects.modifyBothSkills(2)
            }))
        });
    }
}

EtherealDreamer.id = 'ethereal-dreamer';

module.exports = EtherealDreamer;
