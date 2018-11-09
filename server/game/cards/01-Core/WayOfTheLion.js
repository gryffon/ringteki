const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');

class WayOfTheLion extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Double the base mil of a character',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('lion') && card.getBaseMilitarySkill() > 0,
                gameAction: ability.actions.cardLastingEffect(context => ({
                    effect: ability.effects.modifyBaseMilitarySkill(context.target.getBaseMilitarySkill())
                }))
            },
            effect: 'double the base {1} skill of {0}',
            effectArgs: () => 'military'
        });
    }
}

WayOfTheLion.id = 'way-of-the-lion';

module.exports = WayOfTheLion;
