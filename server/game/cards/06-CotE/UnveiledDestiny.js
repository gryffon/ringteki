const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class UnveiledDestiny extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.player.role && context.source.parent.isAttacking(),
            match: ring => ring.contested,
            effect: context => context.player.role.getElement().map(element => AbilityDsl.effects.addElement(element))
        });
    }
}

UnveiledDestiny.id = 'unveiled-destiny';

module.exports = UnveiledDestiny;
