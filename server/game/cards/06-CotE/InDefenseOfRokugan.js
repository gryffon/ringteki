const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class InDefenseOfRokugan extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Set an attacking character to 0 military skill',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.sacrifice(card => card.type === CardTypes.Character && card.isDefending()),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.setMilitarySkill(0)
                })
            }
        });
    }
}

InDefenseOfRokugan.id = 'in-defense-of-rokugan';

module.exports = InDefenseOfRokugan;
