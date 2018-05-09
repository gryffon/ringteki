const DrawCard = require('../../drawcard.js');

class TogashiYokuni extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Copy another character\'s ability', //need to protect this title
            max: ability.limit.perRound(1),
            target: {
                activePromptTitle: 'Select a character to copy from',
                mode: 'ability',
                cardType: 'character',
                cardCondition: (card, context) => card.location === 'play area' && card !== context.source 
            },
            effect: 'copy {1}\'s \'{2}\' ability',
            effectArgs: context => [context.targetAbility.card, context.targetAbility.title],
            handler: context => {
                // We need to keep the old abilityIdentifier
                let newProps = { printedAbility: false, abilityIdentifier: context.targetAbility.abilityIdentifier };
                if(context.targetAbility.properties.limit) {
                    // If the copied ability has a limit, we need to create a new instantiation of it, with the same max and reset event
                    newProps.limit = ability.limit.repeatable(context.targetAbility.properties.limit.max, context.targetAbility.properties.limit.eventName);
                }
                if(context.targetAbility.properties.max) {
                    // Same for max
                    newProps.max = ability.limit.repeatable(context.targetAbility.properties.max.max, context.targetAbility.properties.max.eventName);
                }
                context.source.untilEndOfPhase(ability => ({
                    match: context.source,
                    effect: ability.effects.gainAbility(context.targetAbility.abilityType, Object.assign({}, context.targetAbility.properties, newProps))
                }));
            }
        });
    }
}

TogashiYokuni.id = 'togashi-yokuni';

module.exports = TogashiYokuni;

