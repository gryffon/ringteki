const DrawCard = require('../../drawcard.js');
const { Elements } = require('../../Constants');

class IsawaKaede extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.immunity({
                restricts: 'opponentsRingEffects'
            })
        });
        this.persistentEffect({
            effect: ability.effects.addElementAsAttacker(Elements.Void)
        });
        this.persistentEffect({
            condition: context => context.source.isAttacking() && this.game.currentConflict.winner === context.player,
            effect: ability.effects.modifyConflictElementsToResolve(5)
        });
    }
}

IsawaKaede.id = 'isawa-kaede';

module.exports = IsawaKaede;
