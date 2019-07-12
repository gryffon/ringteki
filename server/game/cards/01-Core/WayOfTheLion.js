const DrawCard = require('../../drawcard.js');
const { CardTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class WayOfTheLion extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Double the base mil of a character',
            condition: () => this.game.isDuringConflict(),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('lion') && card.getBaseMilitarySkill() > 0,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    effect: AbilityDsl.effects.modifyBaseMilitarySkillMultiplier(2)
                })
            },
            effect: 'double the base {1} skill of {0}',
            effectArgs: () => 'military'
        });
    }
}

WayOfTheLion.id = 'way-of-the-lion';

module.exports = WayOfTheLion;
