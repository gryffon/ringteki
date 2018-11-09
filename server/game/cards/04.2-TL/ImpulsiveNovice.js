const DrawCard = require('../../drawcard.js');

class ImpulsiveNovice extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: context => (
                this.game.rings.fire.isConsideredClaimed(context.player) ||
                this.game.rings.void.isConsideredClaimed(context.player)
            ),
            effect: ability.effects.modifyBothSkills(1)
        });
    }
}

ImpulsiveNovice.id = 'impulsive-novice';

module.exports = ImpulsiveNovice;
