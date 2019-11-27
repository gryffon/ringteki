const DrawCard = require('../../drawcard.js');
const AbilityDsl = require('../../abilitydsl');
const { CardTypes, Players } = require('../../Constants');

class Deduction extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Bow a character',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictType === 'political',
            cost: AbilityDsl.costs.returnRings(1),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Any,
                cardCondition: (card) => card.costLessThan(4) && card.isParticipating(),
                gameAction: AbilityDsl.actions.bow()
            }
        });
    }
}

Deduction.id = 'deduction';

module.exports = Deduction;
