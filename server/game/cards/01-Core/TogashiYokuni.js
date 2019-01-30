const DrawCard = require('../../drawcard.js');
const { Durations, TargetModes, CardTypes } = require('../../Constants');

class TogashiYokuni extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Copy another character\'s ability',
            target: {
                activePromptTitle: 'Select a character to copy from',
                mode: TargetModes.Ability,
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card !== context.source,
                abilityCondition: ability => ability.printedAbility,
                gameAction: ability.actions.cardLastingEffect(context => ({
                    duration: Durations.UntilEndOfPhase,
                    effect: ability.effects.gainAbility(context.targetAbility.abilityType, context.targetAbility)
                }))
            },
            effect: 'copy {1}\'s \'{2}\' ability',
            effectArgs: context => [context.targetAbility.card, context.targetAbility.title],
            max: ability.limit.perRound(1)
        });
    }
}

TogashiYokuni.id = 'togashi-yokuni';

module.exports = TogashiYokuni;

