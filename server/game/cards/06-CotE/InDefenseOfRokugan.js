const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class InDefenseOfRokugan extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Set an attacking character to 0 military skill',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.sacrifice({
                cardType: CardTypes.Character,
                cardCondition: card => card.isDefending()
            }),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isAttacking(),
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.setMilitarySkill(0)
                })
            },
            effect: 'set {0}\'s {1} skill to 0',
            effectArgs: () => 'military'
        });
    }
}

InDefenseOfRokugan.id = 'in-defense-of-rokugan';

module.exports = InDefenseOfRokugan;
