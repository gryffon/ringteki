const DrawCard = require('../../drawcard.js');
const { CardTypes, ConflictTypes } = require('../../Constants');
const AbilityDsl = require('../../abilitydsl');

class GiveNoGround extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Increase a character\'s military skill',
            condition: () => this.game.isDuringConflict(ConflictTypes.Military),
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => card.isDefending(),
                gameAction: AbilityDsl.actions.cardLastingEffect(context => ({
                    effect: [
                        AbilityDsl.effects.modifyMilitarySkill(2),
                        AbilityDsl.effects.suppressEffects(effect => effect && effect.isSkillModifier() && (effect.getValue() < 0 || effect.getValue(context.target) < 0)),
                        AbilityDsl.effects.cannotApplyLastingEffects(effect => effect && effect.isSkillModifier() && (effect.getValue() < 0 || effect.getValue(context.target) < 0))
                    ]
                }))
            },
            effect: 'give +2{1} to {0} and prevent its skills from being reduced',
            effectArgs: ['military']
        });
    }
}

GiveNoGround.id = 'give-no-ground';

module.exports = GiveNoGround;
