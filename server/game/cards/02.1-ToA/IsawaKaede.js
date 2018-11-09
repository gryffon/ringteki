const DrawCard = require('../../drawcard.js');

class IsawaKaede extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.immunity({
                restricts: 'opponentsRingEffects'
            })
        });
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            match: ring => ring.contested,
            effect: ability.effects.addElement('void')
        });
        this.persistentEffect({
            condition: context => context.source.isAttacking() && this.game.currentConflict.winner === context.player,
            effect: ability.effects.modifyConflictElementsToResolve(5)
        });
    }
}

IsawaKaede.id = 'isawa-kaede';

module.exports = IsawaKaede;
