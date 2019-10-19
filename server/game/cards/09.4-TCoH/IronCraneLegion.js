const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');

class IronCraneLegion extends DrawCard {
    setupCardAbilities() {
        this.persistentEffect({
            condition: context => context.game.isDuringConflict(),
            effect: AbilityDsl.effects.calculatePrintedMilitarySkill(card => card.controller.opponent && card.controller.opponent.hand.size())
        });
    }
}

IronCraneLegion.id = 'iron-crane-legion';

module.exports = IronCraneLegion;

