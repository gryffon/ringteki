const DrawCard = require('../../drawcard.js');

class WayOfTheLion extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Double the base mil of a character',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area' && card.isFaction('lion') && 
                                       !card.hasDash('military') && card.getBaseMilitarySkill() > 0
            },
            effect: 'double the base {1} skill of {0}',
            effectArgs: () => 'military',
            untilEndOfConflict: context => ({
                match: context.target,
                effect: ability.effects.modifyBaseMilitarySkill(context.target.getBaseMilitarySkill())
            })
        });
    }
}

WayOfTheLion.id = 'way-of-the-lion';

module.exports = WayOfTheLion;
