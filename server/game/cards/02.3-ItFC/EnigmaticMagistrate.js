const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class EnigmaticMagistrate extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.source.isAttacking(),
            effect: AbilityDsl.effects.cannotContribute(() => {
                return card => card.getCost() === 0 || card.getCost() && card.getCost() % 2 === 0;
            })
        });
    }
}

EnigmaticMagistrate.id = 'enigmatic-magistrate';

module.exports = EnigmaticMagistrate;
