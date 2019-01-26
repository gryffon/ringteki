const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl.js');

class UnveiledDestiny extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.parent.isAttacking() && context.player.role.getElement(),
            match: ring => ring.contested,
            effect: context => context.player.role.getElement().forEach(element => AbilityDsl.effects.addElement(element))
        });
    }
}

UnveiledDestiny.id = 'unveiled-destiny';

module.exports = UnveiledDestiny;
